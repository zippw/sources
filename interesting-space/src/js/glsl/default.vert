#ifdef GL_ES
precision mediump float;
#endif
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 planeTextureMatrix;
varying vec3 vVertexPosition;
varying vec2 vTextureMatrixCoord;
void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vVertexPosition = aVertexPosition;
    vTextureMatrixCoord = (planeTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
}a