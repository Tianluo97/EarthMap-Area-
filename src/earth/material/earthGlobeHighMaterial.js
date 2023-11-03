import * as THREE from 'three'
import {Mesh} from 'three'
import { _earthRadius } from '/utilities/constants.js'
import { GUI } from 'dat.gui'
import {animationSheet} from '/animations/animation'

export class EarthMaterialHigh  {
    constructor() {

    const material = new THREE.MeshStandardMaterial({
        emissive: 'rgb(228, 195, 131)',
        fog: false,
        transparent: true,
        opacity: 1.0
    });

    const colorTexture = new THREE.TextureLoader().load('./earth/textures/earthHigh.jpg'); 
    const nightTexture = new THREE.TextureLoader().load('./earth/textures/8k_earth_nightmap.jpeg' ); 
    const specularTexture = new THREE.TextureLoader().load('./earth/textures/8k_earth_specular_map.png' ); 
    const roughnessTexture = new THREE.TextureLoader().load('./earth/textures/8k_earth_roughness_map.png' ); 
    const displacementTexture = new THREE.TextureLoader().load('./earth/textures/EARTH_DISPLACE_42K_16BITS_preview.jpg')
    
    material.map = colorTexture
    material.emissiveMap = nightTexture
    material.emissiveIntensity = 2.0
    material.roughnessMap = roughnessTexture
    material.roughness = 1.0
    material.metalnessMap = specularTexture
    material.metalness = 0.3
    material.displacementMap = displacementTexture
    material.displacementScale = 0.0

    const customUniforms = {
        atmosphereRange: { value: 3.6 },
        atmosphereIntensity: { value: 2.8 },
        mapIntensity: {value: 1.0}
    }

    animationSheet.earthHighAnimation(material)

    //sphereMaterial
    material.onBeforeCompile = (shader) =>
    {   
    shader.uniforms.atmosphereRange = customUniforms.atmosphereRange   
    shader.uniforms.atmosphereIntensity = customUniforms.atmosphereIntensity
    shader.uniforms.mapIntensity = customUniforms.mapIntensity  

    //uniform参数
    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
            #include <common>

            uniform float atmosphereRange; 
            uniform float atmosphereIntensity; 
            uniform float mapIntensity; 
        `
    )

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <tonemapping_fragment>',
        `
        #if defined( TONE_MAPPING )
        
            vec4 toneMappingMask = texture2D(metalnessMap, vUv);
            gl_FragColor.rgb = toneMapping( gl_FragColor.rgb ) * toneMappingMask.r +gl_FragColor.rgb * (1.0 - toneMappingMask.r) ;
    
        #endif
        `
    )

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        `
            #include <map_fragment>
            diffuseColor  = (vec4(0.129,0.282,0.498,1.0) + sampledDiffuseColor * mapIntensity)  * diffuseColor.a; 
        `
    )
        
    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <output_fragment>',
        `
        #include <output_fragment>
        
            #ifdef OPAQUE
            diffuseColor.a = 1.0;
            #endif
    
            #ifdef USE_TRANSMISSION
            diffuseColor.a *= material.transmissionAlpha + 0.1;
            #endif

            //intensity控制地球周围颜色的强度, 其实就是创造菲涅尔
            float intensity = 1.0 - dot(geometry.normal, vec3(0., 0., 1.0));
            //power内的值控制白色收边范围，乘的数值控制强度
            intensity = pow(intensity, atmosphereRange) * atmosphereIntensity;

            //lambert
            float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
            intensity *= dotNL;
            
            //atmosphere 
            vec3 atmosphere = vec3(1.0) * intensity;

            //调节黑夜部分
            totalEmissiveRadiance *= pow(saturate(.8 -  dotNL), 2.0) * 1.2;
            
            reflectedLight.directDiffuse *= dotNL ;
            reflectedLight.indirectDiffuse  *= dotNL ;

            outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;

            gl_FragColor = vec4(outgoingLight + atmosphere, diffuseColor.a);
            //gl_FragColor = vec4(vec3(pow(saturate(1.0 -  dotNL), 3.0) * 1.2), 1.0);
        `
        )
    }

    const gui = new GUI()
    var postProcessing = gui.addFolder('EarthGlobe')
    postProcessing.add(customUniforms.atmosphereRange, 'value').min(0).max(5.0).step(0.0001).name('atmosphereRange')
    postProcessing.add(customUniforms.atmosphereIntensity, 'value').min(0).max(5.0).step(0.0001).name('atmosphereIntensity')
    postProcessing.add(customUniforms.mapIntensity, 'value').min(0).max(1.0).step(0.0001).name('mapIntensity')
    postProcessing.add(material, 'displacementScale').min(0).max(1).step(0.0001).name('earthDisplacement')
    postProcessing.add(material, 'roughness').min(-2).max(2).step(0.00001).name('earthRoughness')
    postProcessing.add(material, 'metalness').min(-2).max(2).step(0.00001).name('earthMetalness')

    const testMaterial = new THREE.MeshStandardMaterial( { map: colorTexture} );

    return material
}  
}