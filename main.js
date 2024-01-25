import BreatherScene from "./Scene/BreatherScene.js";
import Cube from "./Objects/Cube.js";
import Torus from "./Objects/Torus.js";

import Scene from "./Scene/Scene.js";
import TestScene from "./Scene/TestScene.js";
import Breather from "./Objects/Breather.js";
import Sphere from "./Objects/Sphere.js";
import Plane from "./Objects/Plane.js";
import SceneNode from "./Objects/SceneNode.js"

function main(){
    //!Our problem with vertex rendering can be seen clearly here
    /*
    let cubeScene = new Scene();
    cubeScene.object = new Cube();
    instantiateUI(cubeScene);
    cubeScene.renderUnconditional();
    */

    let breatherScene = new Scene();

    let planeNode = new SceneNode(new Plane());
    breatherScene.tree.push(planeNode);

    let sphereNode = new SceneNode(new Sphere());
    sphereNode.scaleBy = [2,2,2];//[0.3, 0.3, 0.3];
    sphereNode.translateBy = [5, 0, 0]
    sphereNode.rotateBy = [90, 1, 1]
    breatherScene.tree.push(sphereNode);

    breatherScene.treeInit();
    breatherScene.treeRender();
    //breatherScene.render();
    //instantiateUI(breatherScene);


    /*Experiment with multi-screen rendering success
    let experimentalScene = new BreatherScene("second-screen");
    experimentalScene.renderUnconditional();
    for (let i = 0; i < 2; i++){
        experimentalScene.zoomIn();
    }

    experimentalScene.setTestParams()
    experimentalScene.updateTheta(45);
    */
    
}

window.onload = main;

//TODO should probably either set the values within the sliders to the values in the breather object or vice versa
//TODO specify that this is a sidebar for a breather scene
function instantiateSidebar(scene){
    document.getElementById("aa").addEventListener("input", (event) => scene.updateaa(parseFloat(event.target.value)));
    document.getElementById("u delta").addEventListener("input", (event) => scene.updateuDelta(parseFloat(event.target.value)));
    document.getElementById("v delta").addEventListener("input", (event) => scene.updatevDelta(parseFloat(event.target.value)));
    document.getElementById("u range").addEventListener("input", (event) => scene.updateuRange(parseFloat(event.target.value)));
    document.getElementById("v range").addEventListener("input", (event) => scene.updatevRange(parseFloat(event.target.value)));
}



function instantiateCameraSliders(scene){
    document.getElementById("x").addEventListener("input", (event) => xAxisSliderHandler(scene, parseInt(event.target.value)))
    document.getElementById("y").addEventListener("input", (event) => yAxisSliderHandler(scene, parseInt(event.target.value)))    
}

function instantiateRenderButtons(scene){
    document.getElementById("mesh").addEventListener("click", () => scene.updateRenderState("mesh"));
    document.getElementById("solid").addEventListener("click", () => scene.updateRenderState("solid"));
    document.getElementById("points").addEventListener("click", () => scene.updateRenderState("points"));
}

//!This is a helper function
function degreesToRadians(degrees){
    return degrees * (Math.PI / 180.0);
}


function xAxisSliderHandler(scene, newAngleInDegrees){
    scene.updateTheta(degreesToRadians(newAngleInDegrees));
}
function yAxisSliderHandler(scene, newAngleInDegrees){
    scene.updatePhi(degreesToRadians(newAngleInDegrees));
}

function instantiateZoomHandler(scene){
    document.addEventListener("wheel", (event) => zoomHandler(event, scene), {passive: false}); //the {passive: false} part is necessary for the zoomHandler to prevent default action
}

function instantiateBumpMappingButton(scene){
    document.getElementById("bumpMapping").addEventListener("click", () => scene.toggleBumpMapping());
}

function instantiateNormalToggle(scene){
    document.getElementById("toggleNormals").addEventListener("click", () => scene.toggleTrueNormals());
}

function instantiateUI(scene){
    instantiateCameraSliders(scene);
    instantiateZoomHandler(scene);
    instantiateSidebar(scene);
    instantiateRenderButtons(scene);
    // instantiateBumpMappingButton(scene);
    instantiateLightUI(scene);
    //instantiateNormalToggle(scene);
}


//let intialMeasurement = 0;
function zoomHandler(event, scene){
    if (event.ctrlKey && event.deltaY != 0){
        event.preventDefault();

        let direction = event.deltaY < 0 ? "up" : "down";

        if (direction === "up"){
            scene.zoomIn();
        }
        else{
            scene.zoomOut();
        }
    }
}


function instantiateLightUI(scene){
    document.getElementById("x+").addEventListener("click", () => (scene.incrementLightLocation(1, 0, 0)));
    document.getElementById("x-").addEventListener("click", () => (scene.incrementLightLocation(-1, 0, 0)));

    document.getElementById("y+").addEventListener("click", () => (scene.incrementLightLocation(0, 1, 0)));
    document.getElementById("y-").addEventListener("click", () => (scene.incrementLightLocation(0, -1, 0)));

    document.getElementById("z+").addEventListener("click", () => (scene.incrementLightLocation(0, 0, 1)));
    document.getElementById("z-").addEventListener("click", () => (scene.incrementLightLocation(0, 0, -1)));
}