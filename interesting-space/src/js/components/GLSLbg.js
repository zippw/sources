/* animation */
import { gsap } from 'gsap';

/* design */
import Particles from 'vendor/particles';
import { Curtains, Plane, Vec2, RenderTarget, ShaderPass } from 'curtainsjs';
import spfs from 'glsl/bgsp.frag';
import pfs from 'glsl/bg.frag';
import pvs from 'glsl/default.vert';

export default class GLSLBackground {
    constructor() {
        this.$els = {
            planeElements: document.querySelectorAll(".particles .particles-item.-img"),
        };

        this.curtains = new Curtains({ container: "canvas", production: false });

        this.planes = [];

        this.particlesImg = Array.from(document.querySelectorAll('.particles-item.-img img'));
        this.loaded = false;
        this.fadeInCompleted = false;

        this.curtains.onSuccess(() => {
            // this.bind()
            this.particles = new Particles({
                container: document.querySelector('.particles'),
                itemsSelector: ".particles-item",
            });
            this.createCanvas();
        });

        this.pixelSize = 20;
        this.u_time = 0;
        this.start = performance.now();
        this.lastVelocity = 0;
        this.amplitude = .05;
        this.lastMouse = 0;
        this.easing = 0.05;
        this.mouse = {
            currentPosX: 0,
            previousPosX: 0,
        };
    }

    bind() {
        if (this.particlesImg.length > 0) {
            // this.checkAllImagesLoaded();

            // window.addEventListener('resize', () => { this.checkAllImagesLoaded() });
        };
    }

    createCanvas() {
        const particleParams = {
            vertexShader: pvs,
            fragmentShader: pfs,
            widthSegments: 40,
            heightSegments: 40,
            transparent: true,
            watchScroll: false,
            texturesOptions: {
                minFilter: this.curtains.gl.LINEAR_MIPMAP_NEAREST
            },
            uniforms: {
                u_res: {
                    name: "u_res",
                    type: "2f",
                    value: new Vec2(
                        this.curtains.canvas.width,
                        this.curtains.canvas.height
                    )
                },
                PR: {
                    name: "uPR",
                    type: "1f",
                    value: Number(window.devicePixelRatio.toFixed(1))
                },
                u_progress: {
                    name: "u_progress",
                    type: "1f",
                    value: 0
                },
                u_time: {
                    name: "u_time",
                    type: "1f",
                    value: 0
                }
            }
        };

        this.planeTarget = new RenderTarget(this.curtains);

        for (let i = 0; i < this.$els.planeElements.length; i++) {
            const plane = new Plane(this.curtains, this.$els.planeElements[i], particleParams);

            plane.setRenderTarget(this.planeTarget);

            this.planes.push(plane)
        };

        this.distortionPass = new ShaderPass(this.curtains, {
            fragmentShader: spfs,
            renderTarget: this.planeTarget,
            transparent: true,
            uniforms: {
                u_res: {
                    name: "u_res",
                    type: "2f",
                    value: new Vec2(
                        this.curtains.canvas.width,
                        this.curtains.canvas.height
                    )
                },
                u_time: {
                    name: "u_time",
                    type: "1f",
                    value: this.u_time
                },
                u_pxSize: {
                    name: "u_pxSize",
                    type: "1f",
                    value: this.pixelSize
                },
                u_alpha: {
                    name: "u_alpha",
                    type: "1f",
                    value: 0
                },
                PR: {
                    name: "uPR",
                    type: "1f",
                    value: Number(window.devicePixelRatio.toFixed(1))
                }
            }
        });
        
        requestAnimationFrame(() => { this.onUpdate() });
    };

    onUpdate() {
        for (let i = 0, l = this.planes.length; i < l; i++) {
            this.planes[i].updatePosition();
            if (this.fadeInCompleted) this.planes[i].uniforms.u_progress.value = this.$els.planeElements[i].style.opacity
            this.planes[i].uniforms.u_time.value += .001;
        };
        this.distortionPass.uniforms.u_time.value += .01;

        requestAnimationFrame(() => { this.onUpdate() })
    }

    updatePxSize(val) {
        if (this.fadeInCompleted == true) {
            this.distortionPass.uniforms.u_pxSize.value = val
        }
    }

    show() {
        this.particlesImg.forEach((img, i) => {
            const delay = (1 / this.particlesImg.length + (i * (1 / this.particlesImg.length))).toFixed(2);
            gsap.fromTo(this.planes[i].uniforms.u_progress, {
                value: 0
            }, {
                overwrite: true,
                duration: 1,
                value: 1,
                delay,
                onComplete: () => {
                    if (i == this.particlesImg.length - 1) {
                        this.fadeInCompleted = true;
                    }
                }
            })
        });

        setTimeout(() => {
            for (let n = 1; n < this.pixelSize; n++) {
                setTimeout(() => {
                    this.distortionPass.uniforms.u_pxSize.value = this.pixelSize -= 1;
                }, n * 50);
            }
        }, 800);
    }
}