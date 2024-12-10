import Draggabilly from "draggabilly";
import { getColor } from "../utils";
const MathUtils = {
    lerp: (a, b, n) => (1 - n) * a + n * b,
    map_range: (value, low1, high1, low2, high2) => {
        return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
    }
};

export default class Planes {
    constructor(els) {
        this.els = els;
        this.draggie = new Draggabilly(this.els.draggableHidden, { axis: "x", });

        this.els.sliderNamesContainer.style.height =
            this.els.names[0].getBoundingClientRect().height + "px";

        let heightsOfPlanes = [];
        this.els.planes.forEach(el => {
            heightsOfPlanes.push(el.getBoundingClientRect().height);
        })
        this.els.planeContainer.style.height = Math.max(...heightsOfPlanes) + 20 + "px";

        this.width = innerWidth;

        this.mouse = {
            currentPosX: 0,
            previousPosX: 0,
            minPosX: 0,
            maxPosX: this.width - this.els.draggableHidden.getBoundingClientRect().width,
            isMouseDown: false
        };

        this.sliderNamesProps = {
            containerHeight:
                this.els.sliderNamesContainer.getBoundingClientRect().height -
                this.els.sliderNames.getBoundingClientRect().height
        };

        this.start = performance.now();
        this.velocity = 0;
        this.lastVelocity = 0;
        this.posNames = 0;
        this.lastPosNames = 0;
        this.amplitude = 0.1;
        this.lastMouse = 0;
        this.easing = 0.05;
        this.cancelAnimation = true;
        this.isOut = false;
        this.itemIndex = 0;
        this.color = "FFFFFF"

        this.initEvents();
        this.onUpdate();
    }

    onDragMove = () => {
        this.cancelAnimation = false;
        let active = this.els.draggableVisible.querySelector('.active');
        if (active) active.classList.remove('active')
        // this.els.draggableVisible.querySelector('.active').classList.remove('active')
        if (this.draggie.position.x > this.mouse.minPosX) {
            this.mouse.currentPosX = MathUtils.map_range(
                this.draggie.position.x,
                0,
                innerWidth,
                0,
                innerWidth / 3
            );
        } else if (this.draggie.position.x < this.mouse.maxPosX) {
            this.mouse.currentPosX = MathUtils.map_range(
                this.draggie.position.x,
                this.mouse.maxPosX,
                this.mouse.maxPosX - innerWidth,
                this.mouse.maxPosX,
                this.mouse.maxPosX - innerWidth / 3
            );
        } else {
            this.mouse.currentPosX = this.draggie.position.x;

            this.easing = 0.05;
        }

        this.amplitude = 0.1;
    };

    onDragStart = (e) => {
        this.els.planeContainer.style.cursor = "grabbing";
    };

    onDragEnd = () => {
        this.els.planeContainer.style.cursor = "grab";

        // Si esta en el limite volvera a su posicion inicial o final
        if (this.draggie.position.x > this.mouse.minPosX) {
            this.mouse.currentPosX = 0;
            this.draggie.setPosition(this.mouse.currentPosX, this.draggie.position.y);
            this.amplitude = 0;
            this.easing = 0.07;
        } else if (this.draggie.position.x < this.mouse.maxPosX) {
            this.mouse.currentPosX = this.mouse.maxPosX;
            this.draggie.setPosition(this.mouse.currentPosX, this.draggie.position.y);
            this.amplitude = 0;
            this.easing = 0.07;
        } else {
            this.draggie.setPosition(this.mouse.currentPosX, this.draggie.position.y);
        }
    };

    onResize = () => {
        this.els.sliderNamesContainer.style.height =
            this.els.names[0].getBoundingClientRect().height + "px";

        this.mouse.maxPosX =
            window.innerWidth - this.els.draggableHidden.getBoundingClientRect().width;

        this.sliderNamesProps = {
            containerHeight:
                this.els.sliderNamesContainer.getBoundingClientRect().height -
                this.els.sliderNames.getBoundingClientRect().height
        };

        let heightsOfPlanes = [];
        this.els.planes.forEach(el => {
            heightsOfPlanes.push(el.getBoundingClientRect().height);
        })
        this.els.planeContainer.style.height = Math.max(...heightsOfPlanes) + 20 + "px";
    };

    initEvents = () => {
        this.draggie.on("dragMove", (e) => {
            if (this.isOut) return;
            this.onDragMove();
        });
        this.draggie.on("pointerDown", () => {
            this.isOut = false;
            this.onDragStart();
        });
        this.draggie.on("pointerUp", this.onDragEnd);

        this.els.planeContainer.addEventListener("mouseleave", () => {
            this.isOut = true;
            this.onDragEnd();
        });
        // this.els.draggableHidden.addEventListener("click", (e) => {
        //     console.log(e.clientX, e.clientY)
        // });

        this.draggie.on('staticClick', (event, pointer) => {
            // let offset = Math.abs(Math.round(this.els.draggableVisible.getBoundingClientRect().left));
            this.els.planes.forEach(el => {
                let left = Math.round(el.getBoundingClientRect().left);
                let right = Math.round(el.getBoundingClientRect().right);
                if (pointer.clientX >= left && pointer.clientX <= right) {
                    window.open(el.getAttribute("href"), '_blank');
                }
            })
        })

        this.els.draggableHidden.addEventListener('mousemove', (pointer) => {
            this.els.planes.forEach(el => {
                let left = Math.round(el.getBoundingClientRect().left);
                let right = Math.round(el.getBoundingClientRect().right);
                if (pointer.clientX >= left && pointer.clientX <= right) {
                    el.classList.add('active')
                } else {
                    el.classList.remove('active')
                }
            })
        })

        this.els.draggableHidden.addEventListener('mouseout', () => {
            let active = this.els.draggableVisible.querySelector('.active');
            if (active) active.classList.remove('active')
        })

        window.addEventListener("resize", () => { this.onResize() });
    };

    onUpdate = () => {
        if (!this.cancelAnimation) {
            const { lerp } = MathUtils;
            const now = performance.now();

            const velocity =
                ((this.mouse.currentPosX - this.lastMouse) / (now - this.start)) * this.amplitude;

            this.lastVelocity = lerp(this.lastVelocity, velocity, this.easing);

            if (this.lastVelocity < 0) {
                this.color = getColor("9B6CF0", "FFFFFF", Math.abs(this.lastVelocity) <= 1 ? Math.abs(this.lastVelocity) * 5 : 1)
            } else {
                this.color = getColor("FCC79E", "FFFFFF", Math.abs(this.lastVelocity) <= 1 ? Math.abs(this.lastVelocity) * 5 : 1)
            }

            // this.els.progressFill.style.backgroundColor = "#" + this.color;
            this.els.sliderNamesContainer.style.color = "#" + this.color;
            let currentPerc = 100 / this.els.planes.length;

            // this.itemIndex = Math.floor((this.mouse.previousPosX / this.mouse.maxPosX) * 100 / currentPerc);
            for (let i = 0, l = this.els.planes.length; i < l; i++) {
                this.els.planes[i].style.transform = `scaleY(${1 - Math.abs(this.lastVelocity * .5)})`
            }

            this.start = now;
            this.lastMouse = this.mouse.currentPosX;

            this.mouse.previousPosX = lerp(this.mouse.previousPosX, this.mouse.currentPosX, this.easing);

            this.els.draggableVisible.style.transform = `translate3d(${this.mouse.previousPosX}px, 0, 0)`;
            // this.els.progressFill.style.width = `${(this.mouse.previousPosX / this.mouse.maxPosX) * 100}%`;
            this.posNames =
                (this.draggie.position.x / this.mouse.maxPosX) * this.sliderNamesProps.containerHeight;
            this.lastPosNames = lerp(this.lastPosNames, this.posNames, this.easing);

            this.els.sliderNames.style.transform = `translate3d(0,${this.lastPosNames}px,0)`;

            if (Math.round(this.mouse.previousPosX) === this.mouse.currentPosX) {
                this.cancelAnimation = true;
            }
        }

        requestAnimationFrame(this.onUpdate);
    };
}