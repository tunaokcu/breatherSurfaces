    import GeometricObject from "./GeometricObject.js";
    import {flatten, vec4, vec3, subtract, normalize, cross, negate} from "../Common/MV.js";
    //import bump from "./BumpMapGenerator.JS" 

        

        
    function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

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
        getSolidVertices(){
            return this.sampleSolid();
        }

        //? WHY ARE THERE TWO
        /*
        getTangents(){
            let points = this.pointsInMeshStrip;
            this.tangents = [];

            for (let i = 0; i < this.pointsInMeshStrip.length-2; i++){
                for (let j = 0; j < this.pointsInMeshStrip[i].length-2; j++){
                    // calculate the edges (vectors) of the current fragment
                    let oneTotwo = subtract(points[i][j+1],points[i][j]);
                    this.tangents.append(oneTotwo);
                }
            }        
        }
        getTangents(){
            if (this.allNormals == null){
                this.getVertexNormals()
            }

        }
        */


        //!Two essential functions. We sample the points on the surface using samplePoints and construct the surface with them using sampleSolid
        samplePoints(object=this){
            let pointsInMesh = [];

            let i = 0;
            for (let u = object.uStart; u < object.uEnd; u += object.uDelta){
                pointsInMesh.push([])
                for(let v = object.vStart; v < object.vEnd; v += object.vDelta){
                    pointsInMesh[i].push(object.parametricFunction(u, v));
                }
                i += 1;
            }
            
            return pointsInMesh;
        }
        sampleSolid(object=this){  
            let pointsInMesh = this.samplePoints(object); //doesn't wrap around, so it should be made to wrap around

            let vertices = [];

            let leftUp, rightUp, leftDown, rightDown;
            let iDown, jRight
            let triangleOne, triangleTwo; //two triangles per square visited


            for (let i = 0; i < pointsInMesh.length; i++){
                iDown = i + 1 == pointsInMesh.length ? 0 : i+1; //wrap around

                for (let j = 0; j < pointsInMesh[i].length; j++){
                    jRight = j + 1 == pointsInMesh[i].length ? 0 : j+1;

                    leftUp = pointsInMesh[i][j]; //upper left square
                    rightUp = pointsInMesh[i][jRight];
                    leftDown = pointsInMesh[iDown][j];
                    rightDown = pointsInMesh[iDown][jRight];


                    //! Anything could go wrong here... way too much working with objects without copying
                    triangleOne = [leftUp, leftDown, rightDown]; //! going counter clockwise.. is this right?
                    triangleTwo = [rightDown, rightUp, leftUp];
                    
                    vertices = vertices.concat(...triangleOne, ...triangleTwo);

                }
            }
        
            return vertices;
        }



        unravel(points){
            let res = [];

            for (const pointsArr of points){
                res = res.concat(pointsArr);
            }
            return res;
        }


        //Ref: https://discourse.threejs.org/t/calculating-vertex-normals-after-displacement-in-the-vertex-shader/16989
        calculateNormal(center, neighbor1, neighbor2){
            let tangent = subtract(neighbor1, center);
            let bitangent = subtract(neighbor2, center);
            
            return cross(tangent, bitangent); //No need to normalize, the vertex shader will handle that
        }

        getVertexNormals(object=this){
            //Approximation using vertices
            //return this.sampleSolid();

            let pointsInMesh = this.samplePoints(object); //doesn't wrap around, so it should be made to wrap around
            let normals = [];

            let center;
            let up, right, rightDown, down, left, leftUp;
            let iUp, iDown, jLeft, jRight;
            let n1, n2, n3, n4, n5, n6; 


            for (let i = 0; i < pointsInMesh.length; i++){
                iUp = i - 1 == -1 ? pointsInMesh.length - 1 : i - 1;
                iDown = i + 1 == pointsInMesh.length ? 0 : i+1; //wrap around

                for (let j = 0; j < pointsInMesh[i].length; j++){
                    jLeft = j - 1 == -1 ? pointsInMesh[i].length - 1 : j - 1;
                    jRight = j + 1 == pointsInMesh[i].length ? 0 : j+1;

                    center = pointsInMesh[i][j]

                    up = pointsInMesh[iUp][j];
                    right = pointsInMesh[i][jRight];
                    rightDown = pointsInMesh[iDown][jRight];
                    down = pointsInMesh[iDown][j];
                    left = pointsInMesh[i][jLeft];
                    leftUp = pointsInMesh[iUp][jLeft];
                    
                    //Clockwise:
                    n1 = negate(this.calculateNormal(center, up, right));
                    n2 = negate(this.calculateNormal(center, right, rightDown));
                    n3 = negate(this.calculateNormal(center, rightDown, down));
                    n4 = negate(this.calculateNormal(center, down, left));
                    n5 = negate(this.calculateNormal(center, left, leftUp));
                    n6 = negate(this.calculateNormal(center, leftUp, up));

                    normals = normals.concat(...n1, ...n2, ...n3, ...n4, ...n5, ...n6); //normals.concat(...n6, ...n5, ...n4, ...n3, ...n2, ...n1);//

                }
            }
        
            return normals;
            /* Past implementation
            let points = this.samplePoints();
            
            let allNormals = [];
            
            for (let i = 0; i < points.length-2; i++){
                for (let j = 0; j < points[i].length-2; j++){
                    // calculate the edges (vectors) of the current fragment
                    let oneTotwo = subtract(points[i][j+1],points[i][j]);
                    let oneTothree = subtract(points[i][j+2],points[i][j]);
                    //let twoTothree = subtract(points[i][j+2],points[i][j+1]);


                    // calculate normals from the edge vectors
                    let normal1 = normalize( cross(oneTotwo, oneTothree) );
                    normal1 = vec4(normal1);
                    normal1[3] = 0;
                    
                    
                    if (this.bumpMappingOn){
                        let bumpFactor = perlin.get(this.pointsInMeshStrip[i][j][0], this.pointsInMeshStrip[i][j][1]);
                        perlin.seed()
                        normal1[0] *= bumpFactor;
                        normal1[1] *= bumpFactor;
                        normal1[2]  *= bumpFactor;
                    }
                    normal1 = normalize(normal1);
                    // ************************************************************
                    // MINUS SIGN MIGHT NOT CHANGE DIRECTION HERE, HAVE TO MAKE SURE IT DOES
                    // ************************************************************
                    
                    //let normal2 = normalize( cross( negate(oneTotwo), twoTothree) );
                    //normal2 = vec4(normal2);
                    //normal2[3] = 0;

                    //let normal3 = normalize( cross(negate(oneTothree), negate(twoTothree)) );
                    //normal3 = vec4(normal3);
                    //normal3[3] = 0;
                    // add all vertex normals for the current fragment
                    allNormals.push(normal1);
                    //allNormals.push(normal2); 
                    //allNormals.push(normal3);
                }
            }

            this.allNormals = allNormals;
            return allNormals;
            */
        }


        //faulty
        getTrueNormals(){
            let object = this;
            let pointsInMesh = [];

            for (let u = object.uStart; u < object.uEnd; u += object.uDelta){
                for(let v = object.vStart; v < object.vEnd; v += object.vDelta){
                    let normal1 = object.trueNormals(u, v);
                    //normal1 = this.bumpMap(normal1, u, v);

                    for (let i = 0; i < 6; i++) pointsInMesh.push(normal1);
                }
            }
            
            return pointsInMesh;
        }
        /*
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

            return neighborsInMesh
        }
        */

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

        bumpMap(normal1, u, v){
            if (this.bumpMappingOn){
                let bumpFactor = perlin.get(u, v);//perlin.get(this.pointsInMeshStrip[i][j][0], this.pointsInMeshStrip[i][j][1]);
                perlin.seed()
                normal1[0] *= bumpFactor;
                normal1[1] *= bumpFactor;
                normal1[2]  *= bumpFactor;
                normal1 = normalize(normal1);
            }
            return normal1;
        }
    }