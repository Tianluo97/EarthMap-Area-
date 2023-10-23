import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link );

function save( blob, filename ) {
    link.href = URL.createObjectURL( blob );
    link.download = filename;
    link.click();
}

function saveString( text, filename ) {
    save( new Blob( [ text ], { type: 'text/plain' } ), filename );
}

const exportToObj = (geo) => {
    const exporter = new OBJExporter();
    const result = exporter.parse( geo );
    saveString( result, 'object.obj' );
}

const exportGLTF = (input) => {

    const exporter = new GLTFExporter();

    const options = {
        trs: false,
        onlyVisible: true, 
        truncateDrawRange: true,
        binary: true,
        maxTextureSize: Infinity,
    };

    exporter.parse(
        input,
        function (result) { 
            console.log(result)
            const output = JSON.stringify( result, null, 2 );
            saveString( output, 'scene.gltf' );
        },
        options
    );
}

export {exportToObj, exportGLTF}