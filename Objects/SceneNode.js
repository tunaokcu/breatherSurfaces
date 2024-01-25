import { scale4, rotate, translate, mat4, mult } from "../Common/MV.js";

export default class SceneNode{
    constructor(object, scaleBy=[1,1,1], rotateBy=[0,0,0], translateBy=[0,0,0]){
        this.object = object;
        this.scaleBy = scaleBy;
        this.rotateBy = rotateBy;
        this.translateBy = translateBy;
        this.#initMV(scaleBy, rotateBy, translateBy);
    }

    //Not sure about the order, so figure it out
    #initMV(scaleBy, rotateBy, translateBy){
        this.mv = mat4();
        //Translate
        this.mv = mult(this.mv, translate(...translateBy));

        //Rotate
        this.mv = mult(this.mv, rotate(rotateBy[0], 1, 0, 0));
        this.mv = mult(this.mv, rotate(rotateBy[1], 0, 1, 0));
        this.mv = mult(this.mv, rotate(rotateBy[2], 0, 0, 1));


        //Scale
        this.mv = mult(this.mv, scale4(...scaleBy))
    }

    getInstanceMatrix(modelViewMatrix){
        this.#initMV(this.scaleBy, this.rotateBy, this.translateBy)
        return mult(modelViewMatrix, this.mv);
    }

}