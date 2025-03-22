import { Coordinates } from "@/app/classes/models/world/base/Coordinates";
import { Observer } from "@/app/classes/models/world/base/Observer";
import { Sound } from "@/app/classes/models/world/base/Sound";
import { events } from "@/app/classes/utility/Events";

export class SpatialSound extends Sound {
    private panner: PannerNode;

    /**
     * Instantiates a new spatial sound.
     * @param fileName The name of the file that contains the sound.
     * @param soundName The name of the sound that will be shown in the game.
     * @param description The description of the sound when it is investigated.
     * @param volume The maximum volume of the sound at 0 meter distance, between 0 and 1.
     * @param volumeDistance The distance in meter that the sound can be heard at before reaching 0.
     * @param delay The delay in seconds before the sound starts playing.
     * @param interval The interval in seconds between each time the sound is played.
     * @param coordinates The coordinates of the sound in the world.
     * @param volumeDistance The distance in feet that the sound can be heard at before reaching 0 volume.
     */
    constructor(public fileName: string, public soundName: string, public description: string, public volume: number, public delay: number, public interval: number, public coordinates: Coordinates, public volumeDistance: number, public observer: Observer) {
        super(fileName, soundName, description, volume, delay, interval);
        
        this.panner = Sound.audioContext.createPanner();
        this.panner.connect(Sound.audioContext.destination);
        this.source.disconnect();
        this.source.connect(this.panner);

        events.on("playerMoved", this.setRelativeVolume.bind(this));
        this.setRelativeVolume();
    }

    /**
     * Sets the position and volume of the sound relative to the observer.
     * @param observer The observer to set the sound relative to.
     */
    public setRelativeVolume(): void {
        // Calculate the distance between the observer and the sound.
        const distance = this.observer.getDistance(this.coordinates);
        const relativeVolume = this.volume * Math.pow(Math.max(1 - (distance / this.volumeDistance), 0), 2); // Sound intensity decreases with the square of the distance.

        // Calculate the volume location in space.
        const direction = this.observer.getDirection(this.coordinates);
        console.log(`Playing sound ${this.fileName}: at`, this.observer.getDirectionExpression(direction), relativeVolume, distance);

        // Set the position of the sound.
        this.panner.positionX.value = direction.x;
        this.panner.positionY.value = direction.y;
        this.panner.positionZ.value = direction.z;

        this.setVolume(relativeVolume);
        // Optional, define cone properties for directional audio. Like a TV being louder when you're in front of it than behind it.
    }

    public modifyCoordinates(modifier: (coordinates: Coordinates) => void): void {
        modifier(this.coordinates);
        this.setRelativeVolume();
    }
}