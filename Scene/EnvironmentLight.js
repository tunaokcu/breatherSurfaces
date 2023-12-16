import {vec4, mult, flatten} from "../Common/MV.js";

export default class EnvironmentLight{
    constructor(gl, program, ambientLight= vec4(0.2, 0.2, 0.2, 1.0 ), diffuseLight= vec4( 1.0, 1.0, 1.0, 1.0 ), specularLight=vec4( 1.0, 1.0, 1.0, 1.0 )){
        this.ambientLight = ambientLight;
        this.diffuseLight = diffuseLight;
        this.specularLight = specularLight;
        this.#getLocations(gl, program);

        this.calculateProducts();
        this.sendProducts();
    }

    #getLocations(gl, program){
        //shininessLoc = gl.getUniformLocation(program, "shininess");
        this.specularProductLoc = gl.getUniformLocation(program, "specularProduct"); 
        this.ambientProductLoc = gl.getUniformLocation(program, "ambientProduct");
        this.diffuseProductLoc = gl.getUniformLocation(program, "diffuseProduct")
    }

    calculateAndSendProducts(gl, materialAmbient, materialDiffuse, materialSpecular){
        var ambientProduct = mult(this.ambientLight, materialAmbient);
        var diffuseProduct = mult(this.diffuseLight, materialDiffuse);
        var specularProduct = mult(this.specularLight, materialSpecular);
    
        gl.uniform4fv(this.ambientProductLoc, flatten(ambientProduct));
        gl.uniform4fv(this.diffuseProductLoc, flatten(diffuseProduct) );
        gl.uniform4fv(this.specularProductLoc,flatten(specularProduct) );	
        gl.uniform1f(shininessLoc, materialShininess);
    }
}

