import TableSelection from './TableSelection';

/**
 * Represents normal selection
 */
export interface SelectionRangeExBase<T extends SelectionRangeTypes> {
    /**
     * Selection Type definition
     */
    type: T;

    /**
     * Ranges
     */
    ranges: Range[];

    /**
     * Whether all the ranges are collapsed
     */
    areAllCollapsed: boolean;
}

/**
 * Represents the selection made inside of a table.
 */
export interface TableSelectionRange
    extends SelectionRangeExBase<SelectionRangeTypes.TableSelection> {
    /**
     * Table that has cells selected
     */
    table: HTMLTableElement;
    /**
     * Coordinates of first and last Cell
     */
    coordinates: TableSelection;
}

/**
 * Represents normal selection
 */
export interface NormalSelectionRange extends SelectionRangeExBase<SelectionRangeTypes.Normal> {}

/**
 * Types of Selection Ranges that the SelectionRangeEx can return
 */
export enum SelectionRangeTypes {
    /**
     * Normal selection range provided by browser.
     */
    Normal,
    /**
     * Selection made inside of a single table.
     */
    TableSelection,
}

/**
 * Types of ranges used in editor api getSelectionRangeEx
 */
export type SelectionRangeEx = NormalSelectionRange | TableSelectionRange;
