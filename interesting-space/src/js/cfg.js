export const cursorCfgs = [
    {
        el: null,
        container: document.body,
        className: 'cursor',
        innerClassName: 'cursor-inner',
        textClassName: 'cursor-text',
        mediaClassName: 'cursor-media',
        mediaBoxClassName: 'cursor-media-box',
        iconSvgClassName: 'svgsprite',
        iconSvgNamePrefix: '-',
        iconSvgSrc: '',
        dataAttr: 'cursor',
        hiddenState: '-hidden',
        textState: '-text',
        iconState: '-icon',
        activeState: '-active',
        mediaState: '-media',
        stateDetection: {
            '-hidden': 'iframe,.input'
        },
        visible: true,
        visibleOnState: false,
        speed: 0.3,
        speed: 1,
        ease: 'expo.out',
        overwrite: true,
        skewing: 3,
        skewingText: 2,
        skewingIcon: 2,
        skewingMedia: 2,
        skewingDelta: 0.001,
        skewingDeltaMax: 0.15,
        stickDelta: 0.15,
        showTimeout: 20,
        hideOnLeave: true,
        hideTimeout: 300,
        hideMediaTimeout: 300
    }, {
        el: null,
        container: document.body,
        className: 'cursor-big',
        innerClassName: 'cursor-inner',
        textClassName: 'cursor-text',
        mediaClassName: 'cursor-media',
        mediaBoxClassName: 'cursor-media-box',
        iconSvgClassName: 'svgsprite',
        iconSvgNamePrefix: '-',
        iconSvgSrc: '',
        dataAttr: 'cursor',
        hiddenState: '-hidden',
        textState: '-text',
        iconState: '-icon',
        activeState: '-active',
        mediaState: '-media',
        stateDetection: {
            '-hidden': 'iframe,.input'
        },
        visible: true,
        visibleOnState: false,
        speed: 0.2,
        ease: 'expo.back',
        overwrite: true,
        skewing: 0,
        skewingText: 2,
        skewingIcon: 2,
        skewingMedia: 2,
        skewingDelta: 0.001,
        skewingDeltaMax: 0.15,
        stickDelta: 0.15,
        showTimeout: 20,
        hideOnLeave: true,
        hideTimeout: 300,
        hideMediaTimeout: 300
    },
    {
        speed: .2,
        ease: 'back.out',
        className: 'macos-cursor',
        innerClassName: 'macos-cursor-inner',
        textClassName: 'macos-cursor-text',
        mediaClassName: 'macos-cursor-media',
        mediaBoxClassName: 'macos-cursor-media-box',
        iconSvgClassName: 'macos-svgsprite',
        dataAttr: 'macos',
        skewingText: 0,
        skewingIcon: true,
        iconSvgSrc: '/assets/img/sprites/svgsprites.svg',
        stickDelta: .1
    }
]

export const scrollCfg = {
    renderByPixels: false,
    // damping: 0.075
    damping: 0.1,
    plugins: {
        disableScroll: {
            direction: "x"
        }
    }
    // SoftScroll: {
    //     lockX: null
    // }
}
