import hark, { Harker } from 'hark';
import { RecordRTCPromisesHandler, StereoAudioRecorder } from 'recordrtc';
import { useRef } from 'react';
import { useAssistantContext } from '@/providers/AssistantProvider';
import useAssistant from './useAssistant';

const useRecorder = () => {
const streamRef = useRef<MediaStream | null>(null);
const recorderRef = useRef<RecordRTCPromisesHandler | null>(null);
const harkerRef = useRef<Harker | null>(null);
const { setRecordingState } = useAssistantContext()
const { establishedSocketRef } = useAssistant()

const onRecording = async () => {
    await recorderRef.current?.stopRecording();
    recorderRef.current = null;
    harkerRef.current?.stop();
    harkerRef.current = null;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    setRecordingState('played');

    const speechEvents = hark(stream, {});
    harkerRef.current = speechEvents;
    speechEvents.on('speaking', () => {
        setRecordingState('speaking');
    });
    speechEvents.on('stopped_speaking', () => {
        setRecordingState('stopped');
    });

    const rec = new RecordRTCPromisesHandler(stream, {
        type: 'audio',
        recorderType: StereoAudioRecorder,
        mimeType: 'audio/wav',
        disableLogs: true,
        timeSlice: 100,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
        ondataavailable: (blob) => {
            const waveblob = blob.slice(0, 25600, 'audio/wav');
            const reader_byte = new FileReader();

            reader_byte.onload = (event) => {
                const buffer = event.target?.result;
                if (!buffer) {
                    console.error("Failed to read audio data.");
                    return;
                }

                const int16array = new Int16Array(buffer as ArrayBuffer);

                const audioInputPayload: AudioInputPayload = {
                    audioData: new Blob([int16array], { type: 'audio/wav' }),
                    timestamp: Date.now(),
                };
                if (establishedSocketRef.current) {
                    establishedSocketRef.current.emitAudioInput(audioInputPayload);
                } else {
                    // alert("Socket connection not established.");
                }
            };

            reader_byte.onerror = (error) => {
                console.error("FileReader error:", error);
            };

            reader_byte.readAsArrayBuffer(waveblob);
        },
    });

    recorderRef.current = rec;
    await rec.startRecording();
};

interface AudioInputPayload {
    audioData: Blob;
    timestamp?: number;
    sequenceNumber?: number;
}

    const onStopRecording = async () => {
        await recorderRef.current?.stopRecording()
        recorderRef.current = null
        harkerRef.current?.stop()
        harkerRef.current = null
        streamRef.current?.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        setRecordingState('stopped')
    }

    return {
        streamRef,
        recorderRef,
        harkerRef,
        onRecording,
        onStopRecording,
    };
};

export default useRecorder;