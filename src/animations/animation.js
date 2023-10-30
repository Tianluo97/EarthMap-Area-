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
        })

        this.camera.onValuesChange((values) => {
            const { x, y, z } = values.position
            const { a, b, c } = values.targetPosition
            
            camera.position.set(x, y, z)
            camera.targetPosition.copy(new THREE.Vector3(a, b, c))
            camera.lookAt(camera.targetPosition)
            camera.updateProjectionMatrix()
        })
    }

    turbineAnimation(turbine){
        
        this.turbine.onValuesChange((values) => {
            const x = values.opacity
            turbine.material.opacity = x
        })
    }
}

export const animationSheet = new sheet()

