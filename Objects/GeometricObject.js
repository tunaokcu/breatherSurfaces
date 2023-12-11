//abstract class attempt
export default class GeometricObject{
    constructor(){
        if(this.constructor == GeometricObject) {
            throw new Error("Class is of abstract type and can't be instantiated");
         };
   
         if(this.getVertices == undefined) {
             throw new Error("getVertices method must be implemented");
         };
    }
}