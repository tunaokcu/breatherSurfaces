import ParametricSurface from "./Object Components/ParametricSurface.js";


//https://virtualmathmuseum.org/Surface/klein_bottle/klein_bottle.html#:~:text=Klein%20Bottle%20Hermann%20Karcher%20Parametric,See%20the%20Mobius%20Strip%20first.
export default class KleinBottle extends ParametricSurface{
    constructor(uStart=-4*Math.PI, uEnd=4*Math.PI, uDelta=90*Math.PI/360, vStart=-4*Math.PI, vEnd=4*Math.PI, vDelta=90*Math.PI/360, aa = 0.9){
        super(uStart, uEnd, uDelta, vStart, vEnd, vDelta);
        this.aa = aa;
        //this.setTestValues();
    }

    parametricFunction(u, v){
        return [x(this.aa, u, v), y(this.aa, u, v), z(this.aa, u, v)];
    }

    setTestValues(){
        this.aa = 3;
        this.uStart = 0;
        this.uEnd = Math.PI * 2;
        this.vStart = 0;

    }

}


function x(aa, u, v){
    return (aa + Math.cos(v / 2) * Math.sin(u) - Math.sin(v / 2) * Math.sin(2 * u)) * Math.cos(v)

}

function y(aa, u, v){
    return (aa + Math.cos(v / 2) * Math.sin(u) - Math.sin(v / 2) * Math.sin(2 * u)) * Math.sin(v)
}

function z(aa, u, v){
    return  Math.sin(v / 2) * Math.sin(u) + Math.cos(v / 2) * Math.sin(2 * u)
}