import Scrollbar, { ScrollbarPlugin } from 'smooth-scrollbar';

class FilterEventPlugin extends ScrollbarPlugin {
    static pluginName = 'filterEvent';

    static defaultOptions = {
        blacklist: [],
    };

    transformDelta(delta, fromEvent) {
        if (this.shouldBlockEvent(fromEvent)) {
            return { x: 0, y: 0 };
        }

        return delta;
    }

    shouldBlockEvent(fromEvent) {
        return this.options.blacklist.some(rule => fromEvent.type.match(rule));
    }
}

export default FilterEventPlugin