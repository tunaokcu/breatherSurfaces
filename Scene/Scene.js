import {flatten, vec3} from "../Common/MV.js";
import {WebGLUtils} from "../Common/myWebGLUtils.js";
import {initShaders} from "../Common/initShaders.js";
import Camera from "./Camera.js";

export default class Scene{
    canvas;
    gl;
    program;
    objects;

    vBufferId;
    vPosition;

    camera;

    constructor(backgroundColor=[1.0, 1.0, 1.0, 1.0]){
        this.init(backgroundColor);
    }
    
    //If for some reason shader and canvas ids must be changed, make sure to update it here as well
    init(backgroundColor){
        this.canvas = document.getElementById( "gl-canvas" );
        this.gl = WebGLUtils.setupWebGL( this.canvas );    
        if ( !this.gl ) { alert( "WebGL isn't available" ); }           

        this.gl.viewport( 0, 0, this.canvas.width, this.canvas.height );
        this.gl.clearColor( ...backgroundColor );   
    
        this.program = initShaders( this.gl, "vertex-shader", "fragment-shader" );
        this.gl.useProgram( this.program );   
        
        this.gl.enable(this.gl.DEPTH_TEST);

        this.vBufferId = this.gl.createBuffer();
        this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.vBufferId );
        
        this.vPosition = this.gl.getAttribLocation( this.program, "vPosition" );
        this.gl.vertexAttribPointer( this.vPosition, 4, this.gl.FLOAT, false, 0, 0 );
        this.gl.enableVertexAttribArray( this.vPosition );


        this.objects = []; 
        this.camera = new Camera(this.gl, this.program, -10, 10, 6, 0, 0.0,  -30.0, 30.0, 30.0, -30.0, vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0))
        this.camera.setShaderMatrices(this.gl);

        this.renderState = "solid";
        this.renderStateChanged = true;
    }


    calculateAndBuffer(){
        switch(this.renderState){
            case "mesh":
            case "points": this.calculateMesh(); break; 
            case "solid": this.calculateSolid(); break;
        }
        console.log(this.vertices);
        console.log(flatten(this.vertices))
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(this.vertices), this.gl.STATIC_DRAW);
    }
    calculateMesh(){
        //Recalculate vertices 
        this.vertices = [];
        for (let object of this.objects){
            this.vertices = this.vertices.concat(object.getMeshVertices());
        }
    }
    calculateSolid(){
        //Recalculate vertices 
        this.vertices = [];
        for (let object of this.objects){
            this.vertices = this.vertices.concat(object.getSolidVertices());
        }
        
        this.solidColumns = this.vertices[0].length;
        
        let temp = this.vertices;
        this.vertices = [];

        for (let i = 0; i < temp.length; i++) {
            for (let j = 0; j < temp[0].length; j++) {
                this.vertices.push(temp[i][j]);
            }
        }
        console.log(this.vertices)
    }


    render(){
        this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);            
        console.log(this.vertices)
        switch(this.renderState){
            case "mesh": this.gl.drawArrays(this.gl.LINES, 0, this.vertices.length); break;
            case "points": this.gl.drawArrays(this.gl.POINTS,0, this.vertices.length); break;
            case "solid": this.renderSolid(); break; 
        }
    }

    renderSolid(){
        console.log(this.solidColumns);

        for (let i = 0; i < this.vertices.length; i+= this.solidColumns ){
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, i, this.solidColumns);
        }
        /*
        for (let i = 0; i < this.vertices.length; i+= 10){
            this.gl.drawArrays(this.gl.TRIANGLE_FAN, i, 10);
        }   */
    }
    

    //No need to buffer vertex data, just render
    //TODO maybe there should be a renderState variable that determines the type of object to draw(mesh, points, surface, etc)
    adjustCameraAndRender(){
        //? Is there even any advantage in updating matrices without setting them? If not why seperate these functions
        this.camera.updateMatrices();
        this.camera.setShaderMatrices(this.gl);

        this.render();
    }

    zoomIn(){
        this.camera.zoomIn();
        this.adjustCameraAndRender();
    }
    zoomOut(){
        this.camera.zoomOut();
        this.adjustCameraAndRender();
    }

    updateTheta(newAngle){
        this.camera.theta = newAngle;
        this.adjustCameraAndRender();
    }
    updatePhi(newAngle){
        this.camera.phi = newAngle;
        this.adjustCameraAndRender();
    }
    
    updateRenderState(renderState){
        if (this.renderState != renderState){
            this.renderState = renderState;
            this.calculateAndBuffer();
            this.render();            
        }
    }

    renderUnconditional(){
        this.calculateAndBuffer();
        this.render();
    }
}
