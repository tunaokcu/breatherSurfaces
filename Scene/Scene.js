import {flatten, vec4, vec3} from "../Common/MV.js";
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
        //gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
        
        this.vPosition = this.gl.getAttribLocation( this.program, "vPosition" );
        this.gl.vertexAttribPointer( this.vPosition, 4, this.gl.FLOAT, false, 0, 0 );
        this.gl.enableVertexAttribArray( this.vPosition );


        this.objects = []; 
        //this.camera = new Camera(this.gl, this.program); 
        this.camera = new Camera(this.gl, this.program, -10, 10, 6, 0, 0.0,  -30.0, 30.0, 30.0, -30.0, vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0))
        
        this.renderState = "solid";
        this.renderStateChanged = true;
    }


    render(){
        //Draw if vertices are changed
        if (this.renderStateChanged){
            this.renderStateChanged = false;

            this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            
            console.log("rendering")
            this.camera.setShaderMatrices(this.gl);

            this.vertices = [];
            for (let object of this.objects){
                this.vertices = this.vertices.concat(object.sample());
            }

            //console.log(vertices);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(this.vertices), this.gl.STATIC_DRAW);
            this.draw();
        }          
    }    

    draw(){
        //Then render
        switch(this.renderState){
            case "mesh": this.gl.drawArrays(this.gl.LINES, 0, this.vertices.length); break;
            case "points": this.gl.drawArrays(this.gl.POINTS,0, this.vertices.length); break;
            case "solid": console.log("solid"); this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.vertices.length); break;
        }
    }
    //No need to buffer vertex data, just render
    //TODO maybe there should be a renderState variable that determines the type of object to draw(mesh, points, surface, etc)
    renderAfterCameraAdjustment(){
        //? Is there even any advantage in updating matrices without setting them? If not why seperate these functions
        this.camera.updateMatrices();
        this.camera.setShaderMatrices(this.gl);

        this.draw();
    }

    zoomIn(){
        this.camera.zoomIn();
        this.renderAfterCameraAdjustment();
    }
    zoomOut(){
        this.camera.zoomOut();
        this.renderAfterCameraAdjustment();
    }

    updateTheta(newAngle){
        this.camera.theta = newAngle;
        this.renderAfterCameraAdjustment();
    }
    updatePhi(newAngle){
        this.camera.phi = newAngle;
        this.renderAfterCameraAdjustment();
    }
    
}
