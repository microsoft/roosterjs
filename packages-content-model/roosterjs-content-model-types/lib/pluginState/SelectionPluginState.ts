import type { ImageSelectionRange, TableSelectionRange } from 'roosterjs-editor-types';

/**
 * The state object for SelectionPlugin
 */
export interface SelectionPluginState {
    /**
     * Cached selection range
     */
    selectionRange: Range | null;

    /**
     * Table selection range
     */
    tableSelectionRange: TableSelectionRange | null;

    /**
     * Image selection range
     */
    imageSelectionRange: ImageSelectionRange | null;

    /**
     * A style node in current document to help implement image and table selection
     */
    selectionStyleNode: HTMLStyleElement | null;

    /**
     * When set to true, onFocus event will not trigger reselect cached range
     */
    skipReselectOnFocus?: boolean;

    /**
     * Color of the border of a selectedImage. Default color: '#DB626C'
     */
    imageSelectionBorderColor?: string;
}
