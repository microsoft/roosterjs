import ContextMenuProvider from '../interface/ContextMenuProvider';
import { ImageSelectionRange, TableSelectionRange } from '../interface/SelectionRangeEx';

/**
 * The state object for DOMEventPlugin
 */
export default interface DOMEventPluginState {
    /**
     * Whether editor is in IME input sequence
     */
    isInIME: boolean;

    /**
     * Scroll container of editor
     */
    scrollContainer: HTMLElement;

    /**
     * Cached selection range
     */
    selectionRange: Range | null;

    /**
     * Table selection range
     */
    tableSelectionRange: TableSelectionRange | null;

    /**
     * stop propagation of a printable keyboard event
     */
    stopPrintableKeyboardEventPropagation: boolean;

    /**
     * Context menu providers, that can provide context menu items
     */
    contextMenuProviders: ContextMenuProvider<any>[];

    /**
     * Image selection range
     */
    imageSelectionRange: ImageSelectionRange | null;
}
