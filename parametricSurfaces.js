//import Math
import {flatten, vec4} from "./Common/MV.js";
import {WebGLUtils} from "./Common/myWebGLUtils.js";
import {initShaders} from "./Common/initShaders.js";
import ParametricSurface from "./ParametricSurface.js";
import Breather from "./Breather.js";
import Camera from "./Camera.js";

function main(){
    const [canvas, gl] = init();

    const vertices = spherePoints(0.3);

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW ); 
    

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );    
    render(gl, vertices);   
}




function sceneTest(){
    let scene = new Scene();
    instantiateCameraSliders(scene);

    scene.render();
}

window.onload = sceneTest;




class Sphere extends ParametricSurface{
    constructor(uStart=0, uEnd=2*Math.PI, uDelta=10*Math.PI/360, vStart=0, vEnd=2*Math.PI, vDelta=10*Math.PI/360, r = 0.3){
        super(uStart, uEnd, uDelta, vStart, vEnd, vDelta);
        this.r = r;
    }

    parametricFunction(u, v){
        return vec4(this.r*Math.cos(u)*Math.cos(v), this.r*Math.sin(u)*Math.cos(v), this.r*Math.sin(v), 1);
    }

    sample(){
        return super.sample(this);
    }
}

//Should extend GeometricObject or something of the sort
class Cube extends ParametricSurface{
    points;
    constructor(){
        super();

        this.initCube();
        //console.log(this.points)
    }

    initCube()
    {
        this.points = [];
        this.quad( 1, 0, 3, 2 );
        this.quad( 2, 3, 7, 6 );
        this.quad( 3, 0, 4, 7 );
        this.quad( 6, 5, 1, 2 );
        this.quad( 4, 5, 6, 7 );
        this.quad( 5, 4, 0, 1 );
    }
    quad(a, b, c, d)
    {
        var vertices = [
            vec4( -0.5, -0.5,  0.5, 1.0 ),
            vec4( -0.5,  0.5,  0.5, 1.0 ),
            vec4(  0.5,  0.5,  0.5, 1.0 ),
            vec4(  0.5, -0.5,  0.5, 1.0 ),
            vec4( -0.5, -0.5, -0.5, 1.0 ),
            vec4( -0.5,  0.5, -0.5, 1.0 ),
            vec4(  0.5,  0.5, -0.5, 1.0 ),
            vec4(  0.5, -0.5, -0.5, 1.0 )
        ];
    
        var vertexColors = [
            [ 0.0, 0.0, 0.0, 1.0 ],  // black
            [ 1.0, 0.0, 0.0, 1.0 ],  // red
            [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
            [ 0.0, 1.0, 0.0, 1.0 ],  // green
            [ 0.0, 0.0, 1.0, 1.0 ],  // blue
            [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
            [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
            [ 1.0, 1.0, 1.0, 1.0 ]   // white
        ];
    
        // We need to parition the quad into two triangles in order for
        // WebGL to be able to render it.  In this case, we create two
        // triangles from the quad indices
    
        //vertex color assigned by the index of the vertex
    
        var indices = [ a, b, c, a, c, d ];
    
        for ( var i = 0; i < indices.length; ++i ) {
            this.points.push( vertices[indices[i]] );       
        }


    }


    sample(){
        //console.log("here");
        //console.log(this.points);
        return this.points;
    }
}

//This is called a "scene" but it only supports the rendering of a single object
class Scene{
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


        this.objects = [new Breather()]; 
        this.camera = new Camera(this.gl, this.program);
        //this.objects[0].uDelta *= 10;
        //this.objects[0].vDelta *= 10;
    }


    render(verticesChanged=true, mesh=false){


        //Draw if vertices are changed
        if (verticesChanged){
            this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            
            console.log("rendering")
            this.camera.setShaderMatrices(this.gl);

            let vertices = [];
            for (let object of this.objects){
                vertices = vertices.concat(object.sample());
            }

            //console.log(vertices);

            this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(vertices), this.gl.STATIC_DRAW);
        
            //Then render
            if (mesh){
                for (let i = 0; i < vertices.length; i+=4){
                    this.gl.drawArrays(this.gl.LINE_LOOP, i, 4);
                }
            }else{
                this.gl.drawArrays(this.gl.POINTS,0, vertices.length);
            }

            
        }          



    }
}


function instantiateCameraSliders(scene){
    //let cameraSliders = document.getElementById("camera");
    //console.log(cameraSliders);
    let xAxisSlider = document.getElementById("x");
    xAxisSlider.addEventListener("input", (event) => xAxisSliderHandler(scene, parseInt(event.target.value)))
    
    let yAxisSlider = document.getElementById("y");
    yAxisSlider.addEventListener("input", (event) => yAxisSliderHandler(scene, parseInt(event.target.value)))

    
}
function degreesToRadians(degrees){
    return degrees * (Math.PI / 180.0);
}

function xAxisSliderHandler(scene, newAngleInDegrees){
    scene.camera.theta = degreesToRadians(newAngleInDegrees);
    scene.camera.updateMatrices();
    scene.camera.setShaderMatrices(scene.gl);
    scene.render();
}
function yAxisSliderHandler(scene, newAngleInDegrees){
    scene.camera.phi = degreesToRadians(newAngleInDegrees);
    scene.camera.updateMatrices();
    scene.camera.setShaderMatrices(scene.gl);
    scene.render();
}

