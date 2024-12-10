
//glsl
import SmoothScrollbar from 'smooth-scrollbar';
import SoftScrollPlugin from 'vendor/softscroll';
import ScrollTriggerPlugin from 'vendor/scrolltrigger';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Chart, Filler, LineController, LinearScale, CategoryScale, PointElement, LineElement, TimeScale, LogarithmicScale, Tooltip } from "chart.js";

import DisplayImg from './DisplayImg';
import DisplayText from './DisplayText';
import { ev, textChanger, getVar, pathMorph, getOffset, getColor, mobileCheck, randomStr } from './utils';
// ui
import Sep from './vendor/sep';
import Planes from './vendor/planes';
import Notify from './vendor/notify';
import { Skills } from './vendor/skills';

import { DateTime } from "luxon";
import { easeInOutQuint } from 'easing-js';

export default class Landing {
    constructor() {
        // Preloader
        this.preloader = {
            el: document.querySelector('.preloader'),
            window: document.querySelector('.preloader .window'),
            progress: document.querySelector('.preloader .content h1 span')
        }
        this.img = document.querySelectorAll('img');
        this.c = 0;
        this.tot = this.img.length;

        this.bio = null; // animation for bio
        this.bioShown = false;
        // Paths
        this.paths = document.querySelectorAll('path.path-anim');
        // ScrollTriggers
        this.philosophy = {
            container: document.querySelector('.zw-philosophy-content p'),
            words: document.querySelectorAll('.zw-philosophy-content p u'),
            pinContainer: document.querySelector('.philosophy'),
            pin: document.querySelectorAll('.philosophy article')
        }
        this.scrollBio = {
            el: document.querySelector('#scrollBio'),
            svg: document.querySelector('#scrollBio .svg_layout svg:nth-child(1)'),
            svg1: document.querySelector('#scrollBio .svg_layout svg:nth-child(2)'),
            card: document.querySelector('#scrollBio .card'),
            content: document.querySelector('#scrollBio .content'),
            seps: document.querySelectorAll('#scrollBio .content .sep'),
            heading: document.querySelectorAll('.bio_portfolio .more h1.round'),
            headingSpan: document.querySelectorAll('.bio_portfolio .more h1.round span'),
        }
        this.skills = {
            el: document.querySelector('#skills'),
            cols: document.querySelectorAll('#skills .col.working')
        }
        this.resizedPageNotifyShown = false;

        this.bind();
    }

    start() {
        this.initTime();
        this.initContact();
        // Initial state
        textChanger(document.querySelector('.landing .left .text h3'), [
            "Designer",
            "Developer"
        ]);

        gsap.registerPlugin(ScrollTrigger);
        SmoothScrollbar.use(ScrollTriggerPlugin, SoftScrollPlugin);

        this.scrollbar = SmoothScrollbar.init(document.querySelector('.scroller'), {
            renderByPixels: false,
            damping: 0.075,
            syncCallbacks: true,
            plugins: {
                SoftScroll: {
                    x: false
                },
            }
        });

        if (!mobileCheck()) window.DisplayImg = new DisplayImg();

        let lastOffset = null;

        this.scrollbar.addListener(({ offset }) => {
            if (!lastOffset) {
                lastOffset = offset;
                return;
            }

            if (offset.y < lastOffset.y) {
                document.querySelector('nav').classList.remove('-h')
            } else if (offset.y > lastOffset.y) {
                document.querySelector('nav').classList.add('-h')
            } else return;

            lastOffset = offset;
        });

        document.querySelectorAll('[data-anchor]').forEach(el => {
            el.addEventListener('click', () => {
                const top = getOffset(document.querySelector(el.getAttribute('data-anchor'))).top + Number(el.getAttribute("data-anchor-offset"));
                document.querySelector('nav').setAttribute('style', "pointer-events:all;opacity:1;transform:none;");
                const nav = document.querySelector('nav'),
                    li = nav.querySelectorAll("ul li");

                for (var i = 0, max = li.length; i < max; i++) {
                    li[i].style.pointerEvents = "all";
                };

                this.scrollbar.scrollTo(0, top, 2000, {
                    easing: easeInOutQuint,
                    callback: () => {
                        document.querySelector('nav').classList.remove('-h');
                        document.querySelector('nav').setAttribute('style', "");
                        for (var i = 0, max = li.length; i < max; i++) {
                            li[i].style.pointerEvents = "";
                        }
                    }
                })
            })
        })

        this.initSkills();

        this.paths.forEach(el => pathMorph(el));
        this.initPhylosophy();
        this.scrollTriggers();
        this.initFaq();
        if (!mobileCheck()) this.initProduction();
        const cb = (txt) => {
            if (txt) {
                new Notify({
                    container: document.querySelector('.notifications'),
                    main: txt,
                    duration: 10
                });

                document.querySelector(".portfolio-wrapper").innerHTML = `<h1 class="error">Error loading data. Please, try again later.</h1>`

                ScrollTrigger.refresh();
            }
        };

        fetch(`https://functions.yandexcloud.net/d4euabqrvv5mk1lltv17`, {
            method: "GET"
        }).then(a => a.json()).then(res => {

            this.handleProjects(res.dr);
            this.handleContribution(res.gh);

            ScrollTrigger.refresh()

        }).catch(() => {
            cb("Error loading portfolio data.")
        })

        // window.DisplayText = new DisplayText({
        //     wireframes: false,
        //     container: document.getElementById('displayText'),
        //     placeholder: document.getElementById('displayTextPlaceholder'),
        //     scrtr: { enabled: true, el: document.querySelector("section.display") },
        //     colors: { 0: [11, 13, 15], 1: [11, 13, 15], 2: [18, 19, 22], 3: [18, 19, 22] }
        // });
        window.contactBg = new DisplayText({
            wireframes: true,
            container: document.getElementById('contactBg'),
            placeholder: document.querySelector('section.work .order'),
            scrtr: { enabled: false, el: document.querySelector("section.work .order") },
            colors: { 0: [18, 19, 22], 1: [18, 19, 22], 2: [74, 77, 83], 3: [74, 77, 83] }
        });
    }

