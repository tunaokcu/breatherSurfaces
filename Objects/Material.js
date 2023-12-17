import {flatten, vec4} from "../Common/MV.js";


export default class Material{
    constructor(materialAmbient= vec4( 1.0, 0.0, 1.0, 1.0 ), materialDiffuse= vec4( 1.0, 0.8, 0.0, 1.0 ), materialSpecular=vec4( 1.0, 1.0, 1.0, 1.0 ), materialShininess = 20.0){
        this.materialAmbient = materialAmbient;
        this.materialDiffuse = materialDiffuse;
        this.materialSpecular = materialSpecular;
        this.materialShininess = materialShininess;

        this.setTestValues();
    }
    setTestValues(){
        var octopusColor = vec4(193.0/255, 74.0/255, 65.0/255, 0);
        this.materialAmbient = octopusColor;
        this.materialDiffuse = octopusColor;
        this.materialSpecular = octopusColor;
        this.materialShininess = 50.0;
    }
}