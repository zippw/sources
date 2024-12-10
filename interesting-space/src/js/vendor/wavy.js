export default class Wavy {
    constructor(el) {
        this.el = el;
        this.ev = this.el.getAttribute('data-wavy-type');
        this.init();
    }

    init() {
        this.el.addEventListener(this.ev, function (e) {
            const size = Math.max(this.offsetWidth, this.offsetHeight),
                x = (this.offsetWidth - e.target.offsetWidth || 0) + e.offsetX - size / 2,
                y = (this.offsetHeight - e.target.offsetHeight || 0) + e.offsetY - size / 2,
                wave = document.createElement('span');
            wave.className = 'wave';
            wave.style.cssText = `width:${size}px; height:${size}px; top:${y}px; left: ${x}px`;
            this.appendChild(wave)

            setTimeout(() => {
                wave.remove()
            }, 1000);
        })
    }
}