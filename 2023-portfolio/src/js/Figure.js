import * as THREE from 'three'
import gsap from 'gsap';
import SmoothScrollbar from 'smooth-scrollbar';
import vertexShader from 'glsl/vertexShader.glsl'
import shape from 'glsl/shape.glsl';
import wave from 'glsl/wave.glsl';
import { getRatio, mobileCheck } from './utils'

export default class Figure {
    constructor(scene, cb, $el) {
        this.$image = document.querySelector('.landing .right img.main')
        this.scene = scene
        this.callback = cb;

        this.pic = document.querySelector('.landing .right .border');
        this.canvas = document.getElementById('stage')

        this.uniforms = {};
        this.loader = new THREE.TextureLoader()
        this.images = [];

        this.preload([this.$image.src, this.$image.dataset.hover], () => { this.start() });
        this.fragmentShader = wave;
        this.$image.style.opacity = 0
        this.sizes = new THREE.Vector2(0, 0)
        this.offset = new THREE.Vector2(0, 0)

        this.scroll = 0;
        this.clock = new THREE.Clock()

        this.mouse = new THREE.Vector2(0, 0);
        this.Scroll = SmoothScrollbar.get(document.querySelector('.scroller'));

        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('tile:zoom', ({ detail }) => { this.changeProgressClick(detail) });
        this.Scroll.addListener((s) => { this.onScroll(s) })
    }

    onResize() {
        localStorage.setItem('lastWindowResized', 1);
        localStorage.setItem('beforeResizeScrollOffsetY', this.Scroll.offset.y);
    }

    onScroll({ offset, limit }) {
        this.scroll = offset.y / limit.y;
    }

    move() {
        if (!this.mesh) return
        this.getBounds()
        gsap.set(this.mesh.position, {
            x: this.offset.x,
            y: this.offset.y,
        })
    }

    changeProgressClick({ num }) {
        const { right, bottom, left, top } = this.$image.getBoundingClientRect();

        this.isClicked = true;
        this.isHovering = true;
        if (!this.mesh) return;

        gsap.set(this.mouse, {
            x: right,
            y: bottom
        })

        const changing = gsap.timeline()
        changing.fromTo(this.uniforms.u_progressHover, {
            value: 0,
        }, {
            duration: 1,
            value: 1,
            ease: 'quint.out'
        }, '<').to(this.uniforms.u_progressClick, {
            duration: 2,
            value: num,
            ease: 'cubic.inOut'
        }, '<').to(this.uniforms.u_progressHover, {
            duration: 1,
            delay: .5,
            value: 0,
            ease: 'quart.inOut',
            onComplete: () => {
                this.material.fragmentShader = shape;
                this.material.needsUpdate = true;
                if(!mobileCheck()) this.pic.addEventListener('mousemove', (e) => { this.onMouseMove(e) });
                this.pic.addEventListener('mouseenter', () => { this.onPointerEnter() });
                this.pic.addEventListener('mouseleave', (e) => { this.onPointerLeave(e) });
            }
        }, '-=.5');
    }

    onPointerEnter() {
        this.isHovering = true;

        if (!this.mesh) return;
        gsap.to(this.uniforms.u_progressHover, {
            duration: 1,
            value: 1,
            ease: 'quart.inOut',
        })
    }

    update() {
        this.delta = Math.abs((this.scroll - this.prevScroll) * 2000)

        if (!this.mesh) return

        this.move()

        this.prevScroll = this.scroll

        if (!this.isHovering) return
        this.uniforms.u_time.value += this.clock.getDelta()
    }

    start() {
        this.getBounds()

        this.createMesh()

        this.callback()
    }

    createMesh() {
        this.uniforms = {
            u_alpha: { value: 1 },
            u_map: { type: 't', value: this.images[0] },
            u_ratio: { value: getRatio(this.sizes, this.images[0].image) },
            u_hovermap: { type: 't', value: this.images[1] },
            u_hoverratio: { value: getRatio(this.sizes, this.images[1].image) },
            u_shape: { value: this.images[2] },
            u_mouse: { value: this.mouse },
            u_progressHover: { value: 0 },
            u_progressClick: { value: 1 },
            u_time: { value: this.clock.getElapsedTime() },
            u_res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        }

        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: this.fragmentShader,
            transparent: true,
            defines: {
                PI: Math.PI,
                PR: window.devicePixelRatio.toFixed(1)
            }
        })

        this.mesh = new THREE.Mesh(this.geometry, this.material)

        this.mesh.position.set(this.offset.x, this.offset.y, 0)
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)

        this.scene.add(this.mesh)
    }

    onMouseMove(event) {
        gsap.to(this.mouse, {
            duration: 1,
            x: event.clientX,
            y: event.clientY
        })
    }

    onPointerLeave(event, el) {
        if (!this.mesh) return

        this.isHovering = false
        gsap.to(this.uniforms.u_progressHover, {
            duration: 1,
            value: 0,
            ease: 'cubic.inOut'
        })
    }

    getBounds() {
        const { width, height, left, top } = this.$image.getBoundingClientRect()

        if (!this.sizes.equals(new THREE.Vector2(width, height))) {
            this.sizes.set(width, height)
        }
        if (!this.offset.equals(new THREE.Vector2(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2))) {
            this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2)
        }
        this.canvas.style.transform = `translateY(${this.Scroll.offset.y + (window.innerHeight - this.canvas.offsetHeight)}px)`
    }

    preload($els, allImagesLoadedCallback) {
        let loadedCounter = 0
        const toBeLoadedNumber = $els.length
        const preloadImage = ($el, anImageLoadedCallback) => {
            const image = this.loader.load($el, anImageLoadedCallback)
            image.center.set(0.5, 0.5)
            this.images.push(image)
        }

        $els.forEach(($el) => {
            preloadImage($el, () => {
                loadedCounter += 1
                if (loadedCounter === toBeLoadedNumber) {
                    allImagesLoadedCallback()
                }
            })
        })
    }
}