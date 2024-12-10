import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Swiper, { Parallax, Pagination, EffectCreative, Controller, Manipulation, Keyboard } from 'swiper';
import * as THREE from 'three';
import App from "./App";
import hotkeys from 'hotkeys-js';

const app = new App;

const anchorSection = function (ctx) {
    ctx.classList.add('here');
    document.querySelectorAll(`nav.sections ul li:not(#${ctx.id})`).forEach(el => el.classList.remove('here'))
}
// window.anchorSection = anchorSection;
const scrollToSection = function (ctx) {
    scroll.scrollTo(document.getElementById(`section_${ctx.getAttribute('data-section')}`), { easing: [0.85, 0, 0.15, 1] })
}
window.scrollToSection = scrollToSection;
const scrollDown = function () {
    scroll.scrollTo('bottom', { easing: [0.22, 1, 0.36, 1] })
}
window.scrollDown = scrollDown;

/* ------------------------------
            bg changer
------------------------------ */
gsap.registerPlugin(ScrollTrigger);
const pageContainer = document.querySelector('[data-scroll-container]');
scroll.on('scroll', ({ limit, scroll }) => {
    const progress = scroll.y / limit.y * 100;
    document.querySelector('nav.sections').classList.add('shown')
    document.querySelector('nav.sections .bar__container span.track').style.height = `calc(${progress}% - 2px)`;
    setTimeout(() => {
        document.querySelector('nav.sections').classList.remove('shown')
    }, 300);
    ScrollTrigger.update
})
ScrollTrigger.scrollerProxy(pageContainer, {
    scrollTop(value) {
        return arguments.length
            ? scroll.scrollTo(value, 0, 0)
            : scroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
        return {
            left: 0,
            top: 0,
            width: window.innerWidth,
            height: window.innerHeight
        };
    },
    pinType: pageContainer.style.transform ? "transform" : "fixed"
});

const scrollColorElems = document.querySelectorAll("section");
scrollColorElems.forEach((colorSection, i) => {
    const prevBg = i === 0 ? "" : getComputedStyle(document.documentElement).getPropertyValue(scrollColorElems[i - 1].dataset.bgcolor);
    const prevText = i === 0 ? "" : getComputedStyle(document.documentElement).getPropertyValue(scrollColorElems[i - 1].dataset.textcolor);
    ScrollTrigger.create({
        trigger: colorSection,
        scroller: "[data-scroll-container]",
        start: "top 50%",
        onEnter: () => {
            anchorSection(document.querySelector(`#anch_${colorSection.id.replace('section_', '')}`))
            document.body.style.backgroundColor = colorSection.dataset.bgcolor;
            document.body.style.color = colorSection.dataset.textcolor;
        },
        onLeaveBack: () => {
            anchorSection(document.querySelector(`#anch_${scrollColorElems[i - 1].id.replace('section_', '')}`))
            document.body.style.backgroundColor = i === 0 ? "" : getComputedStyle(document.documentElement).getPropertyValue(scrollColorElems[i - 1].dataset.bgcolor)
            document.body.style.color = i === 0 ? "" : getComputedStyle(document.documentElement).getPropertyValue(scrollColorElems[i - 1].dataset.textcolor)
        }
    });
});

const lightSwiperPgn = new Swiper(document.querySelector('.left_pgn'), {
    modules: [Manipulation],
    direction: 'vertical',
    spaceBetween: 0,
    slidesPerView: '1',
    allowTouchMove: false,
    virtual: {
        enabled: true
    }
})

const lightSwiper = new Swiper(document.querySelector('.light_swiper'), {
    modules: [Parallax, Pagination, EffectCreative, Controller, Keyboard],
    slidesPerView: 'auto',
    touchStartPreventDefault: false,
    spaceBetween: 30,
    keyboard: {
        enabled: true,
        onlyInViewport: true,
    },
    controller: {
        control: lightSwiperPgn
    },
    centeredSlides: true,
    parallax: true,
    on: {
        init: function (swiper) {
            // for (let i = 0; i < swiper.slides.length; i++) {
            //     lightSwiperPgn.appendSlide(`<div class="swiper-slide">${i + 1}</div>`)
            // }
            // swiper.controller.control.updateSlides();
        },
        slideChange(swiper) {
            document.querySelector('#sky_location').classList.add('hide');
            setTimeout(() => {
                document.querySelector('#sky_location').innerHTML = document.querySelectorAll('.light_swiper .swiper-slide')[swiper.activeIndex].getAttribute('data-slide-name')
                document.querySelector('#sky_location').classList.remove('hide');
            }, 200);
        }
    }
});

