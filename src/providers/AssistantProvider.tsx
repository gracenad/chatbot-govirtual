"use client"

import { AssistantContext } from '@/contexts/AssistantContext';
import React, { useContext, useState, ReactNode } from 'react';
type MessageType = {
	type: string
	text: string
	steps?: string[]
	action?: string
	id: string | null
	listMeetings?: any[]
}

    export type TManageMoMCreateRecordingState =
        | 'not-started'
        | 'played'
        | 'speaking'
        | 'paused'
        | 'stopped'
        | 'thinking'
        

const AssistantProvider = ({ children }: { children: ReactNode }) => {
    const [showAssistant, setShowAssistant] = useState<boolean>(false);
    const [statusAssistant, setStatusAssistant] = useState<string>('');
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [isTextAssistant, setIsTextAssistant] = useState<boolean>(false);
    const [recordingState, setRecordingState] =
            useState<TManageMoMCreateRecordingState>('not-started')
    const [suggestion, setSuggestion] = useState<string[]>([]);
    const [isThinking, setIsThinking] = useState<boolean>(false);

    return (
        <AssistantContext.Provider
            value={{
                showAssistant,
                setShowAssistant,
                statusAssistant,
                setStatusAssistant,
                messages,
                setMessages,
                isTextAssistant,
                setIsTextAssistant,
                recordingState,
                setRecordingState,
                suggestion,
                setSuggestion,
                isThinking,
                setIsThinking,
            }}
        >
            {children}
        </AssistantContext.Provider>
    );
};

export default AssistantProvider;

export const useAssistantContext = () => useContext(AssistantContext)
