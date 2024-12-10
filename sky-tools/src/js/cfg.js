export const config = {
    cursorCfg: {
        speed: 0.5,
        ease: 'quart.out',
        stateDetection: {
            '-pointer_big': 'a,button,nav.sections ul li',
            '-hidden': 'iframe',
            '-bigIcon -hidden': '.media_img'
        },
        className: 'sky-cursor',
        innerClassName: 'sky-cursor-inner',
        textClassName: 'sky-cursor-text',
        mediaClassName: 'sky-cursor-media',
        mediaBoxClassName: 'sky-cursor-media-box',
        iconSvgClassName: 'sky-svgsprite',
        dataAttr: 'cursor',
        skewingText: 0,
        skewingIcon: 0,
        iconSvgSrc: './assets/img/sprites/svgsprites.svg',
        stickDelta: .1
    },
    scrollCfg: {
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        touchMultiplier: 3,
        smartphone: {
            breakpoint: 0,
            smooth: true,
            horizontalGesture: true
        },
        tablet: {
            breakpoint: 0,
            smooth: true
        }
    }
};
