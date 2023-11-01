import * as THREE from 'three'
import {Mesh} from 'three'
import { _earthRadius } from '/utilities/constants.js'

export class CloudLayer3Material {
    constructor() {
    
    const customUniforms = {
        atmoIntensity: { value: 0.7 },
        uTime: {value: 0}
    }

    const cloudTexture = new THREE.TextureLoader().load('./earth/textures/clouds.png' ); 
    const material = new THREE.MeshLambertMaterial
    (   
        {
            color: 'white',
            transparent: true,
            alphaMap: cloudTexture,
            displacementMap: cloudTexture,
            displacementScale: 0.1,
            opacity: 1.0,
            fog: false
        }
    );

    material.onBeforeCompile = (shader) =>
    {
        //console.log(shader.fragmentShader)
        
        shader.uniforms.atmoIntensity = customUniforms.atmoIntensity

        //displacement 
        shader.vertexShader = shader.vertexShader.replace(
            '#include <displacementmap_vertex>',
            `
            #ifdef USE_DISPLACEMENTMAP

                //transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vUv ).x * displacementScale + displacementBias);

                float displacementIntensity = smoothstep(0.2, 1.0,texture2D( displacementMap, vUv ).x);
                transformed += normalize( objectNormal ) * displacementIntensity * displacementScale + displacementBias;
                //transformed.x += 0.045;
        
            #endif
            `
        )

        //cubicPulse function define
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <common>',
            `
                #include <common>

                float cubicPulse( float c, float w, float x )
                {
                    x = abs(x - c);
                    if( x>w ) return 0.0;
                    x /= w;
                    return (1.0 - x*x*(3.0-2.0*x));
                }
            `
        )
        
        //AlphaMap
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <alphamap_fragment>',
            `
            #ifdef USE_ALPHAMAP

                float intensity = smoothstep(0.5, 0.9, texture2D( alphaMap, vUv).g);
                diffuseColor.a *= intensity;
            #endif
            `
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <output_fragment>',
            `
            #include <output_fragment>

            //Mask
            float yMask = cubicPulse(0.55,0.4,vUv.y);
            float xMask =  dot(geometry.normal ,vec3(0.0,0.0,1.0));
            xMask = smoothstep(0.3, 1.0, xMask);

            gl_FragColor = vec4( outgoingLight, diffuseColor.a * xMask * yMask);

            //gl_FragColor = vec4(xMask,xMask,xMask,1.0);
            `
        )
    }
    return material
  }
}