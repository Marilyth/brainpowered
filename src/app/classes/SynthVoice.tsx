let audioContext: AudioContext | null = null;

export class SynthVoice {
    private overtones: [OscillatorNode, GainNode][] = [];
    private toneVolumes: number[] = [];
    private fundamentalFrequency: number = 180;
    private isStopped: boolean = false;

    /**
     * Creates a new voice.
     * @param fundamentalFrequency The fundamental frequency of the voice.
     * @param overtoneGains The gains of each overtone. Starting from the fundamental frequency.
     */
    constructor(fundamentalFrequency: number, overtoneGains: number[]) {
        this.overtones = [];
        this.fundamentalFrequency = fundamentalFrequency;
        this.toneVolumes = overtoneGains;
    }

    /**
     * Changes the frequency of the voice.
     * @param frequency The frequency to set the voice to.
     */
    public changeFrequency(frequency: number) {
        for (let i = 0; i < this.overtones.length; i++) {
            this.overtones[i][0].frequency.value = frequency * (i + 1);
        }
    }

    /**
     * Changes the volume of the voice.
     * @param volume The volume to set the voice to.
     */
    public changeVolume(volume: number) {
        for (let i = 0; i < this.overtones.length; i++) {
            this.overtones[i][1].gain.value = volume * this.toneVolumes[i];
        }
    }

    /**
     * Starts all oscillators and connects them to the audio context.
     */
    public start() {
        if (!this.isStopped)
            return;

        if (audioContext == null)
            audioContext = new window.AudioContext();

        for (let i = 0; i < this.toneVolumes.length; i++) {
            const oscillator = audioContext.createOscillator();
            oscillator.type = "triangle";
            oscillator.frequency.value = this.fundamentalFrequency * i;
            oscillator.start();

            const gainNode = audioContext.createGain();
            gainNode.gain.value = this.toneVolumes[i];
            gainNode.connect(audioContext.destination);

            oscillator.connect(gainNode);
            this.overtones.push([oscillator, gainNode]);
        }

        this.isStopped = false;
    }

    /**
     * Stops all oscillators and disconnects them from the audio context.
     */
    public stop() {
        if (this.isStopped)
            return;

        for (let i = this.overtones.length - 1; i >= 0; i--) {
            const [oscillator, gain] = this.overtones[i];
            oscillator.stop();
            oscillator.disconnect(gain);
            gain.disconnect(audioContext!.destination);

            this.overtones.pop();
        }

        this.isStopped = true;
    }

    /**
     * Produces a sound for a given character.
     * @param character The character to voice.
     */
    public voiceCharacter(character: string) {
        // Play the voice.
        const pitchChar = character.toLowerCase();
        
        // Play sound if alphanumeric.
        if (/[a-z0-9]/.test(pitchChar)){
            this.start();

            // Determine ascii value of char.
            const ascii = pitchChar.charCodeAt(0);
            const pitchShift = 1 + ((ascii % 10 + 1) / 10) / 5;
            const vowelShift = 1.2;

            // Make vowels higher pitch.
            if (/[aeiou]/.test(pitchChar)) {
                this.changeFrequency(this.fundamentalFrequency * pitchShift * vowelShift);
            } else {
                this.changeFrequency(this.fundamentalFrequency * pitchShift);
            }
        } else if (pitchChar != " ") {
            this.stop();
        }
    }
}