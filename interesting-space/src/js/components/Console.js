import { gsap } from "gsap";
import { Terminal } from "xterm";
import { FitAddon } from 'xterm-addon-fit';
import unescapeJs from "unescape-js";
import ImageLoadTrigger from "./ImageLoadTrigger";

export default class Console {
    constructor(params, ux) {
        this.$els = {
            preloader: document.querySelector('.preloader'),
            canvas_frame: document.querySelector('.canvas_background'),
            // binaryPreloaderItems: document.querySelectorAll('[data-binary-animation]'),
            // imageText: document.querySelector('.preloader .load_progress p'),
            terminal: document.getElementById('term'),
            indicator: document.querySelector('.console__indicator')
        };

        this.consoleClosed = false;
        this.switchButtonClicked = false;
        this.firstSwitch = true;

        this.theme = {
            foreground: '#F8F8F8',
            background: '#131313',
            selection: '#5DA5D533',
            black: '#131313',
            brightBlack: '#131313',
            red: '#ea91a8',
            brightRed: '#ea91a8',
            green: '#bcf5e0',
            brightGreen: '#bcf5e0',
            yellow: '#f3dcd5',
            brightYellow: '#f3dcd5',
            blue: '#5D5DD3',
            brightBlue: '#7279FF',
            magenta: '#d2a1ff',
            brightMagenta: '#d2a1ff',
            cyan: '#5DA5D5',
            brightCyan: '#72F0FF',
            white: '#F8F8F8',
            brightWhite: '#FFFFFF'
        };

        this.onAppLoad = params.onAppLoad;
        // this.onEndComplete = params?.onEndComplete;

        this.term = new Terminal({
            fontFamily: 'monospace',
            cursorBlink: true,
            theme: this.theme
        });

        this.ux = ux;

        this.init();
        this.bind();
        this.start();
    }

    prompt() {
        this.command = '';
        this.term.write('\r\n$ ');
    }

    bind() {
        this.$els.indicator.addEventListener('click', () => {
            this.switchConsole();
        })
    }

    init() {
        const fitAddon = new FitAddon();
        this.term.loadAddon(fitAddon);
        this.term.open(document.querySelector('#terminal'));
        fitAddon.fit();

        // Cancel wheel events from scrolling the page if the terminal has scrollback
        document.querySelector('.xterm').addEventListener('wheel', e => {
            if (this.term.buffer.active.baseY > 0) {
                e.preventDefault();
            }
        });

        if (this.term._initialized) {
            return;
        }

        this.activeDialog = null;

        this.term._initialized = true;

        this.term.prompt = () => {
            this.term.write('\r\n$ ');
        };
    }

    dialog(message, ctx) {
        if (!ctx.disableCancelMessage) this.term.write(`\r\n\x1b[33m${unescapeJs(consoleLocalization.dialog.cancelMsg)}\x1b[0m`)
        this.term.write(`${ctx.rewrite ? "\r\x1b[2K" : "\r\n"}${message}: `);
        ctx.message = message;
        this.activeDialog = ctx;
    }

    cancelDialog() {
        this.term.write(`\r\x1b[2K${this.activeDialog.message}: \x1b[31m${consoleLocalization.dialog.canceled}\x1b[0m`);
        this.command = '';
        this.activeDialog = null;
        this.term.writeln("")
        this.prompt()
    }

