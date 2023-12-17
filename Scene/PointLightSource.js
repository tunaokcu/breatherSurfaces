import {flatten, vec4} from "../Common/MV.js";

export default class PointLightSource{
    constructor(gl, program, lightPosition= vec4(1.0, 1.0, 1.0, 0.0 )){
        this.lightPositionLoc =  gl.getUniformLocation(program, "lightPosition");

        this.setAndSendLightPosition(gl, lightPosition)
    }

    setAndSendLightPosition(gl, newLightPosition){
        this.lightPosition = newLightPosition;
        gl.uniform4fv(this.lightPositionLoc, flatten(this.lightPosition));
    }

}