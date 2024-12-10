import gsap from 'gsap';
import MouseFollower from "mouse-follower";
import Magnetic from "vendor/magnetic";
import LocomotiveScroll from 'locomotive-scroll';
import hotkeys from 'hotkeys-js';

import { config } from "./cfg"

window.mobileCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

export default class App {
    constructor(options = {}) {
        Object.assign(this, config);

        this.init();
    }
    // ux
    initCursor() {
        if (mobileCheck() == false) {
            MouseFollower.registerGSAP(gsap);
            const cursor = new MouseFollower(this.cursorCfg);

            document.querySelectorAll('.media_img').forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.setIcon('search-plus');
                });

                el.addEventListener('mouseleave', () => {
                    cursor.removeIcon();
                });
            })
            document.querySelectorAll('[data-magnetic]').forEach(el => new Magnetic(el));
        }
    }
    initScroll() {
        const scroll = new LocomotiveScroll(this.scrollCfg);
        window.scroll = scroll;
    }

    // theme controller
    setTheme(themeType) {
        document.documentElement.setAttribute('data-theme', themeType);
        localStorage.setItem('themeMode', themeType);
    }
    themeDefault() {
        const current = localStorage.getItem('themeMode');
        if (!current) {
            localStorage.setItem('themeMode', window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light")
        }
        this.setTheme(current);
        document.getElementById('theme_changer_checkbox').checked = current == 'dark' ? true : false
    }

    // events
    cbThemeChanged(e, obj) {
        this.setTheme(e.target.checked ? 'dark' : 'light')
    }

    bind() {
        // overflow scroll containers with locoscroll
        document.querySelectorAll('[data-overflow-locomative]').forEach(el => {
            // const a = function () {
            //     scroll.stop();

            //     if (Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) <= 3.0) {
            //         scroll.start();
            //     } else if(el.scrollTop == 0) {
            //         scroll.start();
            //     }
            // }
            // el.onscroll = a;
            el.onmouseover = function () { scroll.stop(); };
            el.onmouseout = function () { scroll.start(); };
            el.ontouchstart = function () { scroll.stop() };
            el.ontouchend = function () { scroll.start(); };
        })
        document.querySelector('#side_menu').addEventListener("change", function () {
            const side_menu = document.querySelector('.side_menu');
            if (this.checked) {
                side_menu.classList.add('shown');
            } else {
                side_menu.classList.remove('shown');
            }
        })

        document.querySelector('.side_menu .project__help textarea').addEventListener('input', function () {
            if (this.value.length > 0) {
                document.querySelector('.side_menu .text_and_submit').classList.add('focused')
            } else {
                document.querySelector('.side_menu .text_and_submit').classList.remove('focused')
            }
        })

        document.getElementById('theme_changer_checkbox').addEventListener('change', e => this.cbThemeChanged(e))
    }

    // hot keys
    initHotkeys() {
        hotkeys('Q', function (event, handler) {
            event.preventDefault()

            const menu = document.querySelector('#side_menu');

            if (menu.checked) {
                menu.checked = false;
            } else {
                menu.checked = true
            }
            var event = document.createEvent("HTMLEvents");
            event.initEvent('change', false, true);
            menu.dispatchEvent(event);
        });

        hotkeys('Esc', function (event, handler) {
            event.preventDefault()

            const menu = document.querySelector('#side_menu');
            if (menu.checked) {
                menu.checked = false
            }
            var event = document.createEvent("HTMLEvents");
            event.initEvent('change', false, true);
            menu.dispatchEvent(event);
            // closeMedia(document.querySelector('.media-viewer'))
        });

        hotkeys('A', function (event, handler) {
            event.preventDefault();

            const tcc = document.querySelector('#theme_changer_checkbox');

            if (tcc.checked) {
                tcc.checked = false
            } else {
                tcc.checked = true
            }
            var event = document.createEvent("HTMLEvents");
            event.initEvent('change', false, true);
            tcc.dispatchEvent(event);
        })
    }
    // all
    init() {
        this.initCursor();
        this.initScroll();
        this.bind();
        this.themeDefault();
        this.initHotkeys();
    }
}