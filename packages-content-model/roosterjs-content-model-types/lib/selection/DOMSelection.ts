/**
 * Type of DOM selection, it can be one of the 3 below:
 * range: A regular selection that can be represented by a DOM Range object with start and end container and offset
 * table: A table selection that can be defined using the Table element and first/last row and column number. Table selection can
 * cover multiple table cells, it does not need to be continuous, but it should be a rectangle
 * image: A image selection that can be defined with an image element. Not like a regular range selection with an image, image selection
 * is created when user single click the image, then we will show a selection border rather the blue background to show the selection
 */
export type SelectionType = 'range' | 'table' | 'image';

/**
 * Base type of Selection
 */
export interface SelectionBase<T extends SelectionType> {
    /**
     * Type of this selection
     */
    type: T;
}

/**
 * A regular selection that can be represented by a DOM Range object with start and end container and offset
 */
export interface RangeSelection extends SelectionBase<'range'> {
    /**
     * The DOM Range of this selection
     */
    range: Range;
}

/**
 * image: A image selection that can be defined with an image element. Not like a regular range selection with an image, image selection
 * is created when user single click the image, then we will show a selection border rather the blue background to show the selection
 */
export interface ImageSelection extends SelectionBase<'image'> {
    /**
     * The image that this selection is representing
     */
    image: HTMLImageElement;
}

/**
 * A table selection that can be defined using the Table element and first/last row and column number. Table selection can
 * cover multiple table cells, it does not need to be continuous, but it should be a rectangle
 */
export interface TableSelection extends SelectionBase<'table'> {
    /**
     * The table that this selection is representing
     */
    table: HTMLTableElement;

    /**
     * Number of first selected row
     */
    firstRow: number;

    /**
     * Number of last selected row
     */
    lastRow: number;

    /**
     * Number of first selected column
     */
    firstColumn: number;

    /**
     * Number of last selected column
     */
    lastColumn: number;
}

/**
 * The union type of 3 selection types
 */
export type DOMSelection = RangeSelection | ImageSelection | TableSelection;
