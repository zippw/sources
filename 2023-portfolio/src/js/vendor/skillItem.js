import { gsap } from 'gsap';
import { closestEdge } from './skillUtils';

export class SkillsItem {
    constructor(el) {
        this.DOM = { el: el };
        this.DOM.link = this.DOM.el;
        this.DOM.marquee = this.DOM.el.querySelector('.bg');
        this.animationDefaults = { duration: 0.6, ease: 'expo' };
        this.initEvents();
    }
    initEvents() {
        this.onMouseEnterFn = ev => this.mouseEnter(ev);
        this.DOM.link.addEventListener('mouseenter', this.onMouseEnterFn);
        this.onMouseLeaveFn = ev => this.mouseLeave(ev);
        this.DOM.link.addEventListener('mouseleave', this.onMouseLeaveFn);
    }
    mouseEnter(ev) {
        const edge = this.findClosestEdge(ev);

        gsap.timeline({ defaults: this.animationDefaults })
            .set(this.DOM.marquee, { x: edge === 'left' ? '-101%' : '101%' }, 0)
            .to([this.DOM.marquee], { x: '0%' }, 0);
    }
    mouseLeave(ev) {
        const edge = this.findClosestEdge(ev);

        gsap.timeline({ defaults: this.animationDefaults })
            .to(this.DOM.marquee, { x: edge === 'left' ? '-101%' : '101%' }, 0)
    }
    findClosestEdge(ev) {
        const x = ev.pageX - this.DOM.el.offsetLeft;
        const y = ev.pageY - this.DOM.el.offsetTop;
        return closestEdge(x, y, this.DOM.el.clientWidth, this.DOM.el.clientHeight);
    }
}