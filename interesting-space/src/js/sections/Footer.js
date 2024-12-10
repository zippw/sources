import { gsap } from "gsap";
import SmoothScrollbar from "smooth-scrollbar";

/* components */
import SphereBox from 'components/SphereBox';

export default class FooterSection {
    constructor(section, scroller) {
        this.$els = {
            section: section,
            cursor: section.querySelector("#gradient_cursor"),
            cursorElPath: section.querySelector("#gradient_cursor path"),
            blobs: [
                section.querySelector("#gradient_cursor path").getAttribute('d1'),
                section.querySelector("#gradient_cursor path").getAttribute('d2'),
                section.querySelector("#gradient_cursor path").getAttribute('d3'),
                section.querySelector("#gradient_cursor path").getAttribute('d4')
            ],
            lowerContent: section.querySelector('.lower-content')
        }

        this.scrollbar = SmoothScrollbar.get(scroller)

        this.init();
        this.bind()
    }

    init() {
        this.cursor();
        this.toysInit();
    }

    cursor() {
        /* blob morphing animation */
        gsap.timeline({ repeat: -1 })
            .to(this.$els.cursorElPath, {
                attr: { d: this.$els.blobs[1] },
                duration: 3,
                ease: 'none'
            })
            .to(this.$els.cursorElPath, {
                attr: { d: this.$els.blobs[2] },
                duration: 3,
                ease: 'none'
            })
            .to(this.$els.cursorElPath, {
                attr: { d: this.$els.blobs[3] },
                duration: 3,
                ease: 'none'
            })
            .to(this.$els.cursorElPath, {
                attr: { d: this.$els.blobs[0] },
                duration: 3,
                ease: 'none'
            })
    }

    toysInit() {
        try {
            const sphereBox = document.createElement('div');
            sphereBox.id = "sphere_box";
            this.$els.lowerContent.parentNode.insertBefore(sphereBox, this.$els.lowerContent);
            this.toys = new SphereBox(document.querySelector('#sphere_box'));

            document.addEventListener('mousewheel', () => {
                let limits = [0, this.scrollbar.limit.y],
                    offset = this.scrollbar.offset.y;
                if (limits[0] === offset ||
                    limits[1] === offset) return;

                this.toys.onScroll(offset);
            });
        } catch (err) {
            console.group()
            console.log('Error in SphereBox component');
            console.log(err)
            console.groupEnd()
        }
    }

    bind() {
        this.$els.section.addEventListener('mousemove', (e) => {
            gsap.to(this.$els.cursor, {
                left: e.clientX - this.$els.section.offsetLeft - this.$els.cursor.getBoundingClientRect().width / 2,
                top: e.clientY - this.$els.section.getBoundingClientRect().top - this.$els.cursor.getBoundingClientRect().height / 2,
                ease: 'expo.out',
                overwrite: true,
                duration: 2
            });
        });
    }
}