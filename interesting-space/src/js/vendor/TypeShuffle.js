import Splitting from 'splitting';
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
/**
 * Class representing one line
 */
class Line {
    // line position
    position = -1;
    // cells/chars
    cells = [];

    /**
     * Constructor.
     * @param {Element} DOM_el - the char element (<span>)
     */
    constructor(linePosition) {
        this.position = linePosition;
    }
}

/**
 * Class representing one cell/char
 */
class Cell {
    // DOM elements
    DOM = {
        // the char element (<span>)
        el: null,
    };
    // cell position
    position = -1;
    // previous cell position
    previousCellPosition = -1;
    // original innerHTML
    original;
    // current state/innerHTML
    state;
    color;
    originalColor;
    // cached values
    cache;

    /**
     * Constructor.
     * @param {Element} DOM_el - the char element (<span>)
     */
    constructor(DOM_el, {
        position,
        previousCellPosition
    } = {}) {
        this.DOM.el = DOM_el;
        this.original = this.DOM.el.innerHTML;
        this.state = this.original;
        this.color = this.originalColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text');
        this.position = position;
        this.previousCellPosition = previousCellPosition;
    }
    /**
     * @param {string} value
     */
    set(value) {
        this.state = value;
        this.DOM.el.innerHTML = this.state;
    }
}

/**
 * Class representing the TypeShuffle object
 */
export class TypeShuffle {
    // DOM elements
    DOM = {
        // the main text element
        el: null,
    };
    // array of Line objs
    lines = [];
    // array of letters and symbols
    lettersAndSymbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '!', '@', '#', '$', '&', '*', '(', ')', '-', '_', '+', '=', '/', '[', ']', '{', '}', ';', ':', '<', '>', ',', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    // effects and respective methods
    totalChars = 0;

    /**
     * Constructor.
     * @param {Element} DOM_el - main text element
     */
    constructor(DOM_el) {
        this.DOM.el = DOM_el;
        // Apply Splitting (two times to have lines, words and chars)
        const results = Splitting({
            target: this.DOM.el,
            by: 'lines'
        })
        results.forEach(s => Splitting({ target: s.words }));

        // for every line
        for (const [linePosition, lineArr] of results[0].lines.entries()) {
            // create a new Line
            const line = new Line(linePosition);
            let cells = [];
            let charCount = 0;
            // for every word of each line
            for (const word of lineArr) {
                // for every character of each line
                for (const char of word.querySelectorAll('.char')) {
                    cells.push(
                        new Cell(char, {
                            position: charCount,
                            previousCellPosition: charCount === 0 ? -1 : charCount - 1
                        })
                    );
                    ++charCount;
                }
            }
            line.cells = cells;
            this.lines.push(line);
            this.totalChars += charCount;
        }

        // TODO
        // window.addEventListener('resize', () => this.resize());
    }
    /**
     * clear all the cells chars
     */
    clearCells() {
        for (const line of this.lines) {
            for (const cell of line.cells) {
                cell.set('&nbsp;');
            }
        }
    }
    /**
     * 
     * @returns {string} a random char from this.lettersAndSymbols
     */
    getRandomChar() {
        return this.lettersAndSymbols[Math.floor(Math.random() * this.lettersAndSymbols.length)];
    }
    fx() {
        return new Promise((resolve) => {
            // max iterations for each cell to change the current value
            const MAX_CELL_ITERATIONS = 4;
            let finished = 0;
            const loop = (line, cell, iteration = 0) => {
                cell.cache = { 'state': cell.state, 'color': cell.color };

                if (iteration === MAX_CELL_ITERATIONS - 1) {
                    cell.set(cell.original);

                    cell.color = cell.originalColor;
                    cell.DOM.el.style.color = cell.color;

                    ++finished;
                    if (finished === this.totalChars) {
                        this.isAnimating = false;
                        resolve()
                    }
                }
                else {
                    cell.set(this.getRandomChar());

                    cell.color = ['#b591fc', '#423855', '#ea91a8', '#f0d1a6'][Math.floor(Math.random() * 4)]
                    cell.DOM.el.style.color = cell.color
                }

                ++iteration;
                if (iteration < MAX_CELL_ITERATIONS) {
                    setTimeout(() => loop(line, cell, iteration), randomNumber(30, 110));
                }
            };

            for (const line of this.lines) {
                for (const cell of line.cells) {
                    setTimeout(() => loop(line, cell), (line.position + 1) * 80);
                }
            }
        })
    }
    trigger() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        return this.fx();
    }
}