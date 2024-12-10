import { gsap } from "gsap";

export default class ActiveSection {
    constructor(section) {
        this.$els = {
            section: section,
            cursor: section.querySelector('.active_sec_cursor'),
            svgFilter: document.getElementById('svg-distortion-filter'),
            svgFilterTurb: document.querySelector('#svg-distortion-filter feTurbulence'),
            svgFilterDispMap: document.querySelector('#svg-distortion-filter feDisplacementMap'),
            distortionWrapper: section.querySelector('.distortion__wrapper'),
            distortionItem: section.querySelectorAll('.distortion__wrapper .distortion__item')
        }

        this.size = Math.max(
            this.$els.section.offsetWidth,
            this.$els.section.offsetHeight
        );

        this.lastActiveDistortionItem = 0;

        this.init();
        this.bind()
    }

    bind() {
        this.$els.section.addEventListener('mouseenter', (e) => {
            this.setActiveItem(1);

            gsap.to(this.$els.cursor, {
                x: e.offsetX,
                y: e.offsetY,
                ease: 'expo.out',
                overwrite: true,
                duration: 0.55
            })


        });

        this.$els.section.addEventListener('mouseout', (e) => {
            if (e.target == this.$els.section) this.setActiveItem(0);

            gsap.to(this.$els.cursor, {
                x: e.offsetX,
                y: e.offsetY,
                ease: 'expo.out',
                overwrite: true,
                duration: 0.55
            })
        });
    }

    init() {
        this.cursor();
    }

    cursor() {
        this.$els.cursor.className = "active_sec_cursor -hidden";
        this.$els.section.style.cssText = `--s:${this.size * 2.5}px`;
    }

    setActiveItem(index) {
        if (this.lastActiveDistortionItem === index) return true;

        this.$els.distortionItem.forEach((el, i) => {
            el.classList.toggle('-active', index === i);
        });

        this.displace();

        this.lastActiveDistortionItem = index;
    }

    displace() {
        const tl = gsap.timeline();

        // Kill all previous tweens of displacement map
        gsap.killTweensOf(this.$els.svgFilterDispMap);

        // Set random seed of turbulence
        tl.set(this.$els.svgFilterTurb, {
            attr: { seed: gsap.utils.random(2, 150) },
        }, 0);

        // Scale displacement map to random value
        tl.to(this.$els.svgFilterDispMap, {
            attr: { scale: gsap.utils.random(80, 120) },
            duration: 0.2,
        }, 0);

        // Scale back displacement map to initial value
        tl.to(this.$els.svgFilterDispMap, {
            attr: { scale: 1 },
            duration: 1.2,
            ease: "expo.out"
        }, 0.2);
    }
}