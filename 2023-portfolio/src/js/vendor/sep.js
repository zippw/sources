import gsap from "gsap";
import { mobileCheck } from "../utils";

export default class Sep {
    constructor(separator) {
        this.sep = separator;
        this.svg = separator;
        this.num = 0;

        this.init();
        if(!mobileCheck()) {
            this.bind();
        }
    }

    init() {
        this.sep.innerHTML = "<svg><path d='" + this.pathMaker() + "'/></svg>"
    }

    pathMaker(t = this.sep.offsetWidth / 2, e = 100, n = this.sep.offsetWidth) {
        return "M0,100 Q" + t + "," + e + " " + n + ",100";
    }

    mouseMove(event) {
        var i = this.sep.querySelector('svg').getBoundingClientRect(),
            r = event.pageX - i.left,
            o = event.pageY - i.top;

        if (this.num == 0) this.num = o < 100 ? 50 : -50;
        var a = 2 * o - 100 + this.num;

        gsap.to(this.sep.querySelector('path'), {
            attr: {
                d: this.pathMaker(r, a)
            },
            duration: .2,
            overwrite: true
        })
    }

    mouseLeave() {
        this.num = 0;

        gsap.to(this.sep.querySelector('path'), {
            attr: {
                d: this.pathMaker()
            },
            duration: 2,
            ease: "elastic.out(1, 0.2)"
        })
    }
    bind() {
        this.sep.addEventListener("mousemove", (event) => this.mouseMove(event));
        this.sep.addEventListener("mouseleave", () => this.mouseLeave());
    }
}