    start() {
        if (this.term.cols >= 50) {
            this.term.writeln([
                "┌" + "─".repeat(this.term.cols - 2) + "┐",
                ...[
                    "     _                                      ",
                    " ___|_|___ ___ _ _ _    ___ ___ ___ ___ ___ ",
                    "|- _| | . | . | | | |  |_ -| . | .'|  _| -_|",
                    "|___|_|  _|  _|_____|  |___|  _|__,|___|___|",
                    "      |_| |_|              |_|              ",
                    ""
                ].map(x => formatCenter(this.term.cols, x, true)),
                "└" + "─".repeat(this.term.cols - 2) + "┘",
                ""
            ].join('\n\r'));
        } else {
            this.term.writeln([
                "┌" + "─".repeat(this.term.cols - 2) + "┐",
                ...[
                    " ____    __  __  __  ",
                    "/\u29F5_ ,`\u29F5 /\u29F5 \u29F5/\u29F5 \u29F5/\u29F5 \u29F5 ",
                    "\u29F5/_/  /_\u29F5 \u29F5 \u29F5_/ \u29F5_/ \u29F5",
                    "   /\u29F5____\u29F5\u29F5 \u29F5___x___/'",
                    "   \u29F5/____/ \u29F5/__//__/  ",
                    ""
                ].map(x => formatCenter(this.term.cols, x, true)),
                "└" + "─".repeat(this.term.cols - 2) + "┘",
                ""
            ].join('\n\r'));
        }

        new ImageLoadTrigger(
            () => {
                this.term.writeln('\n\r' + formatCenter(this.term.cols, unescapeJs(consoleLocalization.greeting), false))
                if (localStorage.getItem('autoskip') === "true") return this.commands.run.f()
                this.prompt(this.term);
            },

            (perc, index) => {
                let str = formatProgress(this.term.cols, consoleLocalization.loading_images, perc);
                this.term.writeln((index > 1 ? '\x1b[1A\x1b[2K' : "") + str);
            }
        );

        this.term.onData(e => {
            switch (e) {
                case '\u0003': // Ctrl+C
                    if (this.activeDialog) {
                        return this.cancelDialog()
                    };
                    this.term.write('^C');
                    this.prompt();
                    break;
                case '\r': // Enter
                    if (this.activeDialog) {
                        if (this.command === "cancel") return this.cancelDialog();

                        if (this.activeDialog.menu === true) {
                            if (this.command in this.activeDialog.arguments) {
                                this.activeDialog.arguments[this.command]();
                                this.command = '';
                                this.activeDialog = null;
                                this.prompt();

                            } else {
                                this.term.write(`\r\x1b[2K${this.activeDialog.message}: `);
                                this.command = '';
                            };
                        } else {
                            this.activeDialog.f(this.command,
                                () => {
                                    this.activeDialog = null;
                                    this.prompt();
                                },
                                (errorMessage) => {
                                    this.term.write(`\r\x1b[2K${this.activeDialog.message}: `);
                                    // this.term.write(`\r\n${this.activeDialog.message}: `);
                                    this.term.write(`\r\n${errorMessage}\x1b[F\x1b[${this.activeDialog.message.length + 2}C`);
                                }
                            );

                            this.command = '';
                        }

                        return
                    };
                    this.runCommand(this.command);
                    this.command = '';
                    break;
                case '\u007F': // Backspace (DEL)
                    // Do not delete the prompt
                    if (this.term._core.buffer.x > 2 && (this.activeDialog === null || this.term._core.buffer.x > this.activeDialog.message.length + 2)) {
                        this.term.write('\b \b');
                        if (this.command.length > 0) this.command = this.command.substr(0, this.command.length - 1);
                    }
                    break;
                default: // Print all other characters for demo
                    if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0') {
                        this.command += e;
                        this.term.write(e);
                    }
            }
        });

