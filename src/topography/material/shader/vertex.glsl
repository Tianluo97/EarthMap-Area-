
varying float height;
varying vec2 vUv;
uniform vec3 bboxMin;
uniform vec3 bboxMax;

void main()
{
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    height = (position.y - bboxMin.y) / (bboxMax.y - bboxMin.y);

    gl_Position = projectedPosition;

    vUv = uv;
}