    bind() {
        document.addEventListener('DOMContentLoaded', () => { this.loadbar() }, false);
        document.querySelectorAll('[data-dynamic-btn]').forEach(btn => {
            const root = document.querySelector('html');
            btn.addEventListener('mouseover', () => root.style.setProperty('--dynamic', getVar(btn.getAttribute('data-dynamic-btn'))));
            btn.addEventListener('mouseout', () => root.style.setProperty('--dynamic', null));
        });

        document.querySelector('#popout button.close').addEventListener('click', () => this.popOutDisplay('', false));

        if (!mobileCheck()) window.addEventListener('resize', () => { this.resized() })

        const cb = document.querySelectorAll('section.work .order-group-checkboxes .checkbox input[type="checkbox"]')
        for (let i = 0; i < cb.length; i++) {
            cb[i].addEventListener('change', function (e) {
                cb[i].parentElement.classList.toggle("-active", e.target.checked)
            })
        };

        const ra = document.querySelectorAll('section.work .order-group-checkboxes .checkbox input[type="radio"]')
        for (let i = 0; i < ra.length; i++) {
            ra[i].addEventListener('change', function (e) {
                ra.forEach(r => {
                    r.parentElement.classList.toggle("-active", r.checked)
                })
            })
        };

        const it = document.querySelectorAll('section.work .order-input input');
        for (let i = 0; i < it.length; i++) {
            it[i].addEventListener('focus', function (e) {
                it[i].parentElement.classList.add("-active")
            })
            it[i].addEventListener('focusout', function (e) {
                it[i].parentElement.classList.remove("-active")
            })
        }
    }

    initProduction() {
        const container = document.querySelector('section.production .grid'),
            span = container.querySelector('.bg');

        container.addEventListener("mouseenter", () => span.classList.add('show'));
        container.addEventListener("mouseleave", () => span.classList.remove('show'));
        // container.querySelectorAll(".grid-item:not(.empty)").forEach(el => el.addEventListener("mouseenter", () => span.src = `img/${el.getAttribute('data-hover-img')}.png`));
        container.addEventListener("mousemove", function (e) {
            const parentRect = container.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;

            // Check if mouse is inside parent element
            if (x >= parentRect.left &&
                x <= parentRect.right &&
                y >= parentRect.top &&
                y <= parentRect.bottom) {

                gsap.to(span, {
                    y: y - parentRect.top - span.offsetHeight / 2,
                    x: x - parentRect.left - span.offsetWidth / 2,
                    duration: .3,
                    overwrite: true,
                    ease: 'cubic.out'
                })
            }
        })
    }

