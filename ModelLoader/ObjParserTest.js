import ObjParser from "./ObjParser.js"

import ModelRenderer from "./ModelRenderer.js";


window.onload = async () => {
    const response = await fetch('./crate.obj');
    const text = await response.text();   
    let parser = new ObjParser();
    let model = parser.parse(text);
    model.constructFaces();
    model.loadTexture("./crate.png");



    /*    
    console.log("name", model.name);

    console.log("vertices", model.vertices); 
    console.log("texture coordinates", model.textureCoordinates);
    console.log("vertex normals", model.vertexNormals);

    console.log("vertex indices", model.vertexIndices);
    console.log("texture indices", model.textureIndices);
    console.log("normal indices", model.normalIndices);
    */
    
    
    let modelRenderer = new ModelRenderer();     
    model.texture.onload = () => modelRenderer.render(model);
}