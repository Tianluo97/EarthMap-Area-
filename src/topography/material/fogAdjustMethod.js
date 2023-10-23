import {noise} from '/utilities/PerlinNoise'
import * as THREE from "three";

export function fogAdjustMethod (uniforms, material) {

    material.onBeforeCompile = ( shader) => {

        // shader.uniforms = THREE.UniformsUtils.merge([shader.uniforms, uniforms]);
        // console.log(shader.uniforms)
        shader.uniforms.fogNearColor = uniforms.fogNearColor
        shader.uniforms.fogFarColor = uniforms.fogFarColor
        shader.uniforms.fogNoiseFreq = uniforms.fogNoiseFreq
        shader.uniforms.fogNoiseSpeed = uniforms.fogNoiseSpeed
        shader.uniforms.fogNoiseImpact = uniforms.fogNoiseImpact

        shader.vertexShader = shader.vertexShader.replace(
            '#include <fog_pars_vertex>',
            `
                #ifdef USE_FOG
                    varying float vFogDepth;
                    varying vec3 vFogWorldPosition;
                #endif
            `,
        )

        shader.vertexShader =shader.vertexShader.replace(

            '#include <fog_vertex>',
            `
                #ifdef USE_FOG
                    vFogDepth = - mvPosition.z;
                    vFogWorldPosition = (modelMatrix * vec4( transformed, 1.0 )).xyz;
                #endif
            `
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <fog_pars_fragment>',
            `
                #ifdef USE_FOG
                    ${noise}
                    uniform vec3 fogColor;
                    uniform vec3 fogNearColor;
                    uniform vec3 fogFarColor;
                    varying float vFogDepth;
                    #ifdef FOG_EXP2
                        uniform float fogDensity;
                    #else
                        uniform float fogNear;
                        uniform float fogFar;
                    #endif
                    varying vec3 vFogWorldPosition;
                    uniform float time;
                    uniform float fogNoiseSpeed;
                    uniform float fogNoiseFreq;
                    uniform float fogNoiseImpact;
                #endif
            `
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <fog_fragment>',
            `
            #ifdef USE_FOG
                
                vec3 windDir = vec3(0.0, 0.0, time);
                vec3 scrollingPos = vFogWorldPosition.xyz + fogNoiseSpeed * windDir;  
                float noise = cnoise(fogNoiseFreq * scrollingPos.xyz);
                float FogDepth = (1.0 - fogNoiseImpact * noise) * vFogDepth;

                #ifdef FOG_EXP2
                    float fogFactor = 1.0 - exp( - fogDensity * fogDensity * FogDepth * FogDepth );
                #else
                    float fogFactor = smoothstep( fogNear, fogFar, FogDepth );
                #endif

                gl_FragColor.rgb = mix( gl_FragColor.rgb, mix(fogNearColor, fogFarColor, fogFactor), fogFactor );

            #endif
            `
        )
    }
}