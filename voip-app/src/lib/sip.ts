import { UserAgent, UserAgentOptions, Inviter, SessionState, InviterOptions, URI } from 'sip.js';

// Configuration for Kamailio connection
export const SIP_SERVER = 'sip.example.com';
export const WSS_SERVER = 'wss://sip.example.com:4443';

let userAgent: UserAgent | null = null;
let currentSession: Inviter | null = null;

export const initSipUserAgent = async (extension: string, password?: string) => {
  if (userAgent) {
    await userAgent.stop();
  }

  const uri = UserAgent.makeURI(`sip:${extension}@${SIP_SERVER}`);
  if (!uri) throw new Error('Invalid SIP URI');

  const options: UserAgentOptions = {
    authorizationPassword: password || '1234',
    authorizationUsername: extension,
    transportOptions: {
      server: WSS_SERVER,
    },
    uri: uri,
    sessionDescriptionHandlerFactoryOptions: {
      peerConnectionOptions: {
        rtcConfiguration: {
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        }
      }
    }
  };

  userAgent = new UserAgent(options);

  userAgent.delegate = {
    onInvite: (invitation) => {
      // Handle incoming call
      console.log('Incoming call...', invitation);
    }
  };

  await userAgent.start();
  return userAgent;
};

export const makeCall = async (targetExtension: string, onStateChange: (state: SessionState) => void) => {
  if (!userAgent) throw new Error('UserAgent not initialized');

  const targetURI = UserAgent.makeURI(`sip:${targetExtension}@${SIP_SERVER}`);
  if (!targetURI) throw new Error('Invalid target URI');

  const inviter = new Inviter(userAgent, targetURI);
  currentSession = inviter;

  inviter.stateChange.addListener((state: SessionState) => {
    console.log('Call state changed:', state);
    onStateChange(state);
  });

  const options: InviterOptions = {
    sessionDescriptionHandlerOptions: {
      constraints: { audio: true, video: false }
    }
  };

  await inviter.invite(options);
  return inviter;
};

export const hangupCall = async () => {
  if (currentSession) {
    if (currentSession.state === SessionState.Established) {
      await currentSession.bye();
    } else if (currentSession.state === SessionState.Establishing) {
      await currentSession.cancel();
    }
    currentSession = null;
  }
};

export const getCurrentSession = () => currentSession;
export const getUserAgent = () => userAgent;
