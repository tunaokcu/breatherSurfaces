import ParametricSurface from "./Object Components/ParametricSurface.js";
import {vec4} from "../Common/MV.js";

export default class Sphere extends ParametricSurface{
    constructor(uStart=0, uEnd=2*Math.PI, uDelta=30*Math.PI/360, vStart=0, vEnd=2*Math.PI, vDelta=30*Math.PI/360, r = 1){
        super(uStart, uEnd, uDelta, vStart, vEnd, vDelta);
        this.r = r;
    }

    //(u, v) => (x, y, z)
    parametricFunction(u, v){
        return vec4(this.r*Math.cos(u)*Math.cos(v), this.r*Math.sin(u)*Math.cos(v), this.r*Math.sin(v), 1);
    }
}