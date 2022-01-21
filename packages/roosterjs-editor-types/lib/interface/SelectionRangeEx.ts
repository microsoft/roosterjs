import IVTable from './IVTable';

/**
 * Represents the selection made inside of a table.
 */
export interface ITableSelectionRange
    extends ISelectionRangeEx<SelectionRangeTypes.TableSelection> {
    vTable: IVTable;
}

/**
 * Represents normal selection
 */
export interface INormalSelectionRange extends ISelectionRangeEx<SelectionRangeTypes.Normal> {}

/**
 * Represents normal selection
 */
export interface ISelectionRangeEx<T> {
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
 * Types of Selection Ranges that the SelectionRangeEx can return
 */
export const enum SelectionRangeTypes {
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
export type SelectionRangeEx = INormalSelectionRange | ITableSelectionRange;