// GL BG

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rgb(r, g, b) {
    return new THREE.Vector3(r, g, b);
}
document.addEventListener("DOMContentLoaded", function (e) {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('section.info#section_1').append(renderer.domElement)

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    let vCheck = false;

    camera.position.z = 5;

    var randomisePosition = new THREE.Vector2(1, 2);

    var R = function (x, y, t) {
        return (Math.floor(192 + 64 * Math.cos((x * x - y * y) / 300 + t)));
    }

    var G = function (x, y, t) {
        return (Math.floor(192 + 64 * Math.sin((x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300)));
    }

    var B = function (x, y, t) {
        return (Math.floor(192 + 64 * Math.sin(5 * Math.sin(t / 9) + ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100)));
    }
    let sNoise = document.querySelector('#snoise-function').textContent
    let geometry = new THREE.PlaneGeometry(window.innerWidth / 2, 400, 100, 100);
    let material = new THREE.ShaderMaterial({
        uniforms: {
            u_bg: { type: 'v3', value: localStorage.getItem('themeMode') == 'light' ? rgb(255, 230, 230) : rgb(0, 0, 0) },
            u_bgMain: { type: 'v3', value: localStorage.getItem('themeMode') == 'light' ? rgb(255, 230, 230) : rgb(0, 0, 0) },
            u_color1: { type: 'v3', value: rgb(131, 131, 228) },
            u_color2: { type: 'v3', value: rgb(245, 132, 132) },
            u_time: { type: 'f', value: 30 },
            u_randomisePosition: { type: 'v2', value: randomisePosition }
        },
        fragmentShader: sNoise + document.querySelector('#fragment-shader').textContent,
        vertexShader: sNoise + document.querySelector('#vertex-shader').textContent,
    });

    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-200, 270, -280);
    mesh.scale.multiplyScalar(4);
    mesh.rotationX = -1.0;
    mesh.rotationY = 0.0;
    mesh.rotationZ = 0.1;
    scene.add(mesh);

    renderer.render(scene, camera);
    let t = 0;
    let j = 0;
    let x = randomInteger(0, 32);
    let y = randomInteger(0, 32);
    const animate = function () {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        mesh.material.uniforms.u_randomisePosition.value = new THREE.Vector2(j, j);

        mesh.material.uniforms.u_color1.value = new THREE.Vector3(R(x, y, t / 2), G(x, y, t / 2), B(x, y, t / 2));

        mesh.material.uniforms.u_time.value = t;
        if (t % 0.1 == 0) {
            if (vCheck == false) {
                x -= 1;
                if (x <= 0) {
                    vCheck = true;
                }
            } else {
                x += 1;
                if (x >= 32) {
                    vCheck = false;
                }

            }
        }

        j = j + 0.01;
        t = t + 0.05;
    };
    animate();
    document.getElementById('theme_changer_checkbox').addEventListener('change', function () {
        if (this.checked) {
            mesh.material.uniforms.u_bg.value = rgb(0, 0, 0);
            mesh.material.uniforms.u_bgMain.value = rgb(0, 0, 0);
        } else {
            mesh.material.uniforms.u_bg.value = rgb(255, 230, 230);
            mesh.material.uniforms.u_bgMain.value = rgb(255, 230, 230);
        }
        app.setTheme(this.checked ? 'dark' : 'light');
    });
});

// sections hotkeys

document.querySelectorAll('.main__content section').forEach((el, i) => {
    hotkeys((i + 1).toString(), function (event, handler) {
        event.preventDefault()
        scroll.scrollTo(document.getElementById(`section_${i + 1}`), { easing: [0.22, 1, 0.36, 1], duration: 100 })
    });
})

document.querySelectorAll('input[name="posts_tasks"]').forEach(el => {
    el.addEventListener('change', function () {
        document.querySelector(`label[for="${this.id}"]`).classList.add('chosen');
        document.querySelectorAll(`label.posts__task__radio:not([for="${this.id}"])`).forEach(label => label.classList.remove('chosen'))
        const list = document.querySelector(`.posts .posts__container .list.${this.id.replace('_radio', '')}__content`);
        const noList = document.querySelector(`.posts .posts__container .list:not(.${this.id.replace('_radio', '')}__content)`);

        const tl = gsap.timeline();

        tl.fromTo(noList.querySelectorAll('.post'), {
            opacity: 1,
        }, {
            opacity: 0,
            yPercent: 50,
            scaleY: 0.5,
            stagger: {
                each: .05,
            },
            ease: 'expo.in',
            onComplete: function () {
                list.style.display = "";
                noList.style.display = "none";
            }
        }).fromTo(list.querySelectorAll('.post'), {
            opacity: 0,
            yPercent: 50,
            scaleY: 1,
            y: 20,
            yPercent: 0,
        }, {
            opacity: 1,
            scaleY: 1,
            y: 0,
            stagger: .05,
            duration: .5,
            ease: 'quint.out'
        })
    })
})

const timeDifference = function (e, n) { var r = 6e4, t = 36e5, o = 864e5, u = 2592e6, a = 31536e6, d = e - n; return d < r ? Math.round(d / 1e3) + " сек назад" : d < t ? Math.round(d / r) + " мин назад" : d < o ? Math.round(d / t) + "ч назад" : d < u ? Math.round(d / o) + " д назад" : d < a ? Math.round(d / u) + " мес назад" : Math.round(d / a) + " г назад" };
const currentTime = new Date().getTime();

fetch(`${env_path}/api/sky`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
}).then(responce => responce.json()).then(result => {
    setTimeout(() => {
        result.posts.forEach(post => {
            document.querySelector('.list.posts__content').insertAdjacentHTML("afterBegin", `<div class="post"><div class="post__title"><h1>${post.title || 'No title'}</h1><p class="time">${timeDifference(currentTime, new Date(post.date).getTime())}</p></div><div class="post__container">${post.img != false ? `<img src="${post.img}">` : ""}</div></div>`);
            gsap.fromTo(document.querySelectorAll('.list.posts__content .post'), {
                opacity: 0
            }, {
                opacity: 1
            })
        })
    }, 1000);
    gsap.to(document.querySelector('.list.posts__content .preloader__posts'), {
        opacity: 0,
        duration: .5,
        delay: .5,
        ease: 'sine.in'
    })
})

fetch(`${env_path}/api/sky`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
}).then(responce => responce.json()).then(result => {
    result.types.forEach((task, i) => {
        document.querySelector('.schedule .types').insertAdjacentHTML("afterBegin", `<div class="task_type"><h1>${i} | ${task.en}</h1><img src="img/g_assets/tasks/${task.icon}.webp"></div>`);
    })
})