/* smooth scroll */
import SmoothScrollbar from 'smooth-scrollbar';
import SoftScrollPlugin from 'vendor/SoftScrollPlugin';
import ScrollTriggerPlugin from 'vendor/ScrollTriggerPlugin';
import DisableScrollPlugin from 'vendor/DisableScrollPlugin.js';
import FilterEventPlugin from './vendor/FilterEventPlugin';

/* animations */
import { gsap } from 'gsap';

/* ux */
import Wavy from 'vendor/wavy';

/* components */
import Search from 'components/Search.js';
import GLSLBackground from './components/GLSLbg';
import GLSLArt from './components/GLSLart';
import Console from './components/Console';
import CursorManager from './components/CursorManager';

/* sections */
import Landing from 'sections/Landing';
import ActiveSection from 'sections/Active';
import FooterSection from 'sections/Footer';
import QuotesSection from 'sections/Quotes';
// import HistorySection from 'sections/History.js';

/* utility */
import { mobileCheck } from "utils";
import { scrollCfg } from "cfg";

export default class App {
    constructor() {
        this.scroller = document.querySelector('.scroller__wrapper');
        this.lazyloads = document.querySelectorAll('[data-lazyload]');
        // this.navbar = document.querySelector('.nav');
        this.mobile = mobileCheck();

        this.optimize = localStorage.getItem('optimize');

        this.bind();
    }

    preload() {
        document.body.setAttribute('optimize', (this.mobile || this.optimize === "true").toString());

        /* smooth scroll init */
        SmoothScrollbar.use(ScrollTriggerPlugin, SoftScrollPlugin, DisableScrollPlugin, FilterEventPlugin);
        this.scrollbar = SmoothScrollbar.init(this.scroller, scrollCfg);
        this.scrollbar.track.xAxis.element.remove();

        if (!this.mobile && this.optimize !== "true") {
            /* background particles => glsl planes */
            this.GLSLBG = new GLSLBackground();
            this.GLSLART = new GLSLArt();

            document.querySelectorAll('[data-glsl-interaction]').forEach(el => {
                let val = {
                    oldValue: 1,
                    value: 1
                };

                el.addEventListener("mouseenter", () => {
                    gsap.to(val, {
                        value: 20,
                        ease: 'expo.out',
                        overwrite: true,
                        duration: 2,
                        onUpdate: () => {
                            let v = Math.round(val.value);
                            this.GLSLBG.updatePxSize(v)
                        }
                    })
                });

                el.addEventListener("mouseout", () => {
                    gsap.to(val, {
                        value: 1,
                        ease: 'expo.out',
                        overwrite: true,
                        duration: .55,
                        onUpdate: () => {
                            let v = Math.round(val.value);
                            this.GLSLBG.updatePxSize(v)
                        }
                    })
                });
            })
        }

        this.Landing = new Landing(this.scroller);

        /* search init ("Other Portfolio Projects" section) */
        this.search = new Search(
            document.getElementById('search'), // el
            document.querySelector('.list'),   // suggestionList
            '.item'                            // suggestionListItemsQuery
        );
    }

    start() {
        /* check if user doesn't guess to scroll */
        let scrolled = false;

        const idleListener = this.scrollbar.addListener(status => {
            if (status.offset.y !== 0) scrolled = true;
        });

        setTimeout(() => {
            if (scrolled == false) {
                document.querySelector('.landing header .hint').classList.add('show');
                this.scrollbar.removeListener(idleListener)
            } else {
                this.scrollbar.removeListener(idleListener)
            }
        }, 5000);

        if (!this.mobile && this.optimize !== "true") {
            /* cursor init */
            this.CursorManager = new CursorManager();

            // update cursor scroll progress indicator
            this.scrollbar.addListener((status) =>
                this.CursorManager.updateProgress(
                    status.offset.y * 100 / status.limit.y
                )
            );

            /* section preload */
            this.ActiveSection = new ActiveSection(document.querySelector('.section.active'));
            this.FooterSection = new FooterSection(
                document.querySelector('.section.footer'),
                this.scroller
            );
        };

        this.QuotesSection = new QuotesSection(document.querySelector('.section.quotes'));
    }

    bind() {
        /* DOCUMENT LOADED */
        document.addEventListener('DOMContentLoaded', () => {
            /* init preloader system */
            this.Preloader = new Console({
                onAppLoad: () => {
                    /* show landing animation */
                    this.Landing.start(() => {
                        /* show GLSL background after landing animation */
                        if (!this.mobile && this.optimize !== "true") this.GLSLBG.show()
                    });

                    setTimeout(() => {
                        /* start light functions after preloader removes */
                        this.start();
                    }, 1000);
                }
            }, !this.mobile && this.optimize !== "true");

            /* init heavy functions off-screen */
            this.preload();
        });

        /* wavy btn init */
        document.querySelectorAll('[data-wavy]').forEach(btn => new Wavy(btn));

        /* copy btn init */
        document.querySelectorAll('[data-copy]').forEach(el => {
            el.addEventListener('click', async function () {
                try {
                    await navigator.clipboard.writeText(el.getAttribute('data-copy'));
                } catch (err) {
                    console.error('Failed to copy: ', err);
                }
            })
        });

        /* success btn init */
        document.querySelectorAll('[data-successful]').forEach(el => {
            el.addEventListener('click', function () {
                if (!el.classList.contains('animate')) {
                    el.classList.add('animate');
                    let
                        span = el.querySelector('span'),
                        text = el.innerText,
                        successText = el.getAttribute('data-success-text'),
                        fade = gsap.timeline();
                    fade.to(span, {
                        opacity: 0,
                        duration: .2,
                        onComplete: () => {
                            span.innerHTML = `<svg viewbox="0 0 12 10"><polyline points="1.5 6 4.5 9 10.5 1" /></svg>` + successText;
                            gsap.to(span.querySelector('svg'), {
                                strokeDashoffset: 0,
                                duration: .2,
                                ease: 'quart.inOut'
                            })
                        }
                    }).to(span, {
                        opacity: 1,
                        duration: .2
                    }).to(span, {
                        opacity: 0,
                        duration: .4,
                        delay: 2,
                        onComplete: () => span.innerHTML = text
                    }).to(span, {
                        opacity: 1,
                        duration: .4,
                        onComplete: () => el.classList.remove('animate')
                    });

                    fade.play();
                }
            })
        })
    }
}