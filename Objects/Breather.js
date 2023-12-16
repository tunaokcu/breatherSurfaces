import ParametricSurface from "./ParametricSurface.js";
import {flatten, vec4} from "../Common/MV.js";

export default class Breather extends ParametricSurface{
    constructor(uStart=-4*Math.PI, uEnd=4*Math.PI, uDelta=90*Math.PI/360, vStart=-4*Math.PI, vEnd=4*Math.PI, vDelta=90*Math.PI/360, aa = 0.9){
        if(!(aa < 1 && aa > 0)){
            throw Error("aa should be within range (0, 1)")
        }
        super(uStart, uEnd, uDelta, vStart, vEnd, vDelta);
        this.aa = aa;
    }
    
    parametricFunction(u, v){
        return breather(this.aa, u, v);
    }
    
}

//aa must range (0, 1)
function breather(aa, u, v){
    let w = breatherW(aa);
    let denom = breatherDenom(aa, w, u, v);
    
    let x = breatherX(aa, u, denom);
    let y = breatherY(aa, u, v, w, denom);
    let z = breatherZ(aa, u ,v, w, denom);
    
    let res = vec4(x,y,z, 1.0);
    return res;
}
function breatherW(aa){
    return Math.sqrt(1-Math.pow(aa, 2));
}
function breatherDenom(aa, w, u, v){
    //NOTE! X AND Y DO NOT DENOTE COORDINATES HERE, THEY ARE ARBITRARY NAMES
    let x = Math.pow(w*Math.cosh(aa*u), 2);
    let y = Math.pow(aa*Math.sin(w*v), 2);
    return aa*(x + y);
}   
function breatherX(aa, u, denom){
    return -u + 2*(1-Math.pow(aa, 2)) * Math.cosh(aa*u) * Math.sin(aa*u) / denom;
}
function breatherY(aa, u, v, w, denom){
    return 2 * w * Math.cosh(aa*u) * (-w*Math.cos(v)*Math.cos(w*v) - Math.sin(v)*Math.sin(w*v)) / denom;
}
function breatherZ(aa, u, v, w, denom){
    return 2 * w * Math.cosh(aa*u) * (-w * Math.sin(v) * Math.cos(w*v) + Math.cos(v) * Math.sin(w*v)) / denom;
}