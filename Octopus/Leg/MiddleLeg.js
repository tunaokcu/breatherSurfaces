import SceneNode from "../../Objects/Object Components/SceneNode.js";
import Cube from "../../Objects/Cube.js";

export default class MiddleLeg extends SceneNode{
    constructor(scale = 1){
        super();
        
        this.object = new Cube();
        this.scaleBy = [scale*0.2, scale*3, scale*0.2];
    }
}