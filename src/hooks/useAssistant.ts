import { useRef } from "react";
import AudioManager from "@/utils/AudioManager";
import { GoVirtualEventWebSocket } from "@/components/nisaEventWebsocket";
import { useAssistantContext } from "@/providers/AssistantProvider";

interface JoinPayload {
  language: string;
  room: string;
}

const useAssistant = () => {
  const establishedSocketRef = useRef<GoVirtualEventWebSocket | null>(null);
  const audioManager = useRef<AudioManager | null>(null);
  const { setMessages, setSuggestion, setIsThinking } = useAssistantContext();

  const handleAudioResponse = async (audioBase64: Int16Array) => {
    if (!audioManager.current) return;
    await audioManager.current.playAudio(audioBase64);
  };

  const handleSetMessages = (values: any, id?: string | null) => {
    setMessages((prevMessages) => {
      if (!id) {
        return [
          ...prevMessages,
          {
            id: `temp-${prevMessages.length}`,
            type: values.type || "",
            text: values.text || "",
            listMeetings: values.meetings || [],
            action: values.action || "",
          },
        ];
      }

      const existingMessageIndex = prevMessages.findIndex(
        (item) => item.id === id
      );

      if (existingMessageIndex !== -1) {
        const updatedMessages = [...prevMessages];
        updatedMessages[existingMessageIndex] = {
          ...updatedMessages[existingMessageIndex],
          type: values.type || updatedMessages[existingMessageIndex].type,
          text: values.text || updatedMessages[existingMessageIndex].text,
          action: values.action || updatedMessages[existingMessageIndex].action,
          listMeetings: [
            ...(updatedMessages[existingMessageIndex].listMeetings || []),
            ...(values.meetings || []),
          ],
        };
        return updatedMessages;
      }
      return [
        ...prevMessages,
        {
          id: id,
          type: values.type || "",
          text: values.text || "",
          action: values.action || "",
          listMeetings: values.meetings || [],
        },
      ];
    });
  };

  const establishSocket = async () => {
    if (!establishedSocketRef.current) {
      const sio = new GoVirtualEventWebSocket(
        "https://ai-govirtual-assistant.ajari.app",
        "09468464-bad3-413d-9cea-443a978b7804"
      );
      sio.connect();
      establishedSocketRef.current = sio;

      sio.listenConnect(() => {
        const payloadStream: JoinPayload = {
          language: "en-US",
          room: "default-room",
        };
        sio.emitJoin(payloadStream);
      });

      sio.listenAudioOutput((audio) => {
        if (audio instanceof ArrayBuffer) {
          const int16Array = new Int16Array(audio);
          handleAudioResponse(int16Array);
        } else if (audio.buffer) {
          const int16Array = new Int16Array(audio.buffer);
          handleAudioResponse(int16Array);
        } else {
          console.error("Invalid audio data format", audio);
        }
      });

      sio.listenMessageAssistant((messages: string) => {
        console.log("Messages from server on useAssistant:", messages);
        if (!Array.isArray(messages) || messages.length === 0) return;
        //TODO : pesan dari server sampe dissini
        const { type, text, id = null } = messages[0] || {};

        handleSetMessages({ type, text }, id);
      });

      sio.listenQuestionRecommendation(
        (actionMessages: { questions?: any }) => {
          setSuggestion(actionMessages?.questions || []);
        }
      );

      sio.listenStateAssistant(async (statusAssistant) => {
        console.log("Status assistant:", statusAssistant);
        if (statusAssistant === "thinking") setIsThinking(true);
        else {
          setIsThinking(false);
        }
        if (statusAssistant === "thinking") {
          await onStopRecording();
        }
      });
    }
  };

  return {
    establishedSocketRef,
    establishSocket,
  };
};

export default useAssistant;

async function onStopRecording(): Promise<void> {
  console.log("Recording stopped.");
}
