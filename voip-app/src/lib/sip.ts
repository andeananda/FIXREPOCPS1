import { 
  UserAgent, 
  UserAgentOptions, 
  Inviter, 
  SessionState, 
  Invitation 
} from 'sip.js';

// 1. UPDATE DENGAN IP DAN PORT KAMAILIO KAMU
export const SIP_SERVER = '10.207.168.17'; // IP Server Ubuntu Kamu
// PERUBAHAN UTAMA: Gunakan ws:// (bukan wss://) dan port 8080
export const WS_SERVER = `ws://${SIP_SERVER}:8080`;

let userAgent: UserAgent | null = null;
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
  if (userAgent) await userAgent.stop();

  const uri = UserAgent.makeURI(`sip:${extension}@${SIP_SERVER}`);
  if (!uri) throw new Error('Invalid SIP URI');

  const options: UserAgentOptions = {
    authorizationPassword: password, // Di database kamu adalah '123'
    authorizationUsername: extension,
    transportOptions: { server: WS_SERVER }, // <-- Sudah diganti ke jalur yang benar
    uri: uri,
    delegate: {
      onInvite: (invitation: Invitation) => {
        console.log('Ada panggilan masuk dari:', invitation.remoteIdentity.uri.user);
        currentSession = invitation;
        
        // Logika: Otomatis angkat untuk testing
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

// PERBAIKAN: Fungsi hangupCall yang sebelumnya terpotong
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