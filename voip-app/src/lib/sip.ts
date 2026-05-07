import { 
  UserAgent, 
  UserAgentOptions, 
  Inviter, 
  SessionState, 
  Invitation, 
  Registerer,
  UserAgentState
} from 'sip.js';


export const SIP_SERVER = '10.207.168.17'; 
export const WS_SERVER = `ws://${SIP_SERVER}:8088`;

let userAgent: UserAgent | null = null;
let registerer: Registerer | null = null;
let currentSession: Inviter | Invitation | null = null;

// Fungsi Helper untuk memasang audio ke HTML
const setupRemoteAudio = (session: Inviter | Invitation) => {
  session.stateChange.addListener((state) => {
    if (state === SessionState.Established) {
      const remoteStream = new MediaStream();
      // @ts-ignore - Mengambil track audio dari peerConnection
      const pc = session.sessionDescriptionHandler.peerConnection;
      pc.getReceivers().forEach((receiver: any) => {
        if (receiver.track) remoteStream.addTrack(receiver.track);
      });

      const remoteAudio = document.getElementById('remoteAudio') as HTMLAudioElement;
      if (remoteAudio) {
        remoteAudio.srcObject = remoteStream;
        remoteAudio.play().catch(console.error);
      }
    }
  });
};

export const initSipUserAgent = async (extension: string, password?: string) => {
  if (userAgent && userAgent.state !== UserAgentState.Stopped) {
    await userAgent.stop();
  }

  const uri = UserAgent.makeURI(`sip:${extension}@${SIP_SERVER}`);
  if (!uri) throw new Error('Invalid SIP URI');

  const options: UserAgentOptions = {
    authorizationPassword: password, 
    authorizationUsername: extension,
    transportOptions: { server: WS_SERVER }, 
    uri: uri,
    delegate: {
      onInvite: (invitation: Invitation) => {
        console.log('Ada panggilan masuk dari:', invitation.remoteIdentity.uri.user);
        currentSession = invitation;
        
        setupRemoteAudio(invitation);
        invitation.accept({
          sessionDescriptionHandlerOptions: { constraints: { audio: true, video: false } }
        });
      }
    },
    sessionDescriptionHandlerFactoryOptions: {
      peerConnectionOptions: {
        rtcConfiguration: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
      }
    }
  };

  userAgent = new UserAgent(options);
  await userAgent.start();

  registerer = new Registerer(userAgent);
  await registerer.register();

  return userAgent;
};

export const makeCall = async (targetExtension: string, onStateChange: (state: SessionState) => void) => {
  if (!userAgent) throw new Error('UserAgent not initialized');

  const targetURI = UserAgent.makeURI(`sip:${targetExtension}@${SIP_SERVER}`);
  const inviter = new Inviter(userAgent, targetURI!);
  currentSession = inviter;

  inviter.stateChange.addListener((state) => {
    console.log('Call state:', state);
    onStateChange(state);
  });

  setupRemoteAudio(inviter);

  await inviter.invite({
    sessionDescriptionHandlerOptions: { constraints: { audio: true, video: false } }
  });
  
  return inviter;
};

export const hangupCall = async () => {
  if (currentSession) {
    if (currentSession.state === SessionState.Established) {
      // Tutup telepon jika sedang dalam panggilan
      await (currentSession as any).bye();
    } else if (currentSession.state === SessionState.Initial || currentSession.state === SessionState.Establishing) {
      // Batalkan panggilan sebelum diangkat
      if (currentSession instanceof Inviter) {
          await currentSession.cancel();
      } else if (currentSession instanceof Invitation) {
          await currentSession.reject();
      }
    }
    currentSession = null;
  }
};