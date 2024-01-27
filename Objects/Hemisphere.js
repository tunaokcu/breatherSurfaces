import Sphere from "./Sphere.js";

export default class Hemisphere extends Sphere{
    constructor(uDelta=30*Math.PI/360, vDelta=30*Math.PI/360, r = 1){
        super(0, 2*Math.PI, uDelta, 0, Math.PI, vDelta, r);
    }
}