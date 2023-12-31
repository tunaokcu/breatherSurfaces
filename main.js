//import Math

import BreatherScene from "./Scene/BreatherScene.js";

function main(){
    let scene = new BreatherScene();


    instantiateUI(scene);

    
    scene.renderState = "solid"
    scene.renderUnconditional();
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

function instantiateUI(scene){
    instantiateCameraSliders(scene);
    instantiateZoomHandler(scene);
    instantiateSidebar(scene);
    instantiateRenderButtons(scene);
    instantiateBumpMappingButton(scene);
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