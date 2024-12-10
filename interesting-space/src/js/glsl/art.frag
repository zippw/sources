#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
uniform float iTime;

uniform sampler2D planeTexture;
varying vec2 vTextureMatrixCoord;
uniform float u_hover;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    float pixel = 1.;

    vec3 positions[8];
    float Time = iTime;
    positions[0] = vec3(tan(Time * 1.4) * 1.3, cos(iTime * 2.3) * 0.4, 1.22);
    positions[1] = vec3(tan(Time * 3.0) * 1.0, cos(iTime * 1.3) * 0.6, 0.12);
    positions[2] = vec3(tan(Time * 2.1) * 1.5, cos(iTime * 1.9) * 0.8, 0.4);
    positions[3] = vec3(tan(Time * 1.1) * 1.1, cos(iTime * 2.6) * 0.7, 0.15);
    positions[4] = vec3(tan(Time * 1.8) * 1.1, cos(iTime * 2.1) * 0.5, 0.25);
    positions[5] = vec3(tan(Time * 1.1) * 1.2, cos(iTime * 1.3) * 0.2, 0.15);
    positions[6] = vec3(tan(Time * 1.7) * 1.4, cos(iTime * 2.4) * 0.3, 0.11);
    positions[7] = vec3(tan(Time * 2.8) * 1.5, cos(iTime * 1.1) * 0.4, 0.21);

    for(int i = 0; i < 8; i++) pixel += GetCircle(uv, positions[i].xy, positions[i].z);

    pixel = smoothstep(0.8, 1.0, pixel) * smoothstep(1.5, 0.9, pixel);

    fragColor = vec4(vec3(pixel) * vec3(1., 1., 1.), 1.0);
}

void main() {
    vec4 fragColor;
    mainImage(fragColor, gl_FragCoord.xy);
    vec4 effect = texture2D(planeTexture, mix(vTextureMatrixCoord, fragColor.xy, u_hover));
    gl_FragColor = effect;
    // gl_FragColor = fragColor;
}