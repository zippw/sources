import gsap from 'gsap';
import App from "./App";
import SwipeListener from 'swipe-listener';
import Bound from 'bounds.js'

const boundary = Bound();
document.querySelectorAll('.lazy').forEach(img => {
    boundary.watch(img, () => { console.log(img) })
})

const closeMedia = function (div, e = null) {
    if (e?.target === e?.currentTarget || e?.target === div?.querySelector('button#closeMediaBtn')) {
        div?.classList.remove('showing');
        setTimeout(() => {
            div?.remove()
        }, 200);
    }
}
window.closeMedia = closeMedia;

hotkeys('Esc', function (event, handler) {
    closeMedia(document.querySelector('.media-viewer'))
});

const openMedia = function (src) {
    const div = document.createElement('div')
    div.className = "media-viewer";
    div.innerHTML = `<div class="top_nav"><a href="${src}" download><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path opacity="0.4" d="M7 9L17 9C19.2091 9 21 10.7909 21 13V17C21 19.2091 19.2091 21 17 21H7C4.79086 21 3 19.2091 3 17L3 13C3 10.7909 4.79086 9 7 9Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8.46967 11.4697C8.17678 11.7626 8.17678 12.2374 8.46967 12.5303L11.4697 15.5303C11.7626 15.8232 12.2374 15.8232 12.5303 15.5303L15.5303 12.5303C15.8232 12.2374 15.8232 11.7626 15.5303 11.4697C15.2374 11.1768 14.7626 11.1768 14.4697 11.4697L12.75 13.1893L12.75 3C12.75 2.58579 12.4142 2.25 12 2.25C11.5858 2.25 11.25 2.58579 11.25 3L11.25 13.1893L9.53033 11.4697C9.23744 11.1768 8.76256 11.1768 8.46967 11.4697Z"/></svg></a>
    <button id="closeMediaBtn"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.7123 16.7729C16.0052 17.0658 16.4801 17.0658 16.7729 16.7729C17.0658 16.48 17.0658 16.0052 16.7729 15.7123L13.0607 12L16.7729 8.2877C17.0658 7.99481 17.0658 7.51993 16.7729 7.22704C16.48 6.93415 16.0052 6.93415 15.7123 7.22704L12 10.9393L8.28766 7.22699C7.99477 6.9341 7.5199 6.9341 7.227 7.22699C6.93411 7.51989 6.93411 7.99476 7.227 8.28765L10.9393 12L7.22699 15.7123C6.9341 16.0052 6.9341 16.4801 7.22699 16.773C7.51989 17.0659 7.99476 17.0659 8.28765 16.773L12 13.0606L15.7123 16.7729Z"/></svg></button></div>
    <div class="media-viewer_content"><img src="${src}"></div>
    `
    div.querySelector('button#closeMediaBtn').addEventListener('click', (e) => closeMedia(div, e))
    document.body.appendChild(div);
    requestAnimationFrame(() => {
        // second state
        div.classList.add("showing")
    })
    div.addEventListener('click', (e) => closeMedia(div, e));
}

document.querySelectorAll('.media_img').forEach(el => {
    const img = el.querySelector('img');
    img.addEventListener('click', () => openMedia(img.src))
})

new App;

const show_close = function (ctx) {
    const selector = '.card__container__dd .card:not(:nth-child(1)):not(:nth-child(2)):not(:nth-child(3)):not(:nth-child(4))'
    if (!ctx.classList.contains('shown')) {
        gsap.fromTo(document.querySelectorAll(selector), {
            display: "none",
            opacity: 0,
            y: -20
        }, {
            display: "flex",
            opacity: 1,
            y: 0,
            stagger: .1,
            duration: .5,
            ease: "quint.out"
        })
    } else {
        gsap.fromTo(document.querySelectorAll(selector), {
            opacity: 1,
            y: 0
        }, {
            opacity: 0,
            y: -20,
            stagger: .05,
            duration: .5,
            ease: "quint.out",
            onComplete: () => {
                document.querySelectorAll(selector).forEach(el => {
                    el.style.display = "none"
                })
            }
        })
    }
    ctx.classList.toggle('shown')
}

window.show_close = show_close;

document.getElementById('wl_grid').querySelectorAll('button').forEach((btn, i) => {
    btn.addEventListener('click', function () { scroll.scrollTo(document.getElementById(`wl_${i + 1}`), { easing: [0.85, 0, 0.15, 1] }) })
})

// NAVIGATION

const nav = document.getElementById('navigaion_wiki');
var container = document.querySelector('.middle');
var listener = SwipeListener(container);
container.addEventListener('swipe', function (e) {
    var directions = e.detail.directions;
    var x = e.detail.x;
    var y = e.detail.y;

    if (directions.right) {
        nav.classList.add('slide');
    }
});
container.addEventListener('click', function () {
    nav.classList.remove('slide')
})
var navListener = SwipeListener(nav);
nav.addEventListener('swipe', function (e) {
    var directions = e.detail.directions;
    var x = e.detail.x;
    var y = e.detail.y;

    if (directions.left) {
        nav.classList.remove('slide');
    }
});