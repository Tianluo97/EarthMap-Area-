import * as dat from 'dat.gui';

const gui = new dat.GUI();

export function addGUI(light){
    const lightFolder = gui.addFolder('平行光');
    lightFolder.close();
    // 灯光的位置
    lightFolder.add(light.position, 'x', -200, 200).name('灯光x坐标').step(0.1)
    lightFolder.add(light.position, 'y', -200, 200).name('灯光y坐标').step(0.1)
    lightFolder.add(light.position, 'z', -200, 200).name('灯光z坐标').step(0.1)
}
