"use client";

import React, { useRef, useEffect, FC, useCallback } from 'react';
import { Divider } from '@mui/material';
import { Close as IconClose, ExpandMore as IconChevronDown } from '@mui/icons-material';
import ChatMessage from './ChatMessage';
import ButtonAssistant from '../components/buttonAssistant';
import InputTextAssistant from '../components/inputTextAssistant';
import useAssistant from '../hooks/useAssistant';
import useRecorder from '../hooks/useRecorder';
import { useAssistantContext } from '@/providers/AssistantProvider';
import styled, { keyframes } from 'styled-components';

interface GoVirtualAssistantProps {
  onClose: () => void;
}

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const ThinkingContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 33%;
  padding: 8px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin-right: auto;
  background-color: rgba(0, 0, 0, 0.1);
  border: 1px solid black;
  animation: ${pulse} 1s infinite;
`;

const Dot = styled.div<{ $delay: string }>`
  height: 8px;
  width: 8px;
  background-color: black;
  border-radius: 50%;
  animation: ${bounce} 1.5s infinite;
  animation-delay: ${({ $delay }) => $delay};
`;

const Container = styled.div`
  padding: 16px;
  color: black;
  border-radius: 12px;
  border: .5px solid white;
  background-size: cover;
  background-position: center;
  background-image: url("/bg-gray.svg");
  backdrop-filter: blur(3.8px);
