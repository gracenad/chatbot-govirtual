const TOKEN = process.env.TOKEN;

if (!TOKEN) {
    throw new Error('TOKEN environment variable is required but not defined');
}

type Connect = {
    payload: unknown;
    ack: unknown;
    headers: {
        auth: {
            token: typeof TOKEN;
        };
    };
};

type Join = {
    payload: {
        language: 'en-US';
    };
};

type AudioInput = {
    payload: ArrayBuffer;
};

type TextInput = {
    text: string;
};

type QuestionRecommendation = {
    questions: string[];
};

type MessageAssistant = {
    type: 'user' | 'bot';
    isFinal: boolean;
    text: string;
}[];

type AudioOutput = ArrayBuffer;

type StateAssistant = string;

export type {
    Connect,
    Join,
    AudioInput,
    TextInput,
    QuestionRecommendation,
    MessageAssistant,
    AudioOutput,
    StateAssistant
};
