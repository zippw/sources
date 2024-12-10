#ifdef GL_ES
precision mediump float;
#endif
#pragma glslify:snoise3=require('glsl-noise/simplex/3d');
varying vec2 vTextureCoord;
uniform float u_time;
uniform float u_PR;
uniform vec2 u_res;
uniform float u_pxSize;
uniform sampler2D uRenderTexture;

void main(){
    vec2 uv=floor(vTextureCoord*u_res/u_pxSize)/u_res*u_pxSize;
    
    // Wavy noise texture
    float offx=uv.x+sin(uv.y+u_time*.1);
    float offy=uv.y-u_time*.1-cos(u_time*.001)*.01;
    float n=snoise3(vec3(offx,offy,u_time*.005)*2.)*0.005;
    vec4 finalImage=texture2D(uRenderTexture,uv);
    vec4 wavy=texture2D(uRenderTexture,vec2(uv.x+n,uv.y+n));
    
    // Final mix
    vec4 mixed=mix(finalImage,wavy,1.);
    gl_FragColor=vec4(mixed.rgb,mixed.a);
}