    handleContribution(result) {
        const stats = document.querySelector('section.stats'),
            labelEl = stats.querySelector('h3'),
            valueEl = stats.querySelector('.details .count');

        valueEl.innerText = result.avg.weekly;
        let activeTooltipVal = valueEl.innerHTML;
        let activeTooltipLabel = labelEl.innerHTML;
        const tooltipLine = {
            id: "tooltipLine",
            afterDraw: chart => {
                if (chart.tooltip?._active && chart.tooltip?._active?.length) {
                    const ctx = chart.ctx;
                    ctx.save();
                    const activePoint = chart.tooltip._active[0];
                    const label = result.totalInWeeksLabels[chart.tooltip._active[0].index];
                    const value = result.totalInWeeks[chart.tooltip._active[0].index];
                    const color = "#" + getColor(getVar('--purple').slice(1), getVar('--orange_light').slice(1), activePoint.element.y * 1 / (chart.chartArea.bottom - chart.chartArea.top));
                    if (activeTooltipLabel != label) {
                        activeTooltipLabel = label;
                        var counter = 1;
                        var i = setInterval(function () {
                            labelEl.innerText = randomStr(counter);
                            counter++;
                            if (counter === label.length) {
                                labelEl.innerHTML = label;
                                clearInterval(i);
                            }
                        }, 1);
                    }

                    if (activeTooltipVal != value) {
                        valueEl.innerText = value;
                        valueEl.setAttribute('style', `--c: ${color}; --t: "${value - activeTooltipVal ? `${value - activeTooltipVal < 0 ? "" : "+"}${value - activeTooltipVal}` : ""}"`)
                        activeTooltipVal = value;
                        valueEl.classList.add('-c')
                        setTimeout(() => {
                            valueEl.classList.remove('-c')
                        }, 50);
                    }

                    ctx.beginPath();
                    ctx.setLineDash([5, 7]);
                    ctx.moveTo(activePoint.element.x, chart.chartArea.top);
                    ctx.lineTo(activePoint.element.x, activePoint.element.y);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = getVar('--muted');
                    ctx.stroke();
                    ctx.restore();
                    ctx.beginPath();

                    ctx.beginPath();
                    ctx.moveTo(activePoint.element.x, activePoint.element.y);
                    ctx.lineTo(activePoint.element.x, chart.chartArea.bottom);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = getVar('--muted');
                    ctx.stroke();
                    ctx.restore();

                    // inner
                    ctx.beginPath();
                    ctx.arc(activePoint.element.x, activePoint.element.y, 6, 0, 2 * Math.PI, false);
                    ctx.fillStyle = color;
                    ctx.fill();
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = getVar("--bg_light");
                    ctx.stroke();
                } else {
                    valueEl.innerHTML = Number(result.avg.weekly).toFixed(2).replace('.', '’');
                    labelEl.innerText = labelEl.getAttribute('data-text');
                    activeTooltipLabel = labelEl.innerHTML;
                    activeTooltipVal = valueEl.innerHTML;
                }
            }
        };
        Chart.register(Filler, LineController, LinearScale, CategoryScale, PointElement, LineElement, TimeScale, LogarithmicScale, Tooltip, tooltipLine);
        const contributionGraph = document.querySelector('#contribution');

        let width, height, gradient;
        function getGradient(ctx, chartArea) {
            const chartWidth = chartArea.right - chartArea.left;
            const chartHeight = chartArea.bottom - chartArea.top;
            if (!gradient || width !== chartWidth || height !== chartHeight) {
                width = chartWidth;
                height = chartHeight;
                gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, getVar('--purple'));
                gradient.addColorStop(1, getVar('--orange_light'));
            }

            return gradient;
        };

        const contributionChart = new Chart(contributionGraph, {
            data: {
                labels: result.totalInWeeksLabels,
                datasets: [{
                    type: 'line',
                    data: result.totalInWeeks,
                    borderColor: function (context) {
                        const chart = context.chart;
                        const { ctx, chartArea } = chart;

                        if (!chartArea) {
                            return;
                        }
                        return getGradient(ctx, chartArea);
                    },
                }]
            },
            options: {
                spanGaps: true,
                maintainAspectRatio: false,
                tension: 0,
                hover: {
                    mode: 'index',
                    intersect: false
                },
                elements: {
                    point: {
                        radius: 0,
                        hoverRadius: 0
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            display: false,
                        },
                        grid: {
                            display: false,
                        },
                        display: false,
                    },
                    y: {
                        beginAtZero: false,
                        suggestedMax: Math.max(...result.totalInWeeks) + 10,
                        suggestedMin: - 1,
                        ticks: {
                            display: false,
                        },
                        grid: {
                            display: false,
                        },
                        display: false,
                    },
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false,
                        intersect: false,
                        mode: 'index',
                        position: "nearest",
                        borderWidth: 0,
                        backgroundColor: getVar('--text'),
                        padding: 15,
                        cornerRadius: 0,
                        displayColors: false,
                        yAlign: "bottom",
                        titleColor: getVar('--bg'),
                        bodyColor: getVar('--muted'),
                        bodyFont: {
                            family: '"Satoshi", sans-serif',
                            weight: 600,
                        },
                        bodyAlign: "center",
                        titleAlign: "center",
                        titleFont: {
                            family: '"Satoshi", sans-serif',
                            size: 25,
                            weight: 400
                        },
                        usePointStyle: true,
                        callbacks: {
                            label: (item) => {
                                let [start, end] = item.label.split(' to ');
                                return `${new Date(start).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} to ${new Date(end).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`

                            },
                            title: (item) => item[0].formattedValue + ' ' + "contribs",
                        },
                    },
                    tooltipLine
                },
            }
        });
    }

    handleProjects(res) {
        const planeContainer = document.querySelector(".portfolio-wrapper"),
            draggableHidden = planeContainer.querySelector(".portfolio-drag__field"),
            draggableVisible = planeContainer.querySelector(".portfolio-drag__cards");
        // progressFill = progress.querySelector('.portfolio-progress-fill');
        const sliderNamesContainer = document.querySelector(".portfolio-drag__title-active"),
            sliderNames = sliderNamesContainer.querySelector(".titles"),
            sliderNamesLabel = document.querySelector('.portfolio-drag__title-inactive')
        let html = ``,
            name = ``;
        for (let i = 0; i < res.length; i++) {
            html += `<a class="card no-select" target="_blank" href="https://dribbble.com/shots/${res[i].url}"><div class="img_wr"><img src="https://cdn.dribbble.com/userupload/${res[i].img}"></div><div class="flex"><div class="text"><h1>${res[i].title || "No title"}</h1><p>${res[i].tags.map(x => x).join('・') || "No tags"}</p></div><div class="date">${DateTime.fromISO(res[i].published_at).setLocale('en-GB').toRelativeCalendar()}</div></div><div class="borders"><div class="corners"><span></span><span></span><span></span><span></span></div></div></a>`;
            name += `<div class="titles-item">${DateTime.fromISO(res[i].published_at).toFormat('MMM dd, yyyy')}</div>`;
        }

        draggableVisible.innerHTML = html;
        sliderNames.innerHTML = name;
        const names = sliderNamesContainer.querySelectorAll(".titles .titles-item");
        const planes = document.querySelectorAll('.portfolio-drag__cards .card');

        if (!mobileCheck()) {
            new Planes({
                planeContainer,
                draggableHidden,
                draggableVisible,
                // progress,
                // progressFill,
                planes,
                sliderNames,
                sliderNamesContainer,
                names, sliderNamesLabel
            });
        } else {
            draggableHidden.remove();
            sliderNamesContainer.remove();
            let heightsOfPlanes = [];
            planes.forEach(el => {
                heightsOfPlanes.push(el.getBoundingClientRect().height);
            })
            planeContainer.style.height = Math.max(...heightsOfPlanes) + 20 + "px";

            const sb = SmoothScrollbar.init(planeContainer, {
                renderByPixels: false,
                damping: 0.075,
                syncCallbacks: true,
                plugins: {
                    SoftScroll: {
                        x: true,
                        y: false
                    },
                    overscroll: {
                        effect: "bounce",
                        damping: 0.075,
                    }
                }
            });
        }

        gsap.timeline({
            scrollTrigger: {
                trigger: draggableVisible,
                // markers: true,
                start: "center 90%"
            }
        }).fromTo([planes[0], planes[1], planes[2], planes[3], planes[4], planes[5]], {
            opacity: 0,
            y: 50
        }, {
            opacity: 1,
            y: 0,
            ease: 'sine.out',
            stagger: {
                amount: .5
            }
        }).from(draggableVisible.querySelectorAll('img'), {
            scale: 1.2,
            ease: 'cubic.out',
            stagger: {
                amount: .5
            }
        }, '<')
    }

    popOutDisplay(content, open = true) {
        const container = document.getElementById('popout');

        if (open) {
            container.classList.add('shown');
            const scrollbar = SmoothScrollbar.init(container.querySelector('.main'), {
                renderByPixels: false,
                damping: 0.075,
                syncCallbacks: true,
                plugins: {
                    SoftScroll: {
                        x: false
                    },
                }
            });

            scrollbar.track.xAxis.element.remove();
            scrollbar.track.yAxis.element.remove();

            // const jelly = new JellyEffect({
            //     speed: 10,
            //     intensity: .002,
            //     min: 0,
            //     max: .1,
            //     scrollPos: () => scrollbar.offset.y
            // });

            scrollbar.addListener(({ offset, limit }) => {
                container.querySelector('.progress').style.width = `${offset.y * 100 / limit.y}%`;
            })
        } else {
            container.classList.add('closing');

            setTimeout(() => {
                container.classList.remove('closing')
                container.classList.remove('shown');
            }, 1000);

            if (SmoothScrollbar.getAll().find(a => a.containerEl == container.querySelector('.main'))) SmoothScrollbar.getAll().find(a => a.containerEl == container.querySelector('.main')).destroy();
        }
    }

    initPhylosophy() {
        this.philosophy.pin.forEach(pin => {
            const tl = ScrollTrigger.create({
                trigger: pin,
                pin,
                start: "center center",
                end: "+=100%",
                pinType: 'transform',
                pinSpacing: true,
                scrub: true,
                invalidateOnRefresh: true,
                anticipatePin: true,
                onEnter: () => { document.querySelector('nav').classList.add('-purple'); document.body.classList.add('-purple') },
                onEnterBack: () => { document.querySelector('nav').classList.remove('-purple'); document.body.classList.remove('-purple') },
                onLeave: () => { document.querySelector('nav').classList.add('-purple'); document.body.classList.add('-purple') },
                onLeaveBack: () => { document.querySelector('nav').classList.remove('-purple'); document.body.classList.remove('-purple') },
                animation: gsap.timeline().to(pin.querySelectorAll('p u'), {
                    ease: 'none',
                    opacity: 1,
                    stagger: .5
                }, '+=50%')
            })
            gsap.timeline({
                scrollTrigger: {
                    trigger: pin,
                    start: "top 70%",
                    end: "+=240%",
                    scrub: 1,
                    ease: "none"
                }
            }).to(pin, {
                borderRadius: 0,
                borderColor: "#00000000",
                scale: 1,
                ease: 'none',
            }).fromTo(document.querySelector('.zw-philosophy'), {
                scaleX: Number(((document.querySelector('.zw-philosophy').getBoundingClientRect().width - (window.matchMedia("(max-width: 1300px)").matches ? 40 : 160)) * 1 / document.querySelector('.zw-philosophy').getBoundingClientRect().width).toFixed(2)),
                // borderRadius: document.querySelector('.zw-philosophy').getBoundingClientRect().width * 10 / 100,
            }, {
                scaleX: 1,
                borderRadius: 0,
            }, '<').to(pin, {
                // scale: 1.2,
                opacity: 0,
                ease: 'cubic.inOut',
            }, '+=95%').to(document.querySelector('.zw-philosophy'), {
                scaleX: ((document.querySelector('.zw-philosophy').getBoundingClientRect().width - (window.matchMedia("(max-width: 1300px)").matches ? 40 : 160)) * 1 / document.querySelector('.zw-philosophy').getBoundingClientRect().width).toFixed(2),
                borderRadius: document.querySelector('.zw-philosophy').getBoundingClientRect().width * 10 / 100,
                ease: 'cubic.inOut'
            }, '<')

            gsap.timeline({
                scrollTrigger: {
                    trigger: pin,
                    start: "top 70%",
                    toggleActions: "play none play reverse"
                }
            }).to(pin.querySelector('video'), {
                ease: 'none',
                ease: 'back.out',
                scale: 1,
            }, '<').to(pin.querySelector('.zw-philosophy-content h1 .t'), {
                y: 0,
                rotate: 0,
                duration: 1,
                ease: 'expo.out',
            }, '<').from(pin.querySelector('.zw-philosophy-content span'), {
                width: 0
            }, '<').to(pin.querySelector('.zw-philosophy-content p'), {
                opacity: 1,
                y: 0
            }, '<')
            document.querySelector('section.work .bg').setAttribute('style', `border-radius: ${`${(document.querySelector('section.work').getBoundingClientRect().width * 10 / 100)}px `.repeat(2)}0 0`)

            gsap.timeline({
                scrollTrigger: {
                    trigger: document.querySelector('section.work .bg'),
                    start: "top center",
                    end: `+=${window.innerHeight / 2}`,
                    scrub: 1,
                    ease: "none"
                }
            }).to(pin, {
                borderRadius: 0,
                scale: 1,
                ease: 'none',
            }).fromTo(document.querySelector('section.work .bg'), {
                scaleX: Number(((document.querySelector('.zw-philosophy').getBoundingClientRect().width - (window.matchMedia("(max-width: 1300px)").matches ? 40 : 160)) * 1 / document.querySelector('.zw-philosophy').getBoundingClientRect().width).toFixed(2)),
                // borderRadius: document.querySelector('.zw-philosophy').getBoundingClientRect().width * 10 / 100,
            }, {
                scaleX: 1,
                borderRadius: 0,
            }, '<')
        })
    }

    initContact() {
        const form = document.getElementById('contactForm'),
            slider = form.querySelector('.slider'),
            slides = form.querySelectorAll('.slider .slide'),
            bullets = form.querySelectorAll('.slider_controls .bullet'),
            textareaWrapper = form.querySelector('.textarea_wrapper'),
            textarea = form.querySelector('textarea'),
            popoutPolicy = form.querySelector('#popOutPolicy')

        popoutPolicy.addEventListener('click', () => this.popOutDisplay())
        const returnSlide = function (input, slide, err) {
            const popout = slide.querySelector('.popout');
            popout.querySelector('.content').innerText = err;

            popout.classList.add('shown')

            gsap.timeline().to(slide, {
                x: 20,
                duration: .2,
                ease: 'sine.out'
            }).to(slide, {
                x: -20,
                duration: .2,
                ease: 'sine.in'
            }).to(slide, {
                x: 0,
                ease: 'elastic(1, .6)'
            })
        };

        const nextFormSlide = function (control, index) {
            let next = activeSlide + control;
            // Forbid to continue if the content on the current slide does not meet certain requirements
            if (activeSlide < next) {
                const required = slides[activeSlide].querySelectorAll("[data-required]");

                for (let i = 0; i < required.length; i++) {
                    const el = required[i].querySelector('input, textarea');
                    if (el.value == "") {
                        returnSlide(required[i], slides[activeSlide], required[i].getAttribute('data-required'));
                        return
                    }
                };
                const emailType = slides[activeSlide].querySelectorAll('[data-email]');
                for (let i = 0; i < emailType.length; i++) {
                    const el = emailType[i].querySelector('input, textarea');
                    const check = new RegExp(
                        '^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|' +
                        '(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])' +
                        '|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$').test(el.value);

                    if (!check) {
                        returnSlide(emailType[i], slides[activeSlide], emailType[i].getAttribute('data-email'));
                        return
                    }
                };
            };

            if (next < 0 || next >= slides.length) return;
            activeSlide = index != undefined ? index : next;
            gsap.timeline().to(slider, {
                opacity: 0,
                duration: .2
            }).to(slider, {
                x: `${((index != undefined ? index : activeSlide) * 100) * -1}%`,
                ease: 'expo.inOut',
            }, "<").to(slider, {
                opacity: 1,
                duration: .4
            }, "-=50%").fromTo(slides[activeSlide].querySelectorAll('.btn button[data-control]'), {
                opacity: 0,
                x: () => { return control * -1 * 20 }
            }, {
                opacity: 1,
                ease: 'back.out',
                x: 0,
                stagger: .1
            }, "-=50%");

            bullets.forEach((bullet, i) => {
                bullet.classList.toggle('-a', index != undefined ? index == i : activeSlide == i)
            })
        }

        let activeSlide = 0;
        slides.forEach((el, i) => {
            el.style.width = `${document.querySelector('.order').clientWidth - (window.matchMedia("(max-width: 1300px)").matches ? 40 : 160)}px`;
            el.querySelectorAll('.popout .btn button').forEach(btn => [
                btn.addEventListener('click', function (e) {
                    btn.parentElement.parentElement.classList.remove('shown');
                })
            ])
            el.querySelectorAll('.btn button[data-control]').forEach(btn => {
                let control = Number(btn.getAttribute('data-control'));

                btn.addEventListener('click', function () {
                    nextFormSlide(control)
                })
            })

            bullets[i].addEventListener('click', function () {
                if (i == activeSlide) return;
                nextFormSlide(i > activeSlide ? 1 : -1, i)
            })
        })

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            form.querySelector('#submitMessageForm').classList.add('-process')
            var formData = new FormData(e.target);
            let obj = Object.fromEntries(formData);

            obj["offers"] = formData.getAll("offers");
            fetch(`https://functions.yandexcloud.net/d4ebrhtgvqej11rsjf3k`, {
                method: "POST",
                body: JSON.stringify(obj)
            }).then(a => {
                setTimeout(() => {
                    form.querySelector('#submitMessageForm').classList.remove('-process');
                }, 1000);
                a.json().then(content => new Notify({
                    container: document.querySelector('.notifications'),
                    main: content.error ? content?.description || content.error : content.message,
                    duration: 10
                }))
            }).catch(() => {
                setTimeout(() => {
                    form.querySelector('#submitMessageForm').classList.remove('-process');
                }, 1000);
                new Notify({
                    container: document.querySelector('.notifications'),
                    main: "Error sending message",
                    duration: 2
                })
            });
        })

        const textAreaSS = SmoothScrollbar.init(textareaWrapper, {
            renderByPixels: false,
            damping: 0.075,
            syncCallbacks: true,
            plugins: {
                SoftScroll: {
                    x: false
                },
            }
        });

        textareaWrapper.setAttribute("style", `height:${textarea.scrollHeight * 2 + 20}px`);
        textarea.setAttribute("style", `height:${textarea.scrollHeight * 2 + 20}px;min-height:${textarea.scrollHeight * 2 + 20}px;`);

        // te.setAttribute("style", `min-height:${textarea.scrollHeight}px;height:${textarea.scrollHeight}px;overflow-y:hidden;`);
        textarea.addEventListener('input', function () {
            const sub = textareaWrapper.parentElement.parentElement.querySelector('p');

            this.style.height = 0;
            this.style.height = (this.scrollHeight) + "px";

            sub.innerText = `${this.value.length} / ${this.getAttribute('maxlength')}`
        }, false);

        textarea.addEventListener('focus', function (e) {
            textareaWrapper.parentElement.classList.add("-active")
        })
        textarea.addEventListener('focusout', function (e) {
            textareaWrapper.parentElement.classList.remove("-active")
        })
    }

    initFaq() {
        ScrollTrigger.create({
            start: 'top bottom',
            end: 'bottom top',
            trigger: document.querySelector('section.faq'),
            toggleClass: 'show'
        });

        const faqContainer = document.querySelector('section.faq .faq__container'),
            faqItems = faqContainer.querySelectorAll('.faq-grid .faq-item'),
            faqPagin = faqContainer.querySelector('.pagin .slider');
        let active = 0;
        document.querySelectorAll('section.faq .controls button').forEach(btn => {
            btn.addEventListener('click', () => {
                const direction = btn.classList.contains('prev') ? -1 : 1;
                const next = (active + direction) < 0 ? (faqItems.length - 1) :
                    (active + direction) > (faqItems.length - 1) ? 0 :
                        (active + direction);

                faqItems[active].classList.remove('active');
                faqItems[active].classList.add('no-select');
                active = next;

                faqPagin.style.transform = `translateY(-${faqPagin.parentElement.getBoundingClientRect().height * next}px)`
                faqItems[active].classList.add('active');
                faqItems[active].classList.remove('no-select');
            })
        })
    }

    resized() {
        if (this.resizedPageNotifyShown == true) return
        new Notify({
            container: document.querySelector('.notifications'),
            main: "Window has resized. Please, refresh this page!",
            duration: 60,
            click: () => {
                this.resizedPageNotifyShown = false;
                window.location.reload();
            },
            onEnd: () => {
                this.resizedPageNotifyShown = false;
            }
        });
        this.resizedPageNotifyShown = true;
    }

    initSkills() {
        new Skills(this.skills.el);
        this.skills.el.querySelectorAll('.sep').forEach(sep => new Sep(sep))
        this.skills.cols.forEach((col, i) => {
            let track = col.querySelector('.carousel .carousel-track'),
                width = 0;

            col.querySelectorAll('.carousel .carousel-track .slide').forEach(el => {
                width += el.offsetWidth;
                const clone = el.cloneNode(true);
                clone.classList.add('-c')
                track.append(clone)
            });

            const anim = gsap.to(track, {
                scrollTrigger: {
                    trigger: col,
                    start: "top bottom",
                    end: "bottom top",
                    toggleActions: "play pause resume pause"
                },
                duration: 10,
                ease: "none",
                x: -width,
                overwrite: true,
                repeat: -1,
            })
            // col.addEventListener('mouseover', function() {
            //     anim.pause();
            // })
            // col.addEventListener('mouseout', function() {
            //     anim.resume();
            // })

        })
    }

    loadbar() {
        this.start();

        if (this.tot == 0) return setTimeout(() => this.doneLoading(), 500);

        var counter = 0;
        var i = setInterval(() => {
            var tImg = new Image();
            tImg.onload = () => this.imgLoaded();
            tImg.onerror = () => this.imgLoaded();
            tImg.src = this.img[counter].src;
            counter++;
            if (counter === this.tot) {
                clearInterval(i);
            }
        }, 10);
    }

    imgLoaded() {
        this.c += 1;
        var perc = ((100 / this.tot * this.c) << 0);
        this.preloader.progress.innerText = perc
        if (this.c === this.tot) return setTimeout(() => this.doneLoading(), 500);
    }

    doneLoading() {
        this.preloader.el.classList.add('opened')
        setTimeout(() => {
            document.querySelector('nav').classList.remove('-h')
        }, 1000);
        ev('tile:zoom', { num: 0 });
        setTimeout(() => {
            this.preloader.el.remove();
        }, 2000);

        gsap.set(this.preloader.window, {
            height: this.preloader.window.getBoundingClientRect().width
        })
        gsap.timeline().to(this.preloader.window, {
            width: 0,
            duration: 1,
            ease: 'quint.inOut',
        }).to(this.preloader.window.querySelector('img'), {
            scale: 1.2,
            duration: 1,
            ease: 'quint.inOut',
        }, '<')
        const displayAnimation = gsap.timeline({ delay: 1 });
        const displayItems = document.querySelector('section.display')
        displayAnimation.from(displayItems.querySelector('.right .border .lines'), {
            scaleY: 0,
            ease: 'expo.inOut',
            duration: .5
        })
    }

    initTime() {
        const el = document.querySelector('#ruTime');
        const setTime = function () {
            const now = DateTime.now().setZone("Europe/Moscow")
            el.innerHTML = now.toFormat('HH:mm')
        }
        setTime();
        setInterval(() => {
            setTime();
        }, 1000);
    }

    scrollTriggers() {
        ScrollTrigger.create({
            scrub: true,
            top: "top top",
            bottom: "top bottom",
            trigger: this.scrollBio.el.parentElement,
            onUpdate: (self) => self.trigger.setAttribute('style', `background-image:url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%234A4D53' stroke-width='3' stroke-dasharray='6%2c 14' stroke-dashoffset='-${(self.progress * 360).toFixed(0)}' stroke-linecap='square'/%3e%3c/svg%3e")`)
        })

        this.bio = gsap.timeline({
            scrollTrigger: {
                trigger: this.scrollBio.el,
                start: "top center"
            },
            onComplete: () => {
                this.scrollBio.seps.forEach(sep => {
                    new Sep(sep)
                });
            },
        }).to(this.scrollBio.content, {
            ease: 'none',
            scale: 1,
            opacity: 1,
            duration: .5,
            ease: 'sine.out',
        }).to(this.scrollBio.content.querySelectorAll('.left h1 span, .left p'), {
            y: 0,
            x: 0,
            rotate: 0,
            opacity: 1,
            duration: 2,
            ease: 'expo.inOut',
            stagger: .1
        }, '-=1.5').fromTo(this.scrollBio.seps, {
            width: "0%"
        }, {
            width: "100%",
            duration: .5,
            ease: "cubic.inOut",
            stagger: .2,
        }, '-=1').to(this.scrollBio.content.querySelectorAll('.op-bio'), {
            opacity: 1,
            duration: 1,
            stagger: .1,
            ease: "sine.inOut",
        }, '-=1').to(this.scrollBio.card, {
            ease: 'none',
            rotate: -8,
            scale: 1,
            opacity: 1,
            ease: 'sine.out'
        }, 1);

        gsap.fromTo(this.scrollBio.svg, {
            bottom: -100
        }, {
            ease: 'none',
            rotate: 8,
            bottom: 100,
            scrollTrigger: {
                trigger: this.scrollBio.el,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        gsap.fromTo(this.scrollBio.svg1, {
            top: 300,
        }, {
            ease: 'none',
            rotate: -180,
            top: -200,
            scrollTrigger: {
                trigger: this.scrollBio.el,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        gsap.to(this.scrollBio.heading, {
            ease: 'none',
            rotate: -20,
            scrollTrigger: {
                trigger: this.scrollBio.el,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        gsap.to(this.scrollBio.headingSpan, {
            ease: 'none',
            rotate: 40,
            scrollTrigger: {
                trigger: this.scrollBio.el,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        })

        gsap.to(document.querySelector('section.display .start'), {
            scrollTrigger: {
                trigger: document.querySelector('section.display .start'),
                scrub: true,
                start: function () { return "top +=" + (document.querySelector('section.display .start').getBoundingClientRect().top - 20).toFixed(0) + "px" }
            },
            opacity: 0
        })

        gsap.timeline({
            scrollTrigger: {
                trigger: document.querySelector('section.display .start'),
                toggleActions: "play none reverse reverse",
                start: function () { return "top +=" + (document.querySelector('section.display .start').getBoundingClientRect().top - 20).toFixed(0) + "px" },
            },
        }).fromTo(document.querySelector('section.display .start .hint span:nth-child(2)'), {
            x: -document.querySelector('section.display .start .hint span:nth-child(1)').offsetWidth
        }, {
            x: 5,
            duration: .3,
            ease: "back.out"
        }).to(document.querySelectorAll('section.display .start .hint span:nth-child(1), section.display .start .hint span:nth-child(3)'), {
            y: 0,
            opacity: 1,
            duration: .2,
            stagger: {
                amount: .1,
                ease: "sine.out"
            },
            ease: "sine.out"
        });

        document.querySelectorAll('.st-fade-group').forEach(el => {
            const obj = JSON.parse(el.getAttribute('data-fade'));
            let params = Object.assign({
                scrollTrigger: {
                    start: 'top center',
                    trigger: el,
                    toggleActions: "play none play none"
                },
                stagger: {
                    each: .1
                },
                duration: el.querySelectorAll('.st-fade-child').length * .1
            }, obj[1]);
            gsap.fromTo(el.querySelectorAll('.st-fade-child'), obj[0], params)
        })
    }
}