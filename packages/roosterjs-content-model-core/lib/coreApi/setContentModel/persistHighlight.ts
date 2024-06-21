import type { DOMSelection, EditorCore } from 'roosterjs-content-model-types';

const SelectionClassName = '__persistedSelection';
/**
 * Shim class to pass TS interpreter if the TS version does not have context of Highlight API
 */
declare class Highlight {
    constructor(textRange: Range);
}

/**
 * Shim interface to pass TS interpreter if the TS version does not have context of Highlight API
 */
interface WindowWithHighlight extends Window {
    Highlight: typeof Highlight;
}

/**
 * Shim class for HighlightRegistry to pass TS interpreter
 */
interface HighlightRegistryWithMap extends HighlightRegistry {
    set(name: string, highlight: Highlight): void;
    delete(name: string): void;
}

interface HighlightRegistry {}

interface CSSShim {
    highlights: HighlightRegistry;
}

declare const CSS: CSSShim;

/**
 * @param win current window that Highlight is being used.
 * @returns boolean indicates if Highlight api is available
 */
function isHighlightRegistryWithMap(
    highlight: HighlightRegistry
): highlight is HighlightRegistryWithMap {
    return !!(highlight as HighlightRegistryWithMap).set;
}

/**
 * @param win current window that Highlight is being used.
 * @returns boolean indicates if Highlight api is available
 */
function isWindowWithHighlight(win: Window): win is WindowWithHighlight {
    return !!(win as WindowWithHighlight).Highlight;
}

/**
 * @internal
 * Persist highlight of a indicated selection object
 * @param core The editor core object
 * @param highlightSelection The flag indicate if the selection should be persisted
 * @param selection The selection object that needs to be persisted.
 */
export function persistHighlight(
    core: EditorCore,
    highlightSelection: boolean,
    selection: DOMSelection | null
) {
    const currentWindow = core.logicalRoot.ownerDocument.defaultView;

    if (
        currentWindow &&
        isWindowWithHighlight(currentWindow) &&
        isHighlightRegistryWithMap(CSS.highlights)
    ) {
        if (highlightSelection) {
            if (selection && selection.type == 'range') {
                const highlight = new currentWindow.Highlight(selection.range);
                CSS.highlights.set(SelectionClassName, highlight);
            }
        } else {
            CSS.highlights.delete(SelectionClassName);
        }
    }
}

export function canUseHighlight(win: Window): boolean {
    return isWindowWithHighlight(win);
}
