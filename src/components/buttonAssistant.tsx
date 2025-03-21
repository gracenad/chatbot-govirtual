"use client";

import React, { useContext, useEffect } from 'react';
import { FaMicrophone, FaPlay, FaPause, FaSpinner, FaCommentDots } from 'react-icons/fa';
import { AssistantContext } from '../contexts/AssistantContext';
import { useAssistantContext } from '@/providers/AssistantProvider';
import useAssistant from '@/hooks/useRecorder';

type onChangeAssistant = {
  isThinking: boolean;
};

const ButtonAssistant: React.FC<onChangeAssistant> = ({
  isThinking,
}) => {
  const { recordingState, setRecordingState } = useContext(AssistantContext);
  const { onRecording, onStopRecording } = useAssistant()
  const { setIsTextAssistant, isTextAssistant } = useAssistantContext();

  const handleChangeAssistant = () => {
    setIsTextAssistant(!isTextAssistant);
  };

  const handleRecording = async () => {
    if (recordingState === 'not-started' || recordingState === 'stopped') {
      try {
        await onRecording();
        setRecordingState('speaking');
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    } else if (recordingState === 'paused' || recordingState === 'played' || recordingState === 'speaking') {
      try {
        await onStopRecording();
        setRecordingState('stopped');
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
  };

  // useEffect(() => {
  //   console.log("Recording state changed:", recordingState);
  // }, [recordingState]);

  return (
    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <button
        onClick={handleRecording}
        style={{
          padding: '5px',
          backgroundColor: recordingState === 'not-started' || recordingState === 'stopped' ? 'transparent' : 'black',
          color: recordingState === 'not-started' || recordingState === 'stopped' ? 'black' : 'white',
          border: '4px solid hsla(0, 0%, 100%, .5)',
          borderRadius: '3vw',
          cursor: 'pointer',
          opacity: isThinking ? 0.5 : 1,
          backdropFilter: 'blur(16.75px)'
        }}
        disabled={isThinking}
      >
        {!isThinking ? (
          <>
            {recordingState === 'not-started' || recordingState === 'stopped' ? (
              <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" 
              className="fill-white"><g id="microphone"><path id="Vector" d="M12 21.93C6.95998 21.93 2.84998 17.83 2.84998 12.78V10.9C2.84998 10.51 3.16998 10.2 3.54998 10.2C3.92998 10.2 4.24998 10.52 4.24998 10.9V12.78C4.24998 17.05 7.71997 20.52 11.99 20.52C16.26 20.52 19.73 17.05 19.73 12.78V10.9C19.73 10.51 20.05 10.2 20.43 10.2C20.81 10.2 21.13 10.52 21.13 10.9V12.78C21.15 17.83 17.04 21.93 12 21.93Z" fill="white"></path><path id="Vector_2" d="M12 2C8.64002 2 5.90002 4.74 5.90002 8.1V12.79C5.90002 16.15 8.64002 18.89 12 18.89C15.36 18.89 18.1 16.15 18.1 12.79V8.1C18.1 4.74 15.36 2 12 2ZM14.18 10.59C14.11 10.86 13.86 11.04 13.59 11.04C13.54 11.04 13.48 11.03 13.43 11.02C12.41 10.74 11.33 10.74 10.31 11.02C9.98002 11.11 9.65002 10.92 9.56002 10.59C9.47002 10.27 9.66002 9.93 9.99002 9.84C11.22 9.5 12.52 9.5 13.75 9.84C14.08 9.93 14.27 10.26 14.18 10.59ZM15.03 7.82C14.94 8.07 14.71 8.22 14.46 8.22C14.39 8.22 14.32 8.21 14.25 8.18C12.72 7.62 11.04 7.62 9.51002 8.18C9.19002 8.3 8.84002 8.14 8.72002 7.82C8.61002 7.51 8.77002 7.16 9.09002 7.04C10.89 6.39 12.87 6.39 14.66 7.04C14.98 7.16 15.14 7.51 15.03 7.82Z" fill="white"></path></g></svg>
              // <FaMicrophone />
            ) : recordingState === 'speaking' || recordingState === 'played' ? (
              <FaPause />
            ) : (
              <FaPlay />
            )}
          </>
        ) : (
          <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
        )}
      </button>

      <button
        onClick={handleChangeAssistant}
        style={{
          padding: '5px',
          backgroundColor: 'transparent',
          border: '1px solid white',
          borderRadius: '2vw',
          cursor: 'pointer',
          opacity: isThinking ? 0.5 : 1,
        }}
        disabled={isThinking}
      >
        <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-white"><g id="text"><path id="Vector" d="M20.95 4.13C20.66 3.71 20.29 3.34 19.87 3.05C18.92 2.36 17.68 2 16.19 2H7.81C7.61 2 7.41 2.01 7.22 2.03C3.94 2.24 2 4.37 2 7.81V16.19C2 17.68 2.36 18.92 3.05 19.87C3.34 20.29 3.71 20.66 4.13 20.95C4.95 21.55 5.99 21.9 7.22 21.98C7.41 21.99 7.61 22 7.81 22H16.19C19.83 22 22 19.83 22 16.19V7.81C22 6.32 21.64 5.08 20.95 4.13ZM18.75 8.9C18.75 9.31 18.41 9.65 18 9.65C17.59 9.65 17.25 9.31 17.25 8.9V7.72C17.25 7.4 16.99 7.14 16.67 7.14H12.75V16.86H14.53C14.94 16.86 15.28 17.2 15.28 17.61C15.28 18.02 14.94 18.36 14.53 18.36H9.47C9.06 18.36 8.72 18.02 8.72 17.61C8.72 17.2 9.06 16.86 9.47 16.86H11.25V7.14H7.33C7.01 7.14 6.75 7.4 6.75 7.72V8.9C6.75 9.31 6.41 9.65 6 9.65C5.59 9.65 5.25 9.31 5.25 8.9V7.72C5.25 6.57 6.18 5.64 7.33 5.64H16.66C17.81 5.64 18.74 6.57 18.74 7.72V8.9H18.75Z" fill="white"></path></g></svg>
        {/* <FaCommentDots /> */}
      </button>
    </div>
  );
};

export default ButtonAssistant;
