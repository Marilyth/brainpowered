import { Coordinates } from "@/app/classes/models/world/base/Coordinates";
import { RegisterClass } from "@/app/classes/utility/JsonHelper";
import { Type } from "class-transformer";

@RegisterClass
export class Observer extends Coordinates {
    private facingDirection!: Coordinates;

    private basisCoordinateSystem = [
        new Coordinates(0, 0, 1), // Forward
        new Coordinates(1, 0, 0), // Right
        new Coordinates(0, 1, 0) // Up
    ];

    constructor(public x: number, public y: number, public z: number) {
        super(x, y, z);

        this.setFacingDirection(new Coordinates(0, 0, 1));
    }

    /**
     * Sets the observer's facing direction and calculates the new basis coordinate system.
     * @param direction The direction to set the observer to.
     */
    public setFacingDirection(direction: Coordinates): void {
        this.facingDirection = direction.normalize();
    
        const worldUp = new Coordinates(0, 1, 0);
        let right = worldUp.crossProduct(this.facingDirection).normalize();
    
        right = right.normalize();
        const up = this.facingDirection.crossProduct(right).normalize(); // Order matters!
    
        this.basisCoordinateSystem[0] = this.facingDirection; // Forward
        this.basisCoordinateSystem[1] = right;
        this.basisCoordinateSystem[2] = up;
    }

    /**
     * Returns the direction from this to another set of coordinates as a 3 dimensional vector, relative to the observer's facing direction.
     * @param other The other coordinates to calculate the direction to.
     */
    public getDirection(other: Coordinates): Coordinates {
        const x = other.x - this.x;
        const y = other.y - this.y;
        const z = other.z - this.z;

        // Transform the direction vector to the observer's basis coordinate system
        const xComponent = this.basisCoordinateSystem[1].x * x + this.basisCoordinateSystem[1].y * y + this.basisCoordinateSystem[1].z * z;
        const yComponent = this.basisCoordinateSystem[2].x * x + this.basisCoordinateSystem[2].y * y + this.basisCoordinateSystem[2].z * z;
        const zComponent = this.basisCoordinateSystem[0].x * x + this.basisCoordinateSystem[0].y * y + this.basisCoordinateSystem[0].z * z;

        return new Coordinates(xComponent, yComponent, zComponent).normalize();
    }

    /**
     * Returns the expression of the direction from this to another set of coordinates.
     * @param other The other coordinates to calculate the direction to.
     */
    public getDirectionExpression(direction: Coordinates): string {
        const frontString = "front";
        const rightString = "to the right";
        const leftString = "to the left";
        const behindString = "behind";
        const upString = "above";
        const downString = "below";

        const expressions = [];

        const directionX = direction.x;
        const directionZ = direction.z;

        if (directionX > 0)
            expressions.push(rightString);
        else if (directionX < 0)
            expressions.push(leftString);

        if (directionZ > 0)
            expressions.push(frontString);
        else if (directionZ < 0)
            expressions.push(behindString);

        if (direction.y > 0)
            expressions.push(upString);
        else if (direction.y < 0)
            expressions.push(downString);

        return expressions.join(", ");
    }
}