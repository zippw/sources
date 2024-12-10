/* animation */
import { gsap } from 'gsap';

/* design */
import { Curtains, Plane, Vec2 } from 'curtainsjs';
import pfs from 'glsl/bulge.frag';
import pvs from 'glsl/default.vert';

export default class GLSLart {
    constructor() {
        this.createCanvas();
    }

    createCanvas() {
        const curtains = new Curtains({
            container: "canvas_art",
            production: false
        });
        // get our plane element
        const planeElement = document.querySelector(".art_wrapper");

        // create our plane using our curtains object, the HTML element and the parameters
        const plane = new Plane(curtains, planeElement, {
            vertexShader: pvs,
            fragmentShader: pfs,
            widthSegments: 40,
            heightSegments: 40,
            transparent: false,
            watchScroll: false,
            uniforms: {
                time: {
                    name: "iTime",
                    type: "1f",
                    value: 0,
                },
                u_res: {
                    name: "iResolution",
                    type: "2f",
                    value: new Vec2(
                        curtains.canvas.width,
                        curtains.canvas.height
                    )
                },
                u_hover: {
                    name: "u_hover",
                    type: "1f",
                    value: 0
                },
                u_mouse: {
                    name: "iMouse",
                    type: "2f",
                    value: new Vec2(0.5, 0.5)
                }
            },
        });

        plane.onRender(() => {
            // plane.uniforms.time.value += 0.005;
            plane.uniforms.time.value += 0.01;
        });

        curtains.canvas.addEventListener('mouseover', (e) => {
            gsap.to(plane.uniforms.u_hover, {
                value: 1,
                duration: .5,
                ease: "expo.out"
            })
        });

        curtains.canvas.addEventListener('mousemove', (e) => gsap.to(plane.uniforms.u_mouse.value, {
            x: e.offsetX / curtains.canvas.width,
            y: 1 - e.offsetY / curtains.canvas.height,
            duration: 1,
            ease: "expo.out",
            overwrite: true
        }));

        curtains.canvas.addEventListener('mouseout', () => {
            gsap.to(plane.uniforms.u_mouse.value, {
                x: .5,
                y: .5,
                duration: 1,
                ease: "expo.out",
                overwrite: true
            });

            gsap.to(plane.uniforms.u_hover, {
                value: 0,
                duration: .5,
                ease: "expo.inOut"
            })
        })
    };
}