import { SelectionRangeEx } from 'roosterjs-editor-types';

/**
 * Represents the selection information of content used by DOM to Content Model conversion
 */
export interface DomToModelSelectionContext {
    /**
     * Is current context under a selection
     */
    isInSelection?: boolean;

    /**
     * Current selection range
     */
    rangeEx?: SelectionRangeEx;

    /**
     * Root not that contains the selection.
     * For regular selection, it is the common ancestor container of selection range.
     * For table selection, it is the table node.
     * For image selection, it is the image node.
     * Otherwise, it is undefined.
     */
    selectionRootNode?: Node;
}
