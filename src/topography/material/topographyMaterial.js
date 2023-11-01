import * as THREE from 'three'
import { GUI } from 'dat.gui'
//import testVertexShader from './shader/vertex.glsl'
//import testFragmentShader from './shader/fragment.glsl'
import {fogAdjustMethod} from './fogAdjustMethod.js'
import {animationSheet} from '/animations/animation'

const baseColor = new THREE.TextureLoader().load('../topography/textures/scene - 2023-09-13T145059.174_DefaultMaterial_BaseColor.png' );  
//const normalMap = new THREE.TextureLoader().load('./textures/scene - 2023-08-24T103904.127_DefaultMaterial_Normal.png' ); 
//const metalMap = new THREE.TextureLoader().load('./textures/scene - 2023-08-24T103904.127_DefaultMaterial_Metallic.png' ); 
//const roughnessMap = new THREE.TextureLoader().load('./textures/test1/scene - 2023-09-13T145059.174_DefaultMaterial_Roughness.png' ); 
//const displacementMap = new THREE.TextureLoader().load('./textures/scene - 2023-08-24T103904.127_DefaultMaterial_Height.jpg' );  
//displacementMap.wrapS = THREE.RepeatWrapping;
//displacementMap.wrapT = THREE.RepeatWrapping;
//displacementMap.repeat.set( 50, 50 );
//const aoMap = new THREE.TextureLoader().load('./data/textures/Ambient Occlusion Map from Mesh DefaultMaterial.png' );

const params = {
    color1: 0xfff1da,
    color2: 0xfff7dc,
    fogNoiseSpeed: 100,
    fogNoiseFreq: .0012,
    fogNoiseImpact: .5
}

let uniforms = {
    fogNearColor: {value: new THREE.Color(params.color1)},
    fogFarColor: {value: new THREE.Color(params.color2)},
    fogNoiseFreq: { value: params.fogNoiseFreq },
    fogNoiseSpeed: { value: params.fogNoiseSpeed },
    fogNoiseImpact: { value: params.fogNoiseImpact },
    time: { value: 0 }
};
export {uniforms}

export const mergedMaterial = new THREE.MeshStandardMaterial({
    // color: params.color,
    map: baseColor, 
    // normalMap: normalMap,
    // aoMap: aoMap,
    // displacementMap: displacementMap,
    // displacementScale: 0.01,
    // metalnessMap: metalMap,
    // metalness: 0.0, 
    // roughness: 1.0, 
    side: THREE.DoubleSide,
    // roughnessMap: roughnessMap,
    transparent:true,
    opacity:1.0
    // side: THREE.DoubleSide 
    // WrapS : THREE.RepeatWrapping,
    // WrapT : THREE.RepeatWrapping,
});

fogAdjustMethod(uniforms, mergedMaterial)
animationSheet.topographyMaterialAnimation(mergedMaterial)

const gui = new GUI()
const mountainMaterial = gui.addFolder('THREE.mountainMaterial')
mountainMaterial.addColor(params, 'color1').name('nearFogColor').onChange(function(value) {
    uniforms.fogNearColor.value.set( value );
});
mountainMaterial.addColor(params, 'color2').name('farFogColor').onChange(function(value) {
    uniforms.fogFarColor.value.set( value );
});
mountainMaterial.add(params, "fogNoiseFreq", 0, 0.01, 0.0012).onChange(function() {
    uniforms.fogNoiseFreq.value = params.fogNoiseFreq;
});
mountainMaterial.add(params, "fogNoiseSpeed", 0, 1000, 100).onChange(function() {
    uniforms.fogNoiseSpeed.value = params.fogNoiseSpeed;
});
mountainMaterial.add(params, "fogNoiseImpact", 0, 1).onChange(function() {
    uniforms.fogNoiseImpact.value = params.fogNoiseImpact;
});

// mountainMaterial.add(mergedMaterial, 'metalness', 0, 10, 0.1).name('metalness')
// mountainMaterial.add(mergedMaterial, 'roughness', 0, 10, 0.1).name('roughness')
// mountainMaterial.add(mergedMaterial, 'metalness', 0, 10, 0.1).name('metalness')
// mountainMaterial.add(mergedMaterial, 'displacementScale', 0, 1, 0.00001).name('displacementScale')

// export const mergedMaterial = (minBoundary, maxBoundary) => {
//     return new THREE.ShaderMaterial({
//         vertexShader: testVertexShader,
//         fragmentShader: testFragmentShader,
//         uniforms:
//         {
//             color1: {
//                 value: new THREE.Color("red")
//               },
//             color2: {
//                 value: new THREE.Color("purple")
//             },
//             bboxMin: {
//                 value: minBoundary
//             },
//             bboxMax: {
//                 value: maxBoundary
//             }
//         }
//     })
// }

// export const mergedMaterial = (minBoundary, maxBoundary) => {
//     const material = new THREE.MeshStandardMaterial({
//         //color: params.color,
//         side: THREE.DoubleSide,
//         //map: baseColor,
//         //displacementMap: displacementMap,
//         //displacementScale: 1.0,
//         //normalMap: normalMap,
//         //roughnessMap: roughnessMap,
//         //metalnessMap: metalMap
//     });

//     let uniforms = {
//       bbMin: {value: minBoundary},
//       bbMax: {value: maxBoundary},
//       color1: {value: new THREE.Color(params.color1)},
//       color2: {value: new THREE.Color(params.color2)}
//     }

    // material.onBeforeCompile = (shader) => {
    //     shader.uniforms.bbMin = uniforms.bbMin;
    //     shader.uniforms.bbMax = uniforms.bbMax;
    //     shader.uniforms.color1 = uniforms.color1;
    //     shader.uniforms.color2 = uniforms.color2;

    //     shader.vertexShader = `
    //         uniform vec3 bbMin;
    //         uniform vec3 bbMax;
    //         varying float height;

    //         ${shader.vertexShader}
    //         `.replace(
    //         `#include <begin_vertex>`,
    //         `
    //         #include <begin_vertex>
    //             height = (position.y - bbMin.y) / (bbMax.y - bbMin.y);
    //             height = pow(height, 0.5);
    //         `
    //     );
    //     shader.fragmentShader = 
    //     `
    //         varying float height;
    //         uniform vec3 color1;
    //         uniform vec3 color2;
    //         ${shader.fragmentShader}
    //     `
    //     .replace(
    //     '#include <output_fragment>',
    //     `
    //         #include <output_fragment>

    //         vec3 col = mix(color1, color2, height);
    //         //gl_FragColor.rgb = col;
    //         gl_FragColor.rgb = mix(color1, gl_FragColor.rgb , height);

    //         float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
    //         dotNL += 0.1; 
    //         //gl_FragColor.rgb *= dotNL;

    //         //debug
    //         //dotNL = pow(dotNL, 5.0);
    //         //gl_FragColor.rgb = vec3(dotNL);
    //     `
    //     );
    // }

//     const gui = new GUI()
//     var topography = gui.addFolder('Topography')
//     topography.addColor(params, 'color1').onChange(function(value) {
//         uniforms.color1.value.set( value );
//     });
//     topography.addColor(params, 'color2').onChange(function(value) {
//         uniforms.color2.value.set( value );
//     });
//     topography.add(material, 'displacementScale', 0, 1, 0.001).name('displacementScale')
//     topography.add(material, 'roughness', 0, 10, 0.1).name('roughness')
//     topography.add(material, 'metalness', 0, 10, 0.1).name('metalness')
//     return material
// }