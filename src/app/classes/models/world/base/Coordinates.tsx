import { RegisterClass } from "@/app/classes/utility/JsonHelper";

@RegisterClass
export class Coordinates {
    constructor(public x: number, public y: number, public z: number) { }

    public equals(other: Coordinates): boolean {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    /**
     * Returns the distance between this and another set of coordinates.
     * @param other The other coordinates to calculate the distance to.
     */
    public getDistance(other: Coordinates): number {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2) + Math.pow(this.z - other.z, 2));
    }

    /**
     * Returns a copy of the current coordinates, with the x, y and z values normalized.
     */
    public normalize(): Coordinates {
        const length = this.magnitude();

        if(length === 0)
            return new Coordinates(0, 0, 0);

        return new Coordinates(this.x / length, this.y / length, this.z / length);
    }

    /**
     * Returns the cross product of two sets of coordinates.
     * @param other The other set of coordinates.
     */
    public crossProduct(other: Coordinates): Coordinates {
        return new Coordinates(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        );
    }

    /**
     * Returns the dot product of two sets of coordinates.
     * @param other The other set of coordinates.
     */
    public dotProduct(other: Coordinates): number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    /**
     * Returns the magnitude of the coordinates.
     */
    public magnitude(): number {
        return this.dotProduct(this);
    }
}