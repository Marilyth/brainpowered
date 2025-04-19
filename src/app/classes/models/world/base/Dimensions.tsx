import { RegisterClass } from "@/app/classes/utility/JsonHelper";

@RegisterClass
export class Dimensions {
    constructor(public width: number, public depth: number, public height: number) { }

    public getArea(): number {
        return this.width * this.depth;
    }

    public getVolume(): number {
        return this.width * this.depth * this.height;
    }
}