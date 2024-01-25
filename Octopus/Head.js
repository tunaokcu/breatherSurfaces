import Cube from "../Objects/Cube.js";
import SceneNode from "../Objects/SceneNode.js";

export default class Head extends SceneNode{
    constructor(scale = 1){
        super();
        
        this.object = new Cube();
        this.scaleBy = [scale*3, scale*3.5, scale*3];
    }
}