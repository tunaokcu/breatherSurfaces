import Scene from "./Scene.js";
import Breather from "../Objects/Breather.js";
import Cube from "../Objects/Cube.js";

export default class BreatherScene extends Scene{
    constructor(backgroundColor=[1.0, 1.0, 1.0, 1.0]){
        super(backgroundColor);
        
        this.objects.push(new Breather());
        
        //this.test1();
        this.setTestParams();
    }

    updateaa(aa){
        this.objects[0].aa = aa;
        this.redrawModelAndRender();
    }

    updateuRange(range){
        this.objects[0].uStart = -range;
        this.objects[0].uEnd = range;
        this.redrawModelAndRender();
    }

    updatevRange(range){
        this.objects[0].vStart = -range;
        this.objects[0].vEnd = range;
        this.redrawModelAndRender();
    }

    updateuDelta(delta){
        this.objects[0].uDelta = delta;
        this.redrawModelAndRender();
    }

    updatevDelta(delta){
        this.objects[0].vDelta = delta;
        this.redrawModelAndRender();    
    }

    setTestParams(){
        this.objects[0].aa = 0.4;
        this.objects[0].uStart = -14;
        this.objects[0].uEnd = 14;
        this.objects[0].vStart = -37.4;
        this.objects[0].vEnd = 37.4;
    }

    test1(){
        this.objects.pop();
        this.objects.push(new Cube());
    }
}