`;

const GoVirtualAssistant: FC<GoVirtualAssistantProps> = ({ onClose }) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const { establishedSocketRef, establishSocket,  } = useAssistant();
  const { onStopRecording } = useRecorder();
  const { messages, isTextAssistant, setIsTextAssistant, statusAssistant, isThinking, setIsThinking, suggestion, setSuggestion } = useAssistantContext();

  useEffect(() => {
    establishSocket();
  }, []);
  

  // useEffect(() => {
  //   establishedSocketRef.current?.listenMessageAssistant((message) => {
  //     console.log('Pesan dari server:', message);
  //     // Lakukan tindakan lebih lanjut berdasarkan pesan yang diterima
  //     // Misalnya, update state atau tampilkan pesan di UI
  //     // Contoh:
  //     // setSuggestion([message]); // Contoh jika ingin menambahkan ke suggestion
  //   });
  // }, []);
  
  useEffect(() => {
    // console.log('statusAssistant: ', statusAssistant);
    if (statusAssistant === 'thinking') {
      onStopRecording();
    }
  }, [statusAssistant, onStopRecording]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      requestAnimationFrame(() => {
        messagesContainerRef.current!.scrollTop = messagesContainerRef.current!.scrollHeight;
      });
    }
  }, [messages]);

  const handleSendMessages = (val: string) => {
    console.log("val handle: ", val);
    setSuggestion([]);
    
    // Kirim pesan ke server melalui WebSocket
    establishedSocketRef.current?.emitTextInput({ text: val }, (ack) => {
      if (ack.status === 'success') {
        console.log('Pesan berhasil dikirim:', ack.message);
        // Set thinking state ke true setelah pengiriman pesan
        // TODO: Pastiin ketika menerima respons dari server, thinking state diubah kembali ke false
        setIsThinking(false);
        // TODO: Pastikan kalo tidak ada pesan yang diterima, maka dibuat tampilan error
      } else {
        console.error('Pesan gagal terkirim:', ack.error);
      }
    });
  
    // Mendengarkan respons dari server
    // establishedSocketRef.current?.('response_from_server', (response) => {
    //   console.log("Respons dari server:", response);
    //   // Tangani respons dari server (misalnya, tampilkan di UI)
    //   setIsThinking(false);  // Ubah status thinking jika respons diterima
    //   // Misalnya, update UI atau lakukan tindakan lain berdasarkan respons
    // });
    establishedSocketRef.current?.listenMessageAssistant((message) => {
      console.log('Pesan dari server:', message);
      setIsThinking(false);
      // Lakukan tindakan lebih lanjut berdasarkan pesan yang diterima
      // Misalnya, update state atau tampilkan pesan di UI
      // Contoh:
      // setSuggestion([message]); // Contoh jika ingin menambahkan ke suggestion
    });
  };
  

  const handleClose = useCallback(() => {
    setIsThinking(false);
    setSuggestion([]);
    onClose();
  }, [onClose]);

  return (
    <Container>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '300px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={handleClose}>
          {/* <IconClose style={{ fill: 'white' }}/> */}
          <svg width="20" height="20" viewBox="0 0 18 18" fill="white" xmlns="http://www.w3.org/2000/svg" className="fill-white cursor-pointer"><g id="xmark"><path id="Vector" d="M3.70547 5.29451C3.26602 4.85505 3.26602 4.14314 3.70547 3.70369C3.92344 3.48396 4.21172 3.37498 4.5 3.37498C4.78828 3.37498 5.07586 3.48484 5.29523 3.70457L9 7.4074L12.7044 3.70544C12.9241 3.48396 13.2121 3.37498 13.5 3.37498C13.7879 3.37498 14.0755 3.48396 14.2954 3.70544C14.7349 4.1449 14.7349 4.85681 14.2954 5.29626L10.5899 9.00173L14.2954 12.7054C14.7349 13.1449 14.7349 13.8568 14.2954 14.2963C13.856 14.7357 13.144 14.7357 12.7046 14.2963L9 10.589L5.29453 14.2945C4.85508 14.734 4.14316 14.734 3.70371 14.2945C3.26426 13.8551 3.26426 13.1431 3.70371 12.7037L7.40918 8.99822L3.70547 5.29451Z"></path></g></svg>
          <span style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white' }}>Let&apos;s Talk</span>
        </div>
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-white"><g id="volume-high">
          <path id="Vector" d="M11.6044 6.91876C11.3152 6.68436 10.8897 6.72562 10.6552 7.01444C10.4187 7.30244 10.4609 7.72741 10.7501 7.96338C11.0672 8.22376 11.25 8.60063 11.25 8.9747C11.25 9.37323 11.0672 9.75066 10.7491 10.0105C10.46 10.2467 10.4178 10.6715 10.6542 10.9595C10.7869 11.1228 10.981 11.207 11.1762 11.207C11.3265 11.207 11.4785 11.157 11.6034 11.0552C12.2372 10.5609 12.6 9.80438 12.6 8.9747C12.6 8.14501 12.2372 7.43626 11.6044 6.91876ZM13.3059 4.84313C13.0185 4.60874 12.5932 4.64913 12.3559 4.93707C12.1195 5.22507 12.1616 5.65004 12.4499 5.88601C13.4044 6.64032 13.95 7.79907 13.95 8.9747C13.95 10.1503 13.4032 11.2838 12.4507 12.0881C12.1624 12.3243 12.1202 12.7491 12.3566 13.0371C12.4902 13.1995 12.6834 13.2838 12.8786 13.2838C13.0298 13.2838 13.1809 13.2337 13.3067 13.131C14.5744 12.1191 15.3 10.6031 15.3 8.9747C15.3 7.34626 14.5744 5.87813 13.3059 4.84313ZM15.03 2.73938C14.7426 2.50499 14.3173 2.54625 14.0799 2.83332C13.8435 3.12132 13.8857 3.54629 14.174 3.78226C15.7472 5.07095 16.65 6.9722 16.65 8.9747C16.65 10.9772 15.7475 12.9038 14.1733 14.1919C13.885 14.428 13.8428 14.8528 14.0793 15.1408C14.2116 15.3281 14.4056 15.4125 14.6025 15.4125C14.7537 15.4125 14.9048 15.3625 15.0306 15.2598C16.9172 13.7138 18 11.4328 18 8.9747C18 6.51657 16.9172 4.28457 15.03 2.73938ZM8.47125 2.78382C8.14781 2.63811 7.76784 2.69731 7.50291 2.9326L3.70687 6.30282H1.35C0.604406 6.30282 0 6.90695 0 7.6517L0 10.3494C0 11.0942 0.604406 11.6983 1.35 11.6983H3.708L7.50206 15.0677C7.66969 15.2156 7.88344 15.2944 8.1 15.2944C8.22482 15.2944 8.35197 15.2682 8.47012 15.2146C8.79469 15.0694 9 14.7488 9 14.3972V3.60338C9 3.24985 8.79469 2.92866 8.47125 2.78382Z" fill="white"></path></g>
        </svg>
      </div>
      <Divider style={{ backgroundColor: 'white', margin: '8px 0' }} />
      <div ref={messagesContainerRef} style={{ height: messages.length > 0 ? '500px' : '350px', overflowY: 'auto', scrollBehavior: 'smooth', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '0.875rem', padding: '8px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#FFF' }}>
          Go Virtual Assistant ready to help you now!
        </div>

        {/* {messages?.length > 0 && messages.map((item, idx) => item && <ChatMessage key={idx} message={item} />)} */}
        {messages.map((item, idx) => <ChatMessage key={idx} message={item} />)}

        {isThinking && (
          <ThinkingContainer>
            {[...Array(3)].map((_, i) => (
              <Dot key={i} $delay={`${i * 0.25}s`} />
            ))}
          </ThinkingContainer>
        )}

        {!messages.length && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: '500', flexGrow: 1, color: 'white' }}>
            How can I help you?
          </div>
        )}

        {suggestion.length > 0 && statusAssistant !== 'thinking' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p>Recommendation</p>
            {suggestion.map((item, idx) => (
              <div key={idx} style={{ padding: '8px', border: '1px solid black', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSendMessages(item)}>
                {item}
                <IconChevronDown style={{ transform: 'rotate(-90deg)', color: 'black' }} fontSize="small" />
              </div>
            ))}
          </div>
        )}
      </div>

      {!isTextAssistant ? (
        <ButtonAssistant isThinking={isThinking} />
      ) : (
        <InputTextAssistant onSendMessage={handleSendMessages} handleChangeAssistant={() => setIsTextAssistant(!isTextAssistant)} />
      )}
    </Container>
  );
};

export default GoVirtualAssistant;