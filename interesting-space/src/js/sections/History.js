import gsap from "gsap";

export default class HistorySection {
    constructor() {
        this.$els = {
            sec: document.querySelector('.section.history'),
            cards: document.querySelectorAll('.section.history .card'),
            progress: document.querySelector('.section.history .progress__container .progress'),
            bullets: document.querySelectorAll('.section.history .progress__container .progress span'),
            fill: document.querySelector('.section.history .progress__container .progress > .fill')
        };

        this.params = {
            changeInterval: 5000
        };

        this.activeSlide = 0;
        this.fillAnimationIndex = 0;

        this.changeIntervalId = setInterval(() => {
            this.historyChangeSlide(this.activeSlide + 1 >= this.$els.cards.length ? 0 : this.activeSlide + 1)
        }, this.params.changeInterval);
        
        this.start();
    }
    
    start() {
        // first slide bullet progress animation
        this.historyChangeSlide(0);
        this.animateBulletFill(this.$els.bullets[0].querySelector('.fill'), true, true);

        this.$els.cards.forEach((card, i) => {
            this.$els.bullets[i].addEventListener('click', () => {
                clearInterval(this.changeIntervalId);
                this.historyChangeSlide(i);
                this.changeIntervalId = setInterval(() => {
                    this.historyChangeSlide(this.activeSlide + 1 >= this.$els.cards.length ? 0 : this.activeSlide + 1)
                }, this.params.changeInterval);
            })
        });
    }

    animateBulletFill(el, active, before) {
        if (active) {
            gsap.fromTo(el, {
                scaleY: 0
            }, {
                duration: this.params.changeInterval / 1000,
                scaleY: 1,
                ease: "none"
            })
        } else {
            gsap.set(el, { scaleY: before ? 1 : 0, overwrite: true })
        }
    };

    historyChangeSlide(index) {
        gsap.set(this.$els.fill, { height: this.$els.bullets[0].offsetHeight });
        if (this.fillAnimationIndex !== index) {
            this.fillAnimationIndex = index;
            gsap.to(this.$els.fill, {
                scale: 1.5,
                // opacity: 1,
                y: this.$els.bullets[index].offsetTop,
                ease: "quart.inOut"
            });
        }

        this.$els.cards.forEach((c, bIndex) => {
            this.animateBulletFill(this.$els.bullets[bIndex].querySelector('.fill'), bIndex === index, bIndex < index)
            c.classList.toggle('active', bIndex === index);
            this.$els.bullets[bIndex].classList.toggle('active', bIndex <= index);
        });

        this.activeSlide = index;
    };
}