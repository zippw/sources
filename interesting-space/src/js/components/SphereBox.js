import Matter from 'matter-js';

export default class SphereBox {
    constructor(wrapper) {
        this.wrapper = wrapper;
        this.lastScrollTop = 0;
        this.start();
    }

    start() {
        this.createSphere()
    }

    async createSphere() {
        let majorPlatformVersion;

        if (navigator.userAgentData) {
            if (navigator.userAgentData.platform === "Windows") {
                let ua = await navigator.userAgentData.getHighEntropyValues(["platformVersion"]);
                majorPlatformVersion = parseInt(ua.platformVersion.split('.')[0]);
            }
        }

        // create an engine
        this.engine = Matter.Engine.create();

        // create a renderer
        var render = Matter.Render.create({
            element: this.wrapper,
            engine: this.engine,
            options: {
                width: this.wrapper.offsetWidth,
                height: this.wrapper.offsetHeight,
                pixelRatio: 1,
                background: 'transparent',
                wireframes: false,
            }
        });

        this.engine.timing.timeScale = 0.35;
        // if (majorPlatformVersion >= 13) {
        //     this.engine.timing.timeScale = 0.35;
        // }

        this.engine.gravity.y = 1;
        this.engine.gravity.x = 0;
        this.engine.gravity.scale = 0.0025;

        // create bounds
        var ground = Matter.Bodies.rectangle(
            (this.wrapper.offsetWidth / 2) + 160, this.wrapper.offsetHeight + 80, this.wrapper.offsetWidth + 320, 160, { render: { fillStyle: '#FF0000', opacity: 0 }, isStatic: true });
        var wallLeft = Matter.Bodies.rectangle(-80, this.wrapper.offsetHeight / 2, 160, this.wrapper.offsetHeight, { render: { fillStyle: '#FF0000', opacity: 0 }, isStatic: true });
        var wallRight = Matter.Bodies.rectangle(this.wrapper.offsetWidth + 80, this.wrapper.offsetHeight / 2, 160, 1200, { render: { fillStyle: '#FF0000', opacity: 0 }, isStatic: true })
        var roof = Matter.Bodies.rectangle(
            (this.wrapper.offsetWidth / 2) + 160, -80, this.wrapper.offsetWidth + 320, 160, { render: { fillStyle: '#FF0000', opacity: 0 }, isStatic: true })

        let maxHeight = this.wrapper.offsetHeight,
            maxWidth = this.wrapper.offsetWidth,
            radius = 20;

        const list = [
            // { w: 115 },
            // { w: 167 },
            // { w: 91 },
            // { w: 80 },
            // { w: 115 },
            // { w: 85 },
            // { w: 202 },
            { w: 184 },
            { w: 189 },
            { w: 199 },
            { w: 195 },
            { w: 153 },
            { w: 179 },
            { w: 263 },
            { w: 226 },
            { w: 225 },
            { w: 159 },
            { w: 235 },
            { w: 177 },
            { w: 87 },
        ];

        this.stack = [
            ground, wallLeft, wallRight, roof
        ];

        list.forEach((item, i) => {
            let el = Matter.Bodies.rectangle(Math.floor(Math.random() * maxWidth), maxHeight - 100, item.w / 2, 40, { chamfer: { radius }, render: { sprite: { texture: `/img/toys/${i + 7}.png`, xScale: 0.5, yScale: 0.5 } } });
            this.stack.push(el)
        });

        Matter.World.add(this.engine.world, this.stack);

        // add mouse control
        // let mouse = Matter.Mouse.create(render.canvas),
        //     mouseConstraint = Matter.MouseConstraint.create(this.engine, {
        //         mouse: mouse,
        //         constraint: {
        //             stiffness: 0.2,
        //             render: {
        //                 visible: false
        //             }
        //         }
        //     });

        // mouseConstraint.mouse.element.removeEventListener('mousewheel', mouseConstraint.mouse.mousewheel);
        // mouseConstraint.mouse.element.removeEventListener('DOMMouseScroll', mouseConstraint.mouse.mousewheel);

        // let shakeScene = function (engine, bodies) {
        //     let timeScale = (1000 / 60) / engine.timing.lastDelta;

        //     for (let i = 0; i < bodies.length; i++) {
        //         let body = bodies[i];

        //         if (!body.isStatic) {
        //             // scale force for mass and time applied
        //             let forceMagnitude = (0.03 * body.mass) * timeScale;

        //             // apply the force over a single update
        //             Matter.Body.applyForce(body, body.position, {
        //                 x: (forceMagnitude + Matter.Common.random() * forceMagnitude) * Matter.Common.choose([1, -1]),
        //                 y: -forceMagnitude + Matter.Common.random() * -forceMagnitude
        //             });
        //         }
        //     }
        // };

        // Matter.Events.on(mouseConstraint, 'mousemove', (event) => {
        //     // get bodies
        //     let foundPhysics = Matter.Query.point(this.stack, event.mouse.position);
        //     shakeScene(this.engine, foundPhysics);
        // });

        // Matter.Composite.add(this.engine.world, mouseConstraint);

        // keep the mouse in sync with rendering
        // render.mouse = mouse;

        Matter.Render.run(render);

        // run the engine
        Matter.Runner.run(this.engine);
    }

    onScroll(offset) {
        this.scrollDirection = offset < this.lastScrollTop ? -1 : 1;
        this.stack.forEach((body) => {
            if (!body.isStatic) {
                Matter.Body.setVelocity(body, {
                    x: this.rand(-4, 4),
                    y: this.rand(-20, -4) * this.scrollDirection
                });
                Matter.Body.setAngularVelocity(body, this.rand(0.05, -0.05));
            }
        });
        
        this.lastScrollTop = offset;
    }

    rand(min, max) {
        return Math.random() * (max - min) + min;
    };
}