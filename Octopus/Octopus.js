import SceneNode from "../Objects/Object Components/SceneNode.js";
import Head from "./Head.js";
import Leg from "./Leg.js";

export default class Octopus extends SceneNode{
    constructor(){
        super();

        this.nodes = [new Head()];

        this.nodes[0].nodes = [new Leg()];
        this.nodes[0].nodes[0].translateBy = [0, 10, 0];
        //this.nodes[0].nodes[0].scaleBy = [2, 10, 1];
    }
}