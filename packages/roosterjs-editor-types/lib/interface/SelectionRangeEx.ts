import TableSelection from './TableSelection';
import { SelectionRangeTypes } from '../enum/SelectionRangeTypes';

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
 * Types of ranges used in editor api getSelectionRangeEx
 */
export type SelectionRangeEx = NormalSelectionRange | TableSelectionRange;
