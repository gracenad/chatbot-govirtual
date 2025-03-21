"use client";

import React, { useState, useEffect } from 'react'
import { parseMarkdown } from './utils'

type MessageType = {
	type: string
	text: string
	steps?: string[]
	action?: string
	id: string | null
	listMeetings?: any[]
}

interface ChatMessageProps {
	message: MessageType
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const [parsed, setParsed] = useState<string>('')

   useEffect(() => {
        const md = parseMarkdown(message?.text)
        setParsed(md)
    },[message])

    if (!message) return null



    return (
        <div>
            <div
                style={{ fontWeight: 'normal', whiteSpace: 'pre-wrap', padding: 0 }}
                dangerouslySetInnerHTML={{ __html: parsed }}
            />
        </div>
    )
}

export default ChatMessage
