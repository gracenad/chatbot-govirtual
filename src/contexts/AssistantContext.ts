import { Dispatch, SetStateAction, createContext } from 'react';
import { TManageMoMCreateRecordingState } from '../providers/AssistantProvider'

type MessageType = {
	type: string
	text: string
	steps?: string[]
	action?: string
	id: string | null
	listMeetings?: any[]
}

interface IAssistantContext {
    showAssistant: boolean;
    setShowAssistant: Dispatch<SetStateAction<boolean>>;
    statusAssistant: string;
    setStatusAssistant: Dispatch<SetStateAction<string>>;
    messages: MessageType[]
    setMessages: Dispatch<SetStateAction<MessageType[]>>
    isTextAssistant: boolean;
    setIsTextAssistant: Dispatch<SetStateAction<boolean>>;
    recordingState: TManageMoMCreateRecordingState
    setRecordingState: Dispatch<SetStateAction<TManageMoMCreateRecordingState>>
    suggestion: string[];
    setSuggestion: Dispatch<SetStateAction<string[]>>;
    isThinking: boolean;
    setIsThinking: Dispatch<SetStateAction<boolean>>;
}

export const AssistantContext = createContext<IAssistantContext>({
    showAssistant: false,
    setShowAssistant: () => {},
    statusAssistant: '',
    setStatusAssistant: () => {},
    messages: [],
    setMessages: () => {},
    isTextAssistant: false,
    setIsTextAssistant: () => {},
    recordingState: 'not-started',
    setRecordingState: () => {},
    suggestion: [],
    setSuggestion: () => {},
    isThinking: false,
    setIsThinking: () => { },
});
