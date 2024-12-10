#ifdef GL_ES
precision mediump float;
#endif

#pragma glslify:snoise2=require('glsl-noise/simplex/2d');

varying vec3 vVertexPosition;
varying vec2 vTextureMatrixCoord;
float u_time=1.;
uniform float u_PR;
uniform vec2 u_res;
uniform float u_progress;
uniform sampler2D planeTexture;

float circle(in vec2 _st,in float _radius,in float blurriness){
    vec2 dist=_st-vec2(.5);
    return 1.-smoothstep(_radius-(_radius*blurriness),_radius+(_radius*blurriness),dot(dist,dist)*4.);
}

void main(){
    vec2 resolution=u_res*u_PR;
    vec2 uv=vTextureMatrixCoord;
    vec2 st=gl_FragCoord.xy/resolution.xy-vec2(.5);
    
    float grd=.1;
    float sqr=100.*((smoothstep(0.,grd,uv.x)-smoothstep(1.-grd,1.,uv.x))*(smoothstep(0.,grd,uv.y)-smoothstep(1.-grd,1.,uv.y)))-10.;
    float c=circle(st,1.,2.)*50.;
    float roundMask=smoothstep(.0,.1,sqr-c);
    
    vec4 color=texture2D(planeTexture,vTextureMatrixCoord);
    gl_FragColor=vec4(color.rgb,roundMask*u_progress);
}