import { gsap } from 'gsap';

export default class Notify {
    constructor(options) {
        this.tl = gsap.timeline();

        this.container = options.container;
        this.main = options.main;
        this.additional = options.additional;
        this.duration = options.duration || 3;
        this.type = options.type || "default";
        this.click = function (e) {
            options.click ? options.click() : null;
            this.tl.pause();
            gsap.to(this.el, {
                opacity: 0,
                x: 10,
                duration: .2,
                onComplete: () => this.el.remove()
            })
        }
        this.onEnd = function () {
            this.el.remove();
            options.onEnd ? options.onEnd() : null;
        }

        this.el = document.createElement('div');
        this.animationDefaults = { duration: 0.6, ease: 'expo' };
        this.init();
    }
    init() {
        this.el.className = `no-select not ${this.type}`;
        this.el.innerHTML = `<div class="main">${this.main}</div><div class="duration"><div class="time"></div></div>`
        this.container.appendChild(this.el);

        this.tl.fromTo(this.el, {
            opacity: 0,
            y: 10
        }, {
            duration: .2,
            opacity: 1,
            y: 0,
            ease: 'sine.out'
        }).to(this.el.querySelector('.duration .time'), {
            width: '100%',
            ease: 'linear',
            duration: this.duration
        }).to(this.el, {
            opacity: 0,
            duration: .2,
            x: 10,
            onComplete: () => this?.onEnd()
        })
        this.el.addEventListener('mouseenter', (e) => this.tl.pause());
        this.el.addEventListener('mouseleave', (e) => this.tl.resume());
        this.el.addEventListener('click', () => { this.click() })
    }
}