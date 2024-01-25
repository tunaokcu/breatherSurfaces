import Scene from "./Scene.js";
import { flatten } from "../Common/MV.js";

export default class TestScene extends Scene{

    /*We have to overwrite the two methods used 
    renderUnconditional(){
        this.calculateAndBuffer();
        this.render();
    }
    */
   calculateAndBuffer(){
        this.vertices = this.object.sampleSolid();
        this.lighting.sendLightValues(this.gl, this.object); 

        //this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.normalBuffer );
        //this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten(this.normals), this.gl.STATIC_DRAW );
        //this.gl.vertexAttribPointer( this.vNormal, 4, this.gl.FLOAT, false, 0, 0 );
        //this.gl.enableVertexAttribArray( this.vNormal );

        this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.vertexBuffer );
        this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten(this.vertices), this.gl.STATIC_DRAW );

   }
   render(){
        this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.vertexAttribPointer( this.vPosition, 4, this.gl.FLOAT, false, 0, 0 );
        this.gl.enableVertexAttribArray( this.vPosition );
        //Dumbest bug ever. Writing TRIANGLE instead of TRIANGLES causes webgl to fall back on points.
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length);     
    }
}

