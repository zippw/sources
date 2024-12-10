import { TypeShuffle } from "../vendor/TypeShuffle";
import gsap from "gsap";

export default class QuotesSection {
    constructor(container) {
        this.$els = {
            container,
            slides: container.querySelectorAll('.slide'),
            progress: container.querySelector('.progress .fill'),
            pagination: container.querySelector('.controls .pagination'),
            page: container.querySelector('.controls .page')
        };

        this.typeshuffles = [];

        this.params = {
            changeInterval: 10000
        };

        this.activeSlide = 0;
        this.changeIntervalId = null;
        this.resetProgress();
        this.start();
        this.bind()
    }

    start() {
        this.$els.slides.forEach(slide => {
            const ts = new TypeShuffle(slide);
            this.typeshuffles.push(ts)
        });
    }

    bind() {
        this.$els.pagination.querySelectorAll('button').forEach((btn, i) => {
            btn.addEventListener('click', () => {
                if (i === 0)
                    this.slideChange(this.activeSlide - 1 < 0 ? this.$els.slides.length - 1 : this.activeSlide - 1)
                else
                    this.slideChange(this.activeSlide + 1 >= this.$els.slides.length ? 0 : this.activeSlide + 1)
            })
        })
    }

    resetProgress() {
        if (this.changeIntervalId !== null) clearTimeout(this.changeIntervalId);

        this.changeIntervalId = setInterval(() => {
            this.slideChange(this.activeSlide + 1 >= this.$els.slides.length ? 0 : this.activeSlide + 1);
        }, this.params.changeInterval);

        gsap.fromTo(this.$els.progress, { width: "0%" }, { width: "100%", duration: this.params.changeInterval / 1000, ease: "none" })
    }

    slideChange(next) {
        this.resetProgress();

        this.$els.slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === next)
        });

        this.$els.page.innerText = `${next + 1} / ${this.$els.slides.length}`

        this.typeshuffles[next].trigger();

        this.activeSlide = next;
    }
}