import Scene from "./Scene.js";
import Breather from "../Objects/Breather.js";

export default class BreatherScene extends Scene{
    constructor(backgroundColor=[1.0, 1.0, 1.0, 1.0]){
        super(backgroundColor);
        this.objects.push(new Breather());
    }

    updateaa(aa){
        console.log("updating")
        this.objects[0].aa = aa;
        console.log("current aa is", this.objects[0].aa)
        this.render();
    }

    updateuRange(range){
        this.objects[0].uStart = -range;
        this.objects[0].uEnd = range;
        this.render();
    }

    updatevRange(range){
        this.objects[0].vStart = -range;
        this.objects[0].vEnd = range;
        this.render();
    }

    updateuDelta(delta){
        this.objects[0].uDelta = delta;
        this.render();
    }

    updatevDelta(delta){
        this.objects[0].vDelta = delta;
        this.render();    
    }

}
