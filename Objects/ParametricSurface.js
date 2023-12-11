export default class ParametricSurface{
    //should these be outside this class?
    constructor(uStart=0, uEnd=2*Math.PI, uDelta=2*Math.PI/360, vStart=0, vEnd=2*Math.PI, vDelta=2*Math.PI/360){
        this.uStart = uStart;
        this.uEnd = uEnd;
        this.uDelta = uDelta;

        this.vStart = vStart;
        this.vEnd = vEnd;
        this.vDelta = vDelta;

    }


    //just a blueprint
    //should return a vec4
    parametricFunction(u, v){
        console.log("super called");
        return vec4(1, 1, 1, 1);
    }

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

    //should return an array
    sample(object=this){
        //let pointsInMesh = this.samplePoints(object); //to test
        let pointsInMesh = [];

        let i = 0;
        for (let u = object.uStart; u < object.uEnd; u += object.uDelta){
            pointsInMesh.push([]);
            
            for(let v = object.vStart; v < object.vEnd; v += object.vDelta){
                pointsInMesh[i].push(object.parametricFunction(u, v));
            }
            i += 1;
        }
        
        console.log(pointsInMesh[0])

        let linesInMesh = new Set();
        i = 0;
        for (let u = object.uStart; u < object.uEnd; u += object.uDelta){
            let j = 0;
            for(let v = object.vStart; v < object.vEnd; v += object.vDelta){
                //console.log(v)
                //console.log(u, v)
                for (const neighbor of object.findNeighbors(pointsInMesh, i, j)){
                    //console.log(object.findNeighbors(pointsInMesh, i, j))
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
        console.log(vertices)
        return vertices
        //return flatten(vertices)
    }
  
    findNeighbors(pointsInMesh, i, j){
        //console.log(pointsInMesh[0].length)
        let iRange = pointsInMesh.length;
        let jRange = pointsInMesh[0].length;

        let neighbors = [];
        for (let k = i-1; k < i + 1; k++){
            for (let v = j-1; v < j+1; v++){
                if (!(k==i && v ==j)){//neighbors set does not include the point itself
                    let current = this.normalize(iRange, jRange, k, v);
                    neighbors.push(pointsInMesh[current[0]][current[1]])
                }
            }
        }

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

    drawAndRender(gl){
        const vertices = sample();

        var bufferId = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW ); 
        
    
        var vPosition = gl.getAttribLocation( program, "vPosition" );
        gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );   

        this.render(gl, vertices);   
    }
    render(gl, vertices){
        gl.clear( gl.COLOR_BUFFER_BIT ); 
        gl.drawArrays( gl.LINES, 0, vertices.length / 4);// divide by 4 since we have 4 dimensions for each vertex
    }
}