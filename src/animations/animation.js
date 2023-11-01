/* ... */
import * as THREE from 'three'
import { getProject, types } from '@theatre/core'

import studio from '@theatre/studio'

/**
 * Theatre.js
 */

 class sheet {
    constructor(){
        studio.initialize()
        /* ... */

        // Create a project for the animation
        const project = getProject('THREE.js x Theatre.js')

        // Create a sheet
        this.animationSheet = project.sheet('Animated scene')

        // Create a Theatre.js object with the props you want to
        // animate
        this.turbine = this.animationSheet.object('Turbine', {
            opacity: types.number(0, {range: [0, 1], nudgeMultiplier: 0.1}),
        })
        
        //cloud
        this.cloud = this.animationSheet.object('Cloud', {
            opacity: types.compound({
                x: types.number(0.2, { range: [0, 2], nudgeMultiplier: 0.0001  }),
                y: types.number(0.4, { range: [0, 2], nudgeMultiplier: 0.0001  }),
                z: types.number(1.0, { range: [0, 2], nudgeMultiplier: 0.0001  }),
            }),
        })
    }

    earthAnimation(mesh){   
        this.earth = this.animationSheet.object('Earth', {
            // Note that the rotation is in radians
            // (full rotation: 2 * Math.PI)
            rotation: types.compound({
            x: types.number(mesh.rotation.x, { range: [-2, 2], nudgeMultiplier: 0.0001  }),
            y: types.number(mesh.rotation.y, { range: [-2, 2], nudgeMultiplier: 0.0001  }),
            z: types.number(mesh.rotation.z, { range: [-2, 2], nudgeMultiplier: 0.0001  }),
            }),
        })

        this.earth.onValuesChange((values) => {
            const { x, y, z } = values.rotation
            mesh.rotation.set(x * Math.PI, y * Math.PI, z * Math.PI)
        })
    }

    cameraAnimation(camera){
        this.camera = this.animationSheet.object('Camera', {
            position: types.compound({
            x: types.number(camera.position.x, { range: [-200, 200], nudgeMultiplier: 0.0001  }),
            y: types.number(camera.position.y, { range: [-200, 200], nudgeMultiplier: 0.0001  }),
            z: types.number(camera.position.z, { range: [-200, 200], nudgeMultiplier: 0.0001  }),
            }),
            targetPosition: types.compound({
            a: types.number(camera.targetPosition.x, { range: [-300, 300], nudgeMultiplier: 0.001  }),
            b: types.number(camera.targetPosition.y, { range: [-300, 300], nudgeMultiplier: 0.001  }),
            c: types.number(camera.targetPosition.z, { range: [-300, 300], nudgeMultiplier: 0.001  }),
            }),
            rotation: types.compound({
            x1: types.number(camera.rotation.x, { range: [-2, 2], nudgeMultiplier: 0.0001  }),
            y1: types.number(camera.rotation.y, { range: [-2, 2], nudgeMultiplier: 0.0001  }),
            z1: types.number(camera.rotation.z, { range: [-2, 2], nudgeMultiplier: 0.0001  }),
            }),
            quaternion: types.compound({
            x2: types.number(camera.quaternion.x, { range: [-10, 10], nudgeMultiplier: 0.0001  }),
            y2: types.number(camera.quaternion.y, { range: [-10, 10], nudgeMultiplier: 0.0001  }),
            z2: types.number(camera.quaternion.z, { range: [-10, 10], nudgeMultiplier: 0.0001  }),
            w2: types.number(camera.quaternion.w, { range: [-10, 10], nudgeMultiplier: 0.0001  }),
            })
        })

        this.camera.onValuesChange((values) => {
            const { x, y, z } = values.position
            const { a, b, c } = values.targetPosition
            const { x1, y1, z1 } = values.rotation
            const { x2, y2, z2, w2 } = values.quaternion

            camera.position.set(x, y, z)
            camera.rotation.set(x1 * Math.PI, y1 * Math.PI, z1 * Math.PI)

            const quaternion = new THREE.Quaternion(x2, y2, z2, w2 )
            camera.applyQuaternion(quaternion)
            camera.updateProjectionMatrix()
            // camera.targetPosition.copy(new THREE.Vector3(a, b, c))
            // camera.lookAt(camera.targetPosition)
        })
    }

    turbineAnimation(turbine){
        this.turbine.onValuesChange((values) => {
            const x = values.opacity
            turbine.material.opacity = x
        })
    }

    topographyMaterialAnimation(material){
        this.topography = this.animationSheet.object('Topography', {
            opacity: types.number(0, {range: [0, 1], nudgeMultiplier: 0.1}),
          })

        this.topography.onValuesChange((values) => {
            const x = values.opacity
            material.opacity = x
        })
    }

    fogMaterialAnimation(material){
        this.fog = this.animationSheet.object('Fog', {
            opacity: types.number(0, {range: [0, 1], nudgeMultiplier: 0.1}),
          })

        this.fog.onValuesChange((values) => {
            const x = values.opacity
            material.opacity = x
        })
    }

    cloudMaterialAnimation(material1, material2, material3){
        this.cloud.onValuesChange((values) => {
            const { x, y, z } = values.opacity
            material1.opacity = x
            material2.opacity = y
            material3.opacity = z
        })
    }

    atmosphereAnimation(earthGroup, earthAtmosphere){
        this.atmosphere = this.animationSheet.object('Atmosphere', {
            opacity: types.number(10.0, {range: [0, 10], nudgeMultiplier: 0.1}),
        })

        this.atmosphere.onValuesChange((values) => {
            const x = values.opacity
            if (x < 2){
                earthGroup.remove(earthAtmosphere)
            }
            if (x > 2){
                earthGroup.add(earthAtmosphere)
            }
        })
    }
}

export const animationSheet = new sheet()

