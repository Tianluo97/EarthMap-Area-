uniform vec3 uColor;
varying vec2 vUv;
varying float height;

void main()
{
    vec3 gradientColor = ( height) * vec3(0.3765, 0.5333, 1.0);
    gl_FragColor = vec4(gradientColor, 1.0);
}