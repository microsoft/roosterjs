import { Coordinates } from 'roosterjs-editor-types';

/**
 * Represents a regular selection for DOM to Content Model conversion
 */
export interface DomToModelRegularSelection {
    /**
     * Is the selection collapsed
     */
    isSelectionCollapsed?: boolean;

    /**
     * Start container of this selection
     */
    startContainer?: Node;

    /**
     * End container of this selection
     */
    endContainer?: Node;

    /**
     * Start offset of this selection
     */
    startOffset?: number;

    /**
     * End offset of this selection
     */
    endOffset?: number;
}

/**
 * Represents a table for DOM to Content Model conversion
 */
export interface DomToModelTableSelection {
    /**
     * Table where selection is located
     */
    table: HTMLTableElement;

    /**
     * Coordinate of first selected cell
     */
    firstCell: Coordinates;

    /**
     * Coordinate of last selected cell
     */
    lastCell: Coordinates;
}

/**
 * Represents an image for DOM to Content Model conversion
 */
export interface DomToModelImageSelection {
    /**
     * Selected image
     */
    image: HTMLImageElement;
}

/**
 * Represents the selection information of content used by DOM to Content Model conversion
 */
export interface DomToModelSelectionContext {
    /**
     * Is current context under a selection
     */
    isInSelection: boolean;

    /**
     * Regular selection (selection with a highlight background provided by browser)
     */
    regularSelection?: DomToModelRegularSelection;

    /**
     * Table selection provided by editor
     */
    tableSelection?: DomToModelTableSelection;

    /**
     * Image selection provided by editor
     */
    imageSelection?: DomToModelImageSelection;

    /**
     * Root not that contains the selection.
     * For regular selection, it is the common ancestor container of selection range.
     * For table selection, it is the table node.
     * For image selection, it is the image node.
     * Otherwise, it is undefined.
     */
    selectionRootNode?: Node;
}
