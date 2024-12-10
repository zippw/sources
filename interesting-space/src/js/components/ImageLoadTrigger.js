export default class ImageLoadTrigger {
    constructor(cb, onUpdate) {
        this.cb = cb;
        this.onUpdate = onUpdate;
        this.images = document.querySelectorAll('img');
        this.c = 0;
        this.tot = this.images.length;
        this.bind()
    }

    bind() {
        if (this.tot == 0) return this.cb();

        var counter = 0;
        var i = setInterval(() => {
            var tImg = new Image();
            tImg.onload = () => this.imgLoaded();
            tImg.onerror = () => this.imgLoaded();
            tImg.src = this.images[counter].src;
            counter++;
            if (counter === this.tot) {
                clearInterval(i);
            }
        }, 10);
    }

    imgLoaded() {
        this.c += 1;
        var perc = ((100 / this.tot * this.c) << 0);
        this.onUpdate(perc, this.c, this.tot);
        // this.preloader.progress.innerText = perc
        if (this.c === this.tot) return this.cb();
    }
}