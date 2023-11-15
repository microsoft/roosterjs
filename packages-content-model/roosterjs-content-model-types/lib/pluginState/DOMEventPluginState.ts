import type {
    ContextMenuProvider,
    ImageSelectionRange,
    TableSelectionRange,
} from 'roosterjs-editor-types';

/**
 * The state object for DOMEventPlugin
 */
export interface DOMEventPluginState {
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
     * Context menu providers, that can provide context menu items
     */
    contextMenuProviders: ContextMenuProvider<any>[];

    /**
     * Image selection range
     */
    imageSelectionRange: ImageSelectionRange | null;

    /**
     * When set to true, onFocus event will not trigger reselect cached range
     */
    skipReselectOnFocus?: boolean;

    /**
     * Whether mouse up event handler is added
     */
    mouseUpEventListerAdded: boolean;

    /**
     * X-coordinate when mouse down happens
     */
    mouseDownX: number | null;

    /**
     * X-coordinate when mouse down happens
     */
    mouseDownY: number | null;
}
