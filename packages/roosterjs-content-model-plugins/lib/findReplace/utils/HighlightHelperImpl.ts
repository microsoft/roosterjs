import type { HighlightHelper } from '../types/HighlightHelper';

interface HighlightRegistry {}

interface CSSShim {
    highlights: HighlightRegistry;
}

declare class Highlight {
    constructor(...textRange: Range[]);
    clear: () => void;
    add: (range: Range) => void;
}

interface WindowWithHighlight extends Window {
    Highlight: typeof Highlight;
    CSS: CSSShim;
}

interface HighlightRegistryWithMap extends HighlightRegistry {
    set(name: string, highlight: Highlight): void;
    delete(name: string): void;
}

function isWindowWithHighlight(win: Window): win is WindowWithHighlight {
    return (
        typeof (win as WindowWithHighlight).Highlight === 'function' &&
        typeof (win as WindowWithHighlight).CSS === 'object'
    );
}

function isHighlightRegistryWithMap(
    highlight: HighlightRegistry
): highlight is HighlightRegistryWithMap {
    return typeof (highlight as HighlightRegistryWithMap).set === 'function';
}

class HighlightHelperImpl implements HighlightHelper {
    private highlight: Highlight | undefined;
    private highlights: HighlightRegistryWithMap | undefined;

    constructor(private styleKey: string) {}

    initialize(win: Window) {
        if (isWindowWithHighlight(win) && isHighlightRegistryWithMap(win.CSS.highlights)) {
            this.highlights = win.CSS.highlights;
            this.highlight = new win.Highlight();

            this.highlights.set(this.styleKey, this.highlight);
        }
    }

    dispose() {
        this.highlights?.delete(this.styleKey);
        this.highlight?.clear();
        this.highlight = undefined;
        this.highlights = undefined;
    }

    addRanges(ranges: Range[]) {
        if (this.highlight) {
            for (const range of ranges) {
                this.highlight.add(range);
            }
        }
    }

    clear() {
        this.highlight?.clear();
    }
}

/**
 * @internal
 * Create a HighlightHelper instance. A highlight helper manages the highlights in the editor
 * @param win The window object
 * @param styleKey The style key for the highlight
 * @returns The created HighlightHelper instance or undefined if the window does not support highlights
 */
export function createHighlightHelper(styleKey: string): HighlightHelper {
    return new HighlightHelperImpl(styleKey);
}
