import { io, Socket } from 'socket.io-client';

type AcknowledgmentSuccess = {
  status: 'success';
  message: string;
};

type AcknowledgmentFailed = {
  status: 'failed';
  error: string;
};

type Acknowledgment = AcknowledgmentSuccess | AcknowledgmentFailed;

interface JoinPayload {
  room: string;
  userId?: string;
  displayName?: string;
}

interface AudioInputPayload {
  audioData: Blob;
  sampleRate?: number;
  channels?: number;
}

interface TextInputPayload {
  text: string;
}

interface QuestionRecommendationResponse {
  questions: string[];
}

interface AudioOutputResponse {
  buffer: any;
  audioData: Blob;
  sampleRate?: number;
  channels?: number;
}

export class GoVirtualEventWebSocket {
  public sio: Socket;

  constructor(
    socketUrl: string,
    accessToken: string,
    autoConnect: boolean = false
  ) {
    if (!socketUrl) {
      throw new Error('socketUrl is required and cannot be empty.');
    }

    // console.log('Connecting to:', socketUrl); 

    const _sio = io(socketUrl, {
      autoConnect,
      transports: ['polling', 'websocket'],
      auth: {
        token: accessToken, 
      },
      extraHeaders: {
        Authorization: `Bearer ${accessToken}`, 
      },
    });

    // console.log('Access Token:', accessToken);

    this.sio = _sio;
  }

  public connect = () => {
    if (!this.sio.connected) {
      this.sio.connect();
    }
  };

  public disconnect = () => {
    if (this.sio.connected) {
      this.sio.disconnect();
    }
  };

  public listenConnect = (onConnected?: () => void) => {
    this.sio.on('connect', () => {
      console.log('Connected to server');
      this.sio.emit('text_input', { text: 'Hello, Server!' });
      onConnected?.();
    });
  };

  public listenConnectError = (onConnectError?: (error: Error | string) => void) => {
    this.sio.on('connect_error', (error: Error | string) => {
      console.error('Connection error:', error);
      onConnectError?.(error);
    });
  };

  public listenDisconnect = (
    onDisconnected?: (reason: string, details: any) => void
  ) => {
    this.sio.on('disconnect', (reason: string, details: any) => {
      console.log('Disconnected:', reason);
      onDisconnected?.(reason, details);
    });
  };

  public emitJoin = (payload: JoinPayload, onAck?: (ack: Acknowledgment) => void) => {
    this.sio.emit('join', payload, (ack: Acknowledgment) => {
      onAck?.(ack);
    });
  };

  public emitAudioInput = (payload: AudioInputPayload, onAck?: (ack: Acknowledgment) => void) => {
    this.sio.emit('audio_input', payload, (ack: Acknowledgment) => {
      onAck?.(ack);
    });
  };

	public emitTextInput = (
		payload: TextInputPayload,
		onAck?: (ack: Acknowledgment) => void,
	) => {
    console.log('ni payloadnya:', payload);
    // TODO: kenapa tidak masuk ke text_input? padahal payloadnya sudah terbaca. Bagaimana cara memastikan kalau pesan masuk ke ack
		this.sio.emit('text_input', payload, (ack: Acknowledgment) => {
      console.log('ack: ', ack);
			onAck?.(ack)
		})
	}

  public listenQuestionRecommendation = (onQuestionRecommendation?: (message: QuestionRecommendationResponse) => void) => {
    this.sio.on('question_recommendation', (message: QuestionRecommendationResponse) => {
      onQuestionRecommendation?.(message);
    });
  };

  public listenMessageAssistant = (onMessageAssistant?: (message: string) => void) => {
    // TODO: bagaimana cara memastikan kalo assisten sudah mendengarkan pesan yang dikirimkan dan memberikan respon jawaban
    console.log('Listening....');
    this.sio.on('message_assistant', (message: string) => {
      console.log('Listening to message assistant: ', message);
      onMessageAssistant?.(message);
    });
  };

  public listenAudioOutput = (onAudioOutput?: (message: AudioOutputResponse) => void) => {
    this.sio.on('audio_output', (message: AudioOutputResponse) => {
      onAudioOutput?.(message);
    });
  };

  public listenStateAssistant = (onStateAssistant?: (message: string) => void) => {
    this.sio.on('state_assistant', (message: string) => {
      onStateAssistant?.(message);
    });
  };
}

// const socketUrl = 'https://ai-govirtual-assistant.ajari.app';
// const accessToken = '09468464-bad3-413d-9cea-443a978b7804';
// const goVirtualEventWebSocket = new GoVirtualEventWebSocket(socketUrl, accessToken);

// goVirtualEventWebSocket.listenConnect(() => {
//   console.log('Koneksi berhasil!');
  
//   const textPayload: TextInputPayload = { text: 'Test connection message' };
  
//   goVirtualEventWebSocket.emitTextInput(textPayload, (ack) => {
//     if (ack.status === 'success') {
//       console.log('Pesan terkirim dengan sukses:', ack.message);
//     } else {
//       console.error('Pesan gagal terkirim:', ack.error);
//     }
//   });
// });

// goVirtualEventWebSocket.listenConnectError((error) => {
//   console.error('Terjadi error saat mencoba terhubung:', error);
// });

// goVirtualEventWebSocket.connect();

