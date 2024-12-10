import * as THREE from 'three';
import fragmentShader from 'glsl/displayTextFrag.glsl';
import vertexShader from 'glsl/displayTextVrtx.glsl';
import noiseVrtx from 'glsl/displayTextNoiseVrtx.glsl';

export default class DisplayText {
    constructor(cfg) {
        this.container = cfg.container;
        this.placeholder = cfg.placeholder;
        this.wireframes = cfg.wireframes;
        this.colors = cfg.colors;
        this.scrtr = cfg.scrtr;

        this.width = Math.round(this.placeholder.getBoundingClientRect().width);
        this.height = Math.round(this.placeholder.getBoundingClientRect().height);
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.container,
            alpha: true
        });
        
        this.vCheck = false;
        this.t = 0;
        this.j = 0;
        this.x = this.randomInteger(0, 32);
        this.y = this.randomInteger(0, 32);
        
        this.initScene();
        this.animate();
        this.bind();
        
        this.renderer.setSize(this.width, this.height);

        // if (this.scrtr.enabled == true) {
        //     gsap.to([this.mesh.material.uniforms.u_color1.value, this.mesh.material.uniforms.u_color2.value], {
        //         x: this.colors[0][0],
        //         y: this.colors[0][1],
        //         z: this.colors[0][2],
        //         scrollTrigger: {
        //             target: this.scrtr.el,
        //             start: "top top",
        //             end: "bottom top",
        //             scrub: 2
        //         }
        //     })
        // }
    }

    randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    rgb(r, g, b) {
        return new THREE.Vector3(r, g, b);
    }

    bind() {
        window.addEventListener('resize', () => {
            this.width = Math.round(this.placeholder.getBoundingClientRect().width);
            this.height = Math.round(this.placeholder.getBoundingClientRect().height);
            this.renderer.setSize(this.width, this.height);
        })
    }

    animate() {
        requestAnimationFrame(() => { this.animate() });
        this.renderer.render(this.scene, this.camera);
        this.mesh.material.uniforms.u_randomisePosition.value = new THREE.Vector2(this.j, this.j);

        this.mesh.material.uniforms.u_time.value = this.t;
        if (this.t % 0.1 == 0) {
            if (this.vCheck == false) {
                this.x -= 1;
                if (this.x <= 0) {
                    this.vCheck = true;
                }
            } else {
                this.x += 1;
                if (this.x >= 32) {
                    this.vCheck = false;
                }
            }
        }

        this.j = this.j + 0.01;
        this.t = this.t + 0.05;
    }

    initScene() {
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 5;
        this.shape();
    }

    shape() {
        var randomisePosition = new THREE.Vector2(1, 2);

        let geometry = new THREE.PlaneGeometry(this.width / 2, 400, 100, 100);
        let material = new THREE.ShaderMaterial({
            wireframe: this.wireframes,
            uniforms: {
                u_bg: { type: 'v3', value: this.rgb(...this.colors[0]) },
                u_bgMain: { type: 'v3', value: this.rgb(...this.colors[1]) },
                u_color1: { type: 'v3', value: this.rgb(...this.colors[2]) },
                u_color2: { type: 'v3', value: this.rgb(...this.colors[3]) },
                u_time: { type: 'f', value: 30 },
                u_randomisePosition: { type: 'v2', value: randomisePosition }
            },
            fragmentShader: noiseVrtx + fragmentShader,
            vertexShader: noiseVrtx + vertexShader,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(-200, 270, -280);
        this.mesh.scale.multiplyScalar(5);
        this.mesh.rotationX = -1.0;
        this.mesh.rotationY = 0.0;
        this.mesh.rotationZ = 0.1;
        this.scene.add(this.mesh);

        this.renderer.render(this.scene, this.camera);
    }


}