        this.command = '';
        this.commands = {
            run: {
                f: () => {
                    this.switchConsole();
                    this.term.writeln(unescapeJs(consoleLocalization.commands.run.starting))
                    this.prompt();
                },
                description: consoleLocalization.commands.run.description,
            },
            help: {
                f: () => {
                    if (this.term.cols >= 60) {

                        this.term.writeln([
                            unescapeJs(consoleLocalization.commands.help.welcomeMsg),
                            '',
                            ...Object.keys(this.commands).map(cmd => formatMessage(
                                this.term.cols,
                                cmd,
                                this.commands[cmd].description,
                                this.commands[cmd].localstoraged || false,
                                20
                            ))
                        ].join('\n\r'));
                    } else {
                        this.term.writeln([
                            unescapeJs(consoleLocalization.commands.help.welcomeMsg),
                            '',
                            ...Object.keys(this.commands).map(cmd => {
                                const localStoragedStr = (this.commands[cmd].localstoraged || false) ? `\x1b[0m[${(localStorage.getItem(cmd) || "false").replace("false", "\x1b[31mOFF").replace("true", "\x1b[32mON")}\x1b[0m]` : ""
                                return `${cmd} ${localStoragedStr}\n\r └ ${this.commands[cmd].description}\n\r`
                            })
                        ].join('\n\r'))
                    }
                    this.prompt();
                },
                description: consoleLocalization.commands.help.description,
            },
            lang: {
                f: () => {
                    this.term.writeln([
                        "",
                        ...langs.map((lang, i) => formatMessage(this.term.cols, `${i + 1}.`, lang, false, 2))
                    ].join('\n\r'));
                    let langObj = {};

                    langs.forEach((lang, i) => {
                        langObj[i + 1] = () => {
                            window.location.href = `/${lang}/`;
                        };
                    });

                    this.dialog(consoleLocalization.commands.lang.dialog, {
                        arguments: langObj,
                        menu: true
                    });
                },
                description: consoleLocalization.commands.lang.description
            },
            contact: {
                f: () => {
                    let data = {};
                    this.dialog(consoleLocalization.commands.contact.dialog, {
                        menu: false,
                        f: (args, onSuccess, onFailure) => {
                            const check = new RegExp(
                                '^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|' +
                                '(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])' +
                                '|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$').test(args);
                            if (!check) return onFailure(` └ \x1b[31m${consoleLocalization.commands.contact.incorrectEmailMsg}\x1b[0m`);
                            onSuccess();

                            data.email = args;
                            this.dialog(consoleLocalization.commands.contact.dialog1, {
                                disableCancelMessage: true,
                                rewrite: true,
                                menu: false,
                                f: (args, onSuccess, onFailure) => {
                                    if (args == "") return onFailure(` └ \x1b[31m${consoleLocalization.commands.contact.emptyValueMsg}\x1b[0m`);
                                    // this.term.write('\r\n\x1b[2K')
                                    onSuccess();
                                    data.name = args;
                                    this.dialog(consoleLocalization.commands.contact.dialog2, {
                                        disableCancelMessage: true,
                                        rewrite: true,
                                        menu: false,
                                        f: (args, onSuccess, onFailure) => {
                                            if (args == "") return onFailure(` └ \x1b[31m${consoleLocalization.commands.contact.emptyValueMsg}\x1b[0m`);
                                            this.term.write('\r\n\x1b[2K')
                                            onSuccess();
                                            data.message = args;
                                        }
                                    });
                                }
                            });
                        }
                    });
                },
                description: consoleLocalization.commands.contact.description
            },
            optimize: {
                f: () => {
                    if (localStorage.getItem('optimize') === "true") {
                        localStorage.setItem('optimize', 'false');
                        this.term.writeln(consoleLocalization.commands.optimize.optimizationDisable);
                    } else {
                        localStorage.setItem('optimize', 'true');
                        this.term.writeln(consoleLocalization.commands.optimize.optimizationEnable);
                    };
                    this.term.writeln("");

                    let i = 3;
                    setInterval(() => {
                        i -= 1;
                        this.term.writeln((i < 3 ? '\x1b[1A\x1b[2K' : "") + consoleLocalization.commands.optimize.restartIn.replace('<sec>', i));
                        if (i === 0) {
                            window.location.reload();
                        }
                    }, 1000);
                },
                description: consoleLocalization.commands.optimize.description,
                localstoraged: true
            },
            autoskip: {
                f: () => {
                    if (localStorage.getItem('autoskip') === "true") {
                        localStorage.setItem('autoskip', 'false');
                        this.term.writeln(consoleLocalization.commands.autoskip.autoskipDisable);
                    } else {
                        localStorage.setItem('autoskip', 'true');
                        this.term.writeln(consoleLocalization.commands.autoskip.autoskipEnable);
                    }
                    this.prompt();
                },
                description: consoleLocalization.commands.autoskip.description,
                localstoraged: true
            },
        };
    }

    runCommand(text) {
        this.command = text.trim().split(' ')[0];
        if (this.command.length > 0) {
            this.term.writeln('');
            if (this.command in this.commands) {
                this.commands[this.command].f();
                return;
            }
            this.term.writeln(`${this.command}: ${consoleLocalization.commandNotFound}`);
        }
        this.prompt();
    }

    switchConsole() {
        if (this.switchButtonClicked) return;
        if (this.consoleClosed)
            this.open()
        else
            this.close();

        this.consoleClosed = !this.consoleClosed;
        this.$els.indicator.classList.toggle('switch', this.consoleClosed);
        this.switchButtonClicked = true;
        this.$els.indicator.classList.add('disabled')
        setTimeout(() => {
            this.switchButtonClicked = false;
            this.$els.indicator.classList.remove('disabled')
        }, 1000);

        if (this.firstSwitch) this.onAppLoad();
        this.firstSwitch = false;
    }

    close() {
        // this.$els.preloader.style.opacity = "0";
        this.$els.preloader.classList.add('remove');
        gsap.to(this.$els.canvas_frame, {
            "--progress": 100,
            duration: 1,
            ease: "circ.out"
        });
    }

    open() {
        // this.$els.preloader.style.opacity = "1";
        this.$els.preloader.classList.remove('remove');
        gsap.to(this.$els.canvas_frame, {
            "--progress": 0,
            duration: .5,
            ease: "linear",
            onComplete: () => {
                // this?.onEndComplete();
            }
        });
    }
}

const formatProgress = (cols, message, perc) => {
    const progressBarLength = cols - message.length - 8; // 2 space, 100% - 4 max
    const filledSymbol = '#';
    const emptySymbol = '_';

    const filledCount = Math.round(progressBarLength * (perc / 100));
    const emptyCount = progressBarLength - filledCount;

    const progressBar = Array(filledCount).fill(filledSymbol).concat(Array(emptyCount).fill(emptySymbol)).join('');
    return message + " [" + progressBar + "] \x1b[32m" + perc + "%\x1b[0m";
};

const formatCenter = (cols, str, border) => {
    const maxLength = cols,
        padding = ((maxLength - str.replace(/\x1B\[\d+m/g, '').length - (border ? 2 : 0)) / 2),
        space = " ".repeat(padding > 0 ? padding : 0);
    return (border ? "│" : "") + space + str + space + (padding * 2 % 2 === 0 ? "" : " ") + (border ? "│" : "")
};

const formatMessage = (cols, name, description, localstoraged, padding) => {
    const maxLength = cols - padding - 3;
    let remaining = description;
    const d = [];
    while (remaining.length > 0) {
        // Trim any spaces left over from the previous line
        remaining = remaining.trimStart();
        // Check if the remaining text fits
        if (remaining.length < maxLength) {
            d.push(remaining);
            remaining = '';
        } else {
            let splitIndex = -1;
            // Check if the remaining line wraps already
            if (remaining[maxLength] === ' ') {
                splitIndex = maxLength;
            } else {
                // Find the last space to use as the split index
                for (let i = maxLength - 1; i >= 0; i--) {
                    if (remaining[i] === ' ') {
                        splitIndex = i;
                        break;
                    }
                }
            }
            d.push(remaining.substring(0, splitIndex));
            remaining = remaining.substring(splitIndex);
        }
    }
    const localStoragedStr = localstoraged ? `\x1b[0m[${(localStorage.getItem(name) || "false").replace("false", "\x1b[31mOFF").replace("true", "\x1b[32mON")}\x1b[0m]` : ""
    const message = (
        `  \x1b[35;1m${`${name} ${localStoragedStr}`.padEnd(padding + (localstoraged ? 13 : 0))}\x1b[0m ${d[0]}` +
        d.slice(1).map(e => `\r\n  ${' '.repeat(padding)} ${e}`)
    );
    return message;
};

// class BinaryAnimation {
//     constructor(params) {
//         this.el = params.el;
//         this.callback = params.callback;
//         this.duration = params.duration || params.el.getAttribute('data-binary-animation') || 1;
//         this.ease = 'easeInQuint';
//         this.code = this.encodeToBinary(this.el.innerHTML);
//         this.binaryDigits = this.code.split(" ");
//         this.length = this.code.split(" ").length
//         this.str = "";
//         this.el.innerHTML = this.binaryDigits.map(
//             (digit) => `<span class="ms">${digit !== " " ? digit : "&nbsp;"}</span>` // создаем новый массив span элементов
//         ).join(" ");
//         this.el.style.opacity = "1";
//         this.animate();
//     }

//     encodeToBinary(str, spaceSeparatedOctets) {
//         function zeroPad(num) {
//             return "00000000".slice(String(num).length) + num
//         };

//         return str.replace(/[\s\S]/g, function (str) {
//             str = zeroPad(str.charCodeAt().toString(2));
//             return !1 == spaceSeparatedOctets ? str : str + " "
//         })
//     }

//     decodeFromBinary(binary) {
//         binary = binary.replace(/ /g, ''); // удаляем все пробелы из двоичного кода
//         let text = '';
//         for (let i = 0; i < binary.length; i += 8) {
//             let charCode = parseInt(binary.substr(i, 8), 2);
//             text += String.fromCharCode(charCode);
//         }
//         return text;
//     }

//     animate() {
//         if (this.binaryDigits.length === 0) return this.callback(this);

//         this.binaryDigit = this.binaryDigits.shift(); // извлекаем первый элемент из массива
//         const characterCode = parseInt(this.binaryDigit, 2); // преобразуем двоичное число в десятичное число
//         const character = String.fromCharCode(characterCode); // получаем символ из таблицы ASCII
//         this.str += `<span class="nl">${character}</span>`;
//         this.el.innerHTML = this.str + "<br>" + this.binaryDigits.join(" ");
//         setTimeout(() => this.animate(), 1000 * this.duration / this.length);
//     }
// }


// new BinaryAnimation({
//     el: this.$els.binaryPreloaderItems[0],
//     callback: () => {
//         new BinaryAnimation({
//             el: this.$els.binaryPreloaderItems[1],
//             callback: () => {
//             }
//         });
//     }
// });