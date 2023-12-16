import EnvironmentLight from "./EnvironmentLight.js";
import PointLightSource from "./PointLightSource.js";

//!Assumes single point light source
export default class AggregateLight{
    constructor(environmentLight = new EnvironmentLight(), pointLight = new PointLightSource()){
        this.environmentLight = environmentLight;
        this.pointLight = pointLight;
    }
}