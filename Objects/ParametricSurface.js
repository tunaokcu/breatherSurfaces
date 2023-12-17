import GeometricObject from "./GeometricObject.js";
import {flatten, vec4, vec3, subtract, normalize, cross} from "../Common/MV.js";

export default class ParametricSurface extends GeometricObject{
    //should these be outside this class?
    constructor(uStart=0, uEnd=2*Math.PI, uDelta=2*Math.PI/360, vStart=0, vEnd=2*Math.PI, vDelta=2*Math.PI/360){
        super();
        this.uStart = uStart;
        this.uEnd = uEnd;
        this.uDelta = uDelta;

        this.vStart = vStart;
        this.vEnd = vEnd;
        this.vDelta = vDelta;
    
        if(this.constructor == this.parametricFunction) {
            throw new Error("Class is of abstract type and can't be instantiated");
         };
   
         if(this.parametricFunction == undefined) {
             throw new Error("parametricFunction method must be implemented");
         };
    }



    //TODO we can probably delete this
    samplePoints(object=this){
        let pointsInMesh = [];

        let i = 0;
        for (let u = object.uStart; u < object.uEnd; u += object.uDelta){
            
            for(let v = object.vStart; v < object.vEnd; v += object.vDelta){
                pointsInMesh.push(object.parametricFunction(u, v));
            }
            i += 1;
        }
        
        return pointsInMesh;
    }

    sampleSolidStrip(object=this){
        
        let pointsInMesh = [];

        let i = 0;
        for (let u = object.uStart; u < object.uEnd; u += object.uDelta){
            pointsInMesh.push([]);
            
            for(let v = object.vStart; v < object.vEnd; v += object.vDelta){
                pointsInMesh[i].push(object.parametricFunction(u, v));
            }
            pointsInMesh[i].push(pointsInMesh[i][0])
            i += 1;
        }
        //console.log(pointsInMesh[0])
        pointsInMesh.push(pointsInMesh[0])

        console.log(pointsInMesh);
        
        let pointsInMeshStrip = [];

        for (let i = 0; i < pointsInMesh.length-1; i++) {
            pointsInMeshStrip.push([]);

            for(let j = 0; j < pointsInMesh[i].length-1; j++){
                pointsInMeshStrip[i].push(pointsInMesh[i][j]);
                pointsInMeshStrip[i].push(pointsInMesh[i+1][j]);
            }
        }
        this.pointsInMeshStrip = pointsInMeshStrip;
        return pointsInMeshStrip;
    }

    getSolidVertices(){
        return this.sampleSolidStrip();//this.sampleSolid();
    }

    getVertexNormals(){
        let points = this.pointsInMeshStrip;
        let allNormals = [];
        
        for (let i = 0; i < this.pointsInMeshStrip.length-2; i++){
            for (let j = 0; j < this.pointsInMeshStrip[i].length-2; j++){
                // calculate the edges (vectors) of the current fragment
                let oneTotwo = subtract(points[i][j+1],points[i][j]);
                let oneTothree = subtract(points[i][j+2],points[i][j]);
                let twoTothree = subtract(points[i][j+2],points[i][j+1]);
                // calculate normals from the edge vectors
                //console.log(oneTothree);
                //console.log(oneTotwo);
                //console.log(twoTothree);
                let normal1 = normalize( cross(oneTotwo, oneTothree) );
                normal1 = vec4(normal1);
                normal1[3] = 0;

                // ************************************************************
                // MINUS SIGN MIGHT NOT CHANGE DIRECTION HERE, HAVE TO MAKE SURE IT DOES
                // ************************************************************
                /*
                let normal2 = normalize( cross(-oneTotwo, twoTothree) );
                normal2 = vec4(normal2);
                normal2[3] = 0;

                let normal3 = normalize( cross(-oneTothree, -twoTothree) );
                normal3 = vec4(normal3);
                normal3[3] = 0;
                // add all vertex normals for the current fragment
                */
                allNormals.push(normal1);
                //allNormals.push(normal2); 
                //allNormals.push(normal3);
            }
        }
        this.allNormals = allNormals;
        return allNormals;
    }

    sampleSolid(){
        let object = this;
        let pointsInMesh = [];

        let i = 0;
        for (let u = object.uStart; u < object.uEnd; u += object.uDelta){
            pointsInMesh.push([]);
            
            for(let v = object.vStart; v < object.vEnd; v += object.vDelta){
                pointsInMesh[i].push(object.parametricFunction(u, v));
            }
            i += 1;
        }

    
        console.log(pointsInMesh)
        let neighborsInMesh = []
        i = 0;
        for (let u = object.uStart; u < object.uEnd; u += object.uDelta){
            let j = 0;
            for(let v = object.vStart; v < object.vEnd; v += object.vDelta){
                let curNeighbors = [pointsInMesh[i][j]];
                curNeighbors = curNeighbors.concat(this.findNeighbors(pointsInMesh, i, j));

                let upperLeft = this.normalize(pointsInMesh.length, pointsInMesh[0].length, i-1, j-1);
                curNeighbors.push(pointsInMesh[upperLeft[0]][upperLeft[1]]);//We need to close off the loop
                
                neighborsInMesh = neighborsInMesh.concat(curNeighbors)
                j += 1;
            }
            i += 1;
        }

        console.log(neighborsInMesh)
        return neighborsInMesh
    }

    getMeshVertices(){
        return this.sampleMesh();
    }

    //should return an array
    sampleMesh(){
        let object = this;
        let pointsInMesh = [];

        let i = 0;
        for (let u = object.uStart; u < object.uEnd; u += object.uDelta){
            pointsInMesh.push([]);
            
            for(let v = object.vStart; v < object.vEnd; v += object.vDelta){
                pointsInMesh[i].push(object.parametricFunction(u, v));
            }
            i += 1;
        }

    

        let linesInMesh = new Set();
        i = 0;
        for (let u = object.uStart; u < object.uEnd; u += object.uDelta){
            let j = 0;
            for(let v = object.vStart; v < object.vEnd; v += object.vDelta){
                for (const neighbor of object.findNeighbors(pointsInMesh, i, j)){
                    if (!(linesInMesh.has([pointsInMesh[i][j], neighbor]) && linesInMesh.has(neighbor, pointsInMesh[i][j]))){
                        linesInMesh.add([pointsInMesh[i][j], neighbor]);
                    }
                }
                
                j += 1;
            }
            i += 1;
        }


        let vertices = [];
        for (let points of linesInMesh){
            vertices = vertices.concat(points)
        }
        return vertices;
    }
    
    //TODO MAKE THIS CLOCKWISE
    //TODO make sure we start at sol üst
    //!These are HELPER functions 
    findNeighbors(pointsInMesh, i, j){
        let iRange = pointsInMesh.length;
        let jRange = pointsInMesh[0].length;

        let neighbors = [];
        
        let current = this.normalize(iRange, jRange, i-1, j-1);
        neighbors.push(pointsInMesh[current[0]][current[1]]);
        current = this.normalize(iRange, jRange, i-1, j);
        neighbors.push(pointsInMesh[current[0]][current[1]]);
        current = this.normalize(iRange, jRange, i-1, j+1);
        neighbors.push(pointsInMesh[current[0]][current[1]]);
        current = this.normalize(iRange, jRange, i, j+1);
        neighbors.push(pointsInMesh[current[0]][current[1]]);
        current = this.normalize(iRange, jRange, i+1, j+1);
        neighbors.push(pointsInMesh[current[0]][current[1]]);
        current = this.normalize(iRange, jRange, i+1, j);
        neighbors.push(pointsInMesh[current[0]][current[1]]);
        current = this.normalize(iRange, jRange, i+1, j-1);
        neighbors.push(pointsInMesh[current[0]][current[1]]);
        current = this.normalize(iRange, jRange, i, j-1);
        neighbors.push(pointsInMesh[current[0]][current[1]]);

        return neighbors
    }
    normalize(iRange, jRange, i, j){
        let res = [i, j];
        if (i == -1){
            res[0] = iRange-1;
        }
        if (j == -1){
            res[1] = jRange-1;
        }
        if (i == iRange){
            res[0] = 0;
        }
        if (j == jRange){
            res[1] = 0;
        }

        return res;
    }


}