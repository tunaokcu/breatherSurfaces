
function render(gl, vertices){
    gl.clear( gl.COLOR_BUFFER_BIT ); 
    gl.drawArrays( gl.LINES, 0, vertices.length / 4);// divide by 4 since we have 4 dimensions for each vertex
}

function init(){
    var canvas = document.getElementById( "gl-canvas" );
    var gl = WebGLUtils.setupWebGL( canvas );    
    if ( !gl ) { alert( "WebGL isn't available" ); }       

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );   

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );       
    
    return [canvas, gl];
}

function spherePoints(r, delta = 2* Math.PI / 360){
    let mesh = sample(sphereParametricFunction, delta, [r]);
    let points = [];

    for (let i = 0; i < mesh[0].length; i++){
        for (let j = 0; j < mesh.length; j++){
            points = points + getNeighbors(mesh, [i,j], [mesh[0].length, mesh.length]);
        }
    }
    return flatten(points);
}

function sphereParametricFunction(u, v, r){
    return [r*Math.cos(u)*Math.cos(v), r*Math.sin(u)*Math.cos(v), r*Math.sin(v)];
}

function sample(parametricFunction, delta = 2 * Math.PI / 360, additionalParameters = []){
    let range = 2*Math.PI;
    //let iterations = Math.floor(range/delta);
    
    let mesh = []
    let u, i, v;
    for (u = i = 0; u < range; u += delta, i += 1){
        mesh.push([]);
        for (v = 0; v < range; v += delta){
            mesh[i].push(parametricFunction(u, v, ...additionalParameters));
        }
    }

    return mesh;
}

//Should actually be indices instead of coords
function getNeighbors(mesh, coords, dimensions){
    console.log(mesh.length);
    console.log(mesh[0].length)
    const [x, y] = coords;

    let neighbors = [];

    for (let i = x-1; i <= x+1; i++){
        for (let j = y-1; y <= y+1; j++){
            if (i != x && j != y){
                let currentNeighbors = normalizeCoords([i, j], dimensions);
                try {
                //console.log(currentNeighbors)
                //neighbors.push(mesh[currentNeighbors[0]][currentNeighbors[1]]);
                } catch(err){
                    console.log("error is caused by ", currentNeighbors, x, y);
                    continue;
                }
            }
        }
    }

    return neighbors;
}

function normalizeCoords(coords, dimensions){
    const [x, y] = coords;
    const [x_max, y_max] = dimensions;

    let res = [(x) % x_max, (y_max) % y_max];

    if (x == -1){
        res[0] = x_max - 1;
    }
    if (y == -1){
        res[1] = y_max - 1;
    }

    return res;    
}