
import ParametricSurface from "./ParametricSurface";

//Should extend GeometricObject or something of the sort(not high priority, not even relevant to the assignment)
export default class Cube extends ParametricSurface{
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

    //TODO should be lines not points
    sample(){
        return this.points;
    }
}