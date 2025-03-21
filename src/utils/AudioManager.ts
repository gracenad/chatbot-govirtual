class AudioManager {
    private audioContext: AudioContext;
    private source: AudioBufferSourceNode | null = null;

    constructor() {
        this.audioContext = new AudioContext();
    }

    async playAudio(audioBase64: Int16Array) {
        try {
            if (!this.audioContext) {
                this.audioContext = new AudioContext();
            }

            if (this.audioContext.state === "suspended") {
                await this.audioContext.resume();
            }

            if (this.source) {
                this.source.stop();
                this.source.disconnect();
            }

            const audioData = this.int16ArrayToArrayBuffer(audioBase64);
            const decodedAudio = await this.audioContext.decodeAudioData(audioData);

            this.source = this.audioContext.createBufferSource();
            this.source.buffer = decodedAudio;
            this.source.connect(this.audioContext.destination);
            this.source.start();
        } catch (error) {
            console.error("Error playing audio:", error);
        }
    }

    int16ArrayToArrayBuffer(int16Array: Int16Array): ArrayBuffer {
        return int16Array.buffer.slice(0) as ArrayBuffer;
    }

    destroy() {
        if (this.source) {
            this.source.stop();
            this.source.disconnect();
            this.source = null;
        }

        if (this.audioContext.state !== "closed") {
            this.audioContext.close();
        }
    }
}

export default AudioManager;
