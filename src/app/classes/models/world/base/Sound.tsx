import Delay from "@/app/classes/utility/Await";
import { RegisterClass } from "@/app/classes/utility/JsonHelper";

@RegisterClass
export class Sound {
    protected static audioContext: AudioContext;
    protected audio: HTMLAudioElement;
    protected source: MediaElementAudioSourceNode;
    protected isLoopRunning: boolean = false;

    /**
     * Instantiates a new sound.
     * @param fileName The name of the file that contains the sound.
     * @param soundName The name of the sound that will be shown in the game.
     * @param description The description of the sound when it is investigated.
     * @param volume The volume of the sound, between 0 and 1.
     * @param delay The delay in seconds before the sound starts playing.
     * @param interval The interval in seconds between each time the sound is played.
     */
    constructor(public fileName: string, public soundName: string, public description: string, public volume: number, public delay: number, public interval: number) {
        if (!Sound.audioContext) {
            Sound.audioContext = new window.AudioContext();
        }
        
        this.audio = new Audio(fileName);
        this.source = Sound.audioContext.createMediaElementSource(this.audio);
        this.source.connect(Sound.audioContext.destination);
    }

    /**
     * Stops the sound.
     */
    public pause(): void {
        this.audio.pause();
    }

    /**
     * Resumes the sound.
     */
    public play(): void {
        if(!this.isLoopRunning){
            this.startLoop();
        } else {
            this.audio.play();
        }
    }

    /**
     * Rewinds the sound back to the beginning.
     */
    public rewind(): void {
        this.pause();
        this.audio.currentTime = 0;
    }

    /**
     * Plays the sound.
     */
    private async startLoop(): Promise<void> {
        this.isLoopRunning = true;

        // Delay the loop if requested.
        if (this.delay > 0) {
            await Delay(this.delay);
        }
        
        this.audio.play();

        // Continuously play the sound if there is an interval.
        do {
            if (!this.audio.paused){
                // Wait for the sound to end, then wait for the interval.
                await new Promise<void>((resolve) => this.audio.onended = () => resolve());
                await Delay(this.interval);
                this.rewind();
                this.play();
            } else {
                break;
            }
        } while (this.interval >= 0);

        this.isLoopRunning = false;
    }

    /**
     * Sets the volume of the sound.
     * @param volume The volume to set the sound to.
     */
    public setVolume(volume: number): void {
        this.audio.volume = volume;
    }
}