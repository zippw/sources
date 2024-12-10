#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D planeTexture;
varying vec2 vTextureMatrixCoord;

void main() {
    vec4 effect = texture2D(planeTexture, vTextureMatrixCoord);
    gl_FragColor = effect;
}