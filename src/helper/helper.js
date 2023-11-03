import{ AxesHelper, DirectionalLightHelper, CameraHelper} from "three"

export class axexHelper extends AxesHelper {
    constructor(width){
        super(width)
    }
}

export class directionLightHelper extends DirectionalLightHelper {
    constructor(light, width){
        super(light, width)
    }
}

export class cameraHelper extends CameraHelper {
    constructor(shadowCamera){
        super(shadowCamera)
    }
}