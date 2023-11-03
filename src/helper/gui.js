import * as dat from 'dat.gui';

const gui = new dat.GUI();

export function addGUI(light, light1, light2){
    const params = {
        color: '#ffffff',
        color1: '#ffffff',
        color2: '#ffffff'
      };

    const lightFolder = gui.addFolder('平行光');
    lightFolder.close();
    
    /**
     * 灯光一
     */
    lightFolder.addColor(params, 'color').onChange(function(value) {
        light.color.set( value );
    }).name('灯光一颜色');

    //灯光的强度
    lightFolder.add(light, 'intensity', 0, 2).name('灯光强度').step(0.01)

    lightFolder
        .add(light.shadow.camera, 'left', -50, 50, 0.1)
        .onChange(() => light.shadow.camera.updateProjectionMatrix())
    lightFolder
        .add(light.shadow.camera, 'right', -50, 50, 0.1)
        .onChange(() => light.shadow.camera.updateProjectionMatrix())
    lightFolder
        .add(light.shadow.camera, 'top', -50, 50, 0.1)
        .onChange(() => light.shadow.camera.updateProjectionMatrix())
    lightFolder
        .add(light.shadow.camera, 'near', 0.0, 100)
        .onChange(() => light.shadow.camera.updateProjectionMatrix())
    lightFolder
        .add(light.shadow.camera, 'far', 0.0, 100)
        .onChange(() => light.shadow.camera.updateProjectionMatrix())
    lightFolder
        .add(light.shadow, 'bias', -0.2000, 0.2000).step(0.001)
        .onChange(() => light.shadow.camera.updateProjectionMatrix())
    
    // 灯光的位置
    lightFolder.add(light.position, 'x', -10, 10).name('灯光x坐标').step(0.001).onChange(() => light.shadow.camera.updateProjectionMatrix())
    lightFolder.add(light.position, 'y', -10, 10).name('灯光y坐标').step(0.001).onChange(() => light.shadow.camera.updateProjectionMatrix())
    lightFolder.add(light.position, 'z', -30, 30).name('灯光z坐标').step(0.001).onChange(() => light.shadow.camera.updateProjectionMatrix())

    lightFolder
        .add(light.targetObject.position, 'x').min(-30).max(30).step(0.0001).name('targetX')
    lightFolder
        .add(light.targetObject.position, 'y').min(-30).max(30).step(0.0001).name('targetY')
    lightFolder
        .add(light.targetObject.position, 'z').min(-30).max(30).step(0.0001).name('targetZ')
        
    lightFolder.addColor(params, 'color1').onChange(function(value) {
        light1.color.set( value );
    }).name('垂直光颜色');

    //灯光的强度
    lightFolder.add(light1, 'intensity', 0, 2).name('垂直光强度').step(0.01)

    // 灯光的位置
    lightFolder.add(light1.position, 'x', -200, 200).name('垂直光x坐标').step(0.01)
    lightFolder.add(light1.position, 'y', -200, 200).name('垂直光y坐标').step(0.01)
    lightFolder.add(light1.position, 'z', -200, 200).name('垂直光z坐标').step(0.01)

    lightFolder
        .add(light1.shadow.camera, 'left', -50, 50, 0.1)
        .onChange(() => light1.shadow.camera.updateProjectionMatrix()).name('左边阴影')
    lightFolder
        .add(light1.shadow.camera, 'right', -50, 50, 0.1)
        .onChange(() => light1.shadow.camera.updateProjectionMatrix()).name('右边阴影')
    lightFolder
        .add(light1.shadow.camera, 'top', -50, 50, 0.1)
        .onChange(() => light1.shadow.camera.updateProjectionMatrix()).name('上边阴影')
    lightFolder
        .add(light1.shadow.camera, 'near', 0.0, 100)
        .onChange(() => light1.shadow.camera.updateProjectionMatrix()).name('近处阴影')
    lightFolder
        .add(light1.shadow.camera, 'far', 0.0, 100)
        .onChange(() => light1.shadow.camera.updateProjectionMatrix()).name('远处阴影')
    lightFolder
        .add(light1.shadow, 'bias', -0.2000, 0.2000).step(0.001)
        .onChange(() => light1.shadow.camera.updateProjectionMatrix()).name('阴影偏移')

    lightFolder
        .add(light1.targetObject.position, 'x').min(-30).max(30).step(0.0001).name('垂直光targetX')
    lightFolder
        .add(light1.targetObject.position, 'y').min(-30).max(30).step(0.0001).name('垂直光targetY')
    lightFolder
        .add(light1.targetObject.position, 'z').min(-30).max(30).step(0.0001).name('垂直光targetZ')
    
    /**
     * 灯光三
     */
    
    lightFolder.addColor(params, 'color2').onChange(function(value) {
        light2.color.set( value );
    }).name('侧光颜色');

    //灯光的强度
    lightFolder.add(light2, 'intensity', 0, 2).name('侧光强度').step(0.01)

    // 灯光的位置
    lightFolder.add(light2.position, 'x', -300, 300).name('侧光x坐标').step(0.01)
    lightFolder.add(light2.position, 'y', -300, 300).name('侧光y坐标').step(0.01)
    lightFolder.add(light2.position, 'z', -300, 300).name('侧光z坐标').step(0.01)

    lightFolder
        .add(light2.shadow.camera, 'left', -50, 50, 0.1)
        .onChange(() => light2.shadow.camera.updateProjectionMatrix()).name('侧光左边阴影')
    lightFolder
        .add(light2.shadow.camera, 'right', -50, 50, 0.1)
        .onChange(() => light2.shadow.camera.updateProjectionMatrix()).name('侧光右边阴影')
    lightFolder
        .add(light2.shadow.camera, 'top', -50, 50, 0.1)
        .onChange(() => light2.shadow.camera.updateProjectionMatrix()).name('侧光上边阴影')
    lightFolder
        .add(light2.shadow.camera, 'near', 0.0, 100)
        .onChange(() => light2.shadow.camera.updateProjectionMatrix()).name('侧光近处阴影')
    lightFolder
        .add(light2.shadow.camera, 'far', 0.0, 100)
        .onChange(() => light2.shadow.camera.updateProjectionMatrix()).name('侧光远处阴影')
    lightFolder
        .add(light2.shadow, 'bias', -0.2000, 0.2000).step(0.001)
        .onChange(() => light2.shadow.camera.updateProjectionMatrix()).name('侧光阴影偏移')

    lightFolder
        .add(light2.targetObject.position, 'x').min(-30).max(30).step(0.0001).name('侧光targetX')
    lightFolder
        .add(light2.targetObject.position, 'y').min(-30).max(30).step(0.0001).name('侧光targetY')
    lightFolder
        .add(light2.targetObject.position, 'z').min(-30).max(30).step(0.0001).name('侧光targetZ')
}
