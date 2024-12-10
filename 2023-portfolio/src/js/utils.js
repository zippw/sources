import gsap from 'gsap';
import * as THREE from 'three'

export const ev = (eventName, data, once = false) => {
    const e = new CustomEvent(eventName, { detail: data }, { once })
    document.dispatchEvent(e)
}

export const toAny = function (num, n) {
    let str = "", // вывод
        x = 1, // максимальный разряд
        l = 0,  // количество разрядов
        a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F']

    while (x <= num) {
        l++
        x = x == 1 ? n * n : x * n;
    };

    let nn = num; // остаток
    for (let i = 0; i <= l; i++) {
        x = x / n;
        let skipNext = false;
        for (let i = n - 1; i >= 0; i = i - 1) { // перевернутый цикл (приводит i к нулю)
            if (i * x <= nn && skipNext == false) {
                nn = nn - (x * i);
                str += a[i];
                skipNext = true;
            };
        }
    }
    return str
};

export const toDec = function (num, n) {
    let str = 0,
        arr = num.toString().toUpperCase().split(''),
        l = arr.length,  // количество разрядов
        a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];

    for (let i = l; i > 0; i = i - 1) {
        let r = 1;
        for (let x = 1; x < i; x++) {
            r = r * n
        }

        let number = a.indexOf(Number(arr[l - i]) ? Number(arr[l - i]) : arr[l - i]);
        str = str + (number * r)
    }

    return str
}

export const convert = function (num, from, to) {
    if (from == 10) {
        return toAny(num, to)
    } else {
        return toAny(toDec(num, from), to)
    }
}

export const randomStr = function (length) {
    let result = '';
    const characters = `!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_\`abcdefghijklmnopqrstuvwxyz{|}~`;
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

export const mobileCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

export const textChanger = function (el, arr) {
    let i = 0;
    el.querySelector('.ov .line:nth-child(1)').innerHTML = arr[0].replace(/\S/g, "<span>$&</span>");
    const lineHeight = el.querySelector('.line').offsetHeight;
    el.querySelector('.ov').style.maxHeight = lineHeight + "px";

    setInterval(() => {
        el.querySelector('.ov .line:nth-child(1)').innerHTML = arr[i].replace(/\S/g, "<span>$&</span>");
        el.querySelector('.ov .line:nth-child(2)').innerHTML = arr[i + 1 > arr.length - 1 ? 0 : i + 1].replace(/\S/g, "<span>$&</span>");
        gsap.to(el.querySelectorAll('.ov .line:nth-child(1) span'), {
            yPercent: -100,
            opacity: 0,
            stagger: {
                amount: .2
            }
        })
        gsap.to(el.querySelectorAll('.ov .line:nth-child(2) span'), {
            yPercent: -100,
            opacity: 1,
            ease: 'quint.out',
            stagger: .1
        })
        i + 1 > arr.length - 1 ? i = 0 : i++;
    }, 5000);
}

export const rotateMatrix = (a) => [Math.cos(a), -Math.sin(a), Math.sin(a), Math.cos(a)]

export const multiplyMatrixAndPoint = (matrix, point) => {
    const c0r0 = matrix[0]
    const c1r0 = matrix[1]
    const c0r1 = matrix[2]
    const c1r1 = matrix[3]
    const x = point[0]
    const y = point[1]
    return [Math.abs(x * c0r0 + y * c0r1), Math.abs(x * c1r0 + y * c1r1)]
}

export const getRatio = ({ x: w, y: h }, { width, height }, r = 0) => {
    const m = multiplyMatrixAndPoint(rotateMatrix(THREE.Math.degToRad(r)), [w, h])
    const originalRatio = {
        w: m[0] / width,
        h: m[1] / height,
    }

    const coverRatio = 1 / Math.max(originalRatio.w, originalRatio.h)

    return new THREE.Vector2(
        originalRatio.w * coverRatio,
        originalRatio.h * coverRatio,
    )
};

export const pathMorph = function (el) {
    const svgEl = el.closest('svg');
    const pathTo = el.dataset.pathTo;
    gsap.timeline({
        scrollTrigger: {
            trigger: svgEl,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    }).to(el, {
        ease: 'none',
        attr: { d: pathTo }
    });
}

export const getTranslateXY = function (element) {
    const style = window.getComputedStyle(element)
    const matrix = new DOMMatrixReadOnly(style.transform)
    return {
        translateX: matrix.m41,
        translateY: matrix.m42
    }
}

export const getColor = (color1, color2, ratio) => {
    var hex = function (x) {
        x = x.toString(16);
        return (x.length == 1) ? '0' + x : x;
    };

    var r = Math.ceil(parseInt(color1.substring(0, 2), 16) * ratio + parseInt(color2.substring(0, 2), 16) * (1 - ratio));
    var g = Math.ceil(parseInt(color1.substring(2, 4), 16) * ratio + parseInt(color2.substring(2, 4), 16) * (1 - ratio));
    var b = Math.ceil(parseInt(color1.substring(4, 6), 16) * ratio + parseInt(color2.substring(4, 6), 16) * (1 - ratio));

    var middle = hex(r) + hex(g) + hex(b);
    return middle;
}

export const getOffset = (el) => {
    var _x = 0;
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

export const getVar = (key, elem = document.documentElement) => getComputedStyle(elem).getPropertyValue(key)