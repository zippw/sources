import { gsap } from "gsap";
import MouseFollower from "mouse-follower";
import { cursorCfgs } from "cfg"

export default class CursorManager {
    constructor() {
        this.cursors = [];
        MouseFollower.registerGSAP(gsap);
        this.init();
    }
    
    init() {
        cursorCfgs.forEach(cfg => {
            const cursor = new MouseFollower(cfg);
            this.cursors.push(cursor);
        });
        
        /* scroll progress indicator (big cursor) */
        this.scrollProgress(1);
        this.cursors[2].setIcon("cursor")
    }
    
    scrollProgress(cursorIndex) {
        this.cursors[cursorIndex].el.insertAdjacentHTML('beforeend', `<div class="cursor-progress"><svg class="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
        // <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"/>
        // </svg></div>`);
        this.path = document.querySelector('.cursor-progress path');
        this.pathLength = this.path.getTotalLength();
        
        this.path.style.transition = this.path.style.WebkitTransition = 'none';
        this.path.style.strokeDasharray = this.pathLength + ' ' + this.pathLength;
        this.path.style.strokeDashoffset = this.pathLength;
        this.path.style.transition = this.path.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
    }

    updateProgress(progress = 0) {
        this.path.style.strokeDashoffset = this.pathLength - (progress * (this.pathLength / 100));
    };
}