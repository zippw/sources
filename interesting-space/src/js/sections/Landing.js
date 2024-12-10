import { gsap } from 'gsap';
import Splitting from "splitting";
import SmoothScrollbar from "smooth-scrollbar";
import VanillaTilt from 'vanilla-tilt';

const wrapElements = (elems, wrapType, wrapClass) => {
    elems.forEach(word => {
        const wrapEl = document.createElement(wrapType);
        wrapEl.classList = wrapClass;
        const parent = word.parentNode;
        parent.insertBefore(wrapEl, word);
        wrapEl.appendChild(word);
    });
};

export default class Landing {
    constructor(scroller) {
        this.$els = {
            title: document.querySelector('.landing header h1 svg'),
            hero: document.querySelector('.landing header p'),
            hint: document.querySelector('.landing header .hint'),
            pin: document.querySelector('.landing'),
            pinEnd: document.querySelector('.padding'),
            art: document.querySelector('.art')
        };

        /* set relative age */
        this.changeAge();

        this.splittingOutput = new Splitting({ target: this.$els.hero });

        this.scrollbar = SmoothScrollbar.get(scroller)

        // this.padding = Number(window.getComputedStyle(this.$els.pinEnd).getPropertyValue('padding-bottom').replace('px', ''))
        this.init()
    }

    init() {
        /* mobile padding */
        // if (window.innerHeight >= (this.$els.pinEnd.offsetHeight) - 20) {
        //     let offset = window.innerHeight - (this.$els.pinEnd.offsetHeight - this.padding) + "px";
        //     console.warn(".padding height < viewport height. Additional offset: " + offset);
        //     this.$els.pinEnd.style.paddingBottom = offset
        // };


        /* wrap splitted elements */
        wrapElements(this.splittingOutput.map(output => output.words).flat(), 'span', 'word_wrap');
        this.artTiltInteraction()

        // const switchSlide = (direction, unlock = true) => {
        //     const indicator = document.querySelector('.slide__indicator');

        //     this.scrollbar.updatePluginOptions('filterEvent', {
        //         blacklist: !unlock ? [/wheel/, /touch/] : [],
        //     });

        //     if (direction !== 0) {
        //         this.scrollbar.addMomentum(0, end * direction);
        //         indicator.classList.toggle("switch", direction === 1);
        //     }

        //     indicator.classList.toggle("show", direction !== 0);
        // };

        // gsap.to(this.$els.pin, {
        //     scrollTrigger: {
        //         start: "0",
        //         end,
        //         toggleActions: "play none reverse none",
        //         scrub: true,
        //         onEnter: () => switchSlide(1, false),
        //         onEnterBack: () => switchSlide(-1, false),
        //         onLeave: () => switchSlide(0, true),
        //         onLeaveBack: () => switchSlide(0, true)
        //     },
        //     opacity: 0,
        //     scale: .5,
        //     y: end / 2
        // })

    }

    artTiltInteraction() {
        VanillaTilt.init(this.$els.art, {
            reverse: true,
            max: 5,
            transition: true,
            speed: 1500,
            gyroscope: false,
            // "full-page-listening": true
        });

        // this.$els.art
    }

    changeAge() {
        const lang = document.documentElement.getAttribute("lang");
        function convertToYearsString(number) {
            if (lang === "ru") {
                if (number === 1 || (number % 10 === 1 && number !== 11)) {
                    return number + " год";
                } else if (
                    (number >= 2 && number <= 4) ||
                    (number % 10 >= 2 && number % 10 <= 4 && (number < 10 || number > 20))
                ) {
                    return number + " года";
                } else {
                    return number + " лет";
                }
            } else {
                if (number === 1) {
                    return number + " year"
                } else {
                    return number + " years"
                }
            }
        };

        let years = Math.floor((new Date() - new Date('2006-12-05')) / (1000 * 60 * 60 * 24 * 365.25)),
            ageStr = convertToYearsString(years, lang);
        this.$els.hero.innerHTML = this.$els.hero.innerText.replace("<age>", ageStr);
    }

    start(animationCallback) {
        const tl = gsap.timeline();
        gsap.set(this.splittingOutput[0].words, { willChange: "transform" })
        tl.fromTo([document.querySelector('.landing header h1 svg'), ...this.splittingOutput[0].words], {
            willChange: 'transform',
            transformOrigin: '0% 50%',
            yPercent: 125,
            rotate: -3,
            opacity: 0,
        }, {
            duration: .6,
            ease: 'back.inOut',
            opacity: 1,
            yPercent: 0,
            rotate: 0,
            delay: 1,
            stagger: {
                each: 0.02,
                from: 'start'
            },
            onComplete: animationCallback
        }, '>-=0.6');
        gsap.set(this.splittingOutput[0].words, { willChange: "auto" });

        // let end = this.$els.pinEnd.getBoundingClientRect().top - this.$els.title.getBoundingClientRect().top - 20;
        // /* scrolltrigger pin animation */
        // gsap.to(this.$els.pin.querySelector('header'), {
        //     scrollTrigger: {
        //         trigger: this.$els.pin,
        //         start: "-=25",
        //         end: end,
        //         // endTrigger: this.$els.pinEnd,
        //         anticipatePin: true,
        //         pinSpacing: false,
        //         pin: this.$els.pin.querySelector('header'),
        //         scrub: true,
        //         // toggleActions: "play none reverse none",
        //         pinType: "transform"
        //     },
        //     opacity: 0,
        //     scale: .7,
        //     yPercent: -20
        //     // ease: 'cubic.inOut',
        // });

        this.$els.pinEnd.querySelectorAll('[data-section-show]').forEach(el => {
            gsap.to(el, {
                opacity: 1,
                y: 0,
                scrollTrigger: {
                    trigger: el,
                    start: "top bottom",
                    end: "+=200",
                    scrub: 1
                }
            })
        })
    }
}