import TableSelection from './TableSelection';
import { SelectionRangeTypes } from '../enum/SelectionRangeTypes';
import type { CompatibleSelectionRangeTypes } from '../compatibleEnum/SelectionRangeTypes';

/**
 * Represents normal selection
 */
export interface SelectionRangeExBase<
    T extends SelectionRangeTypes | CompatibleSelectionRangeTypes
> {
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
    extends SelectionRangeExBase<
        SelectionRangeTypes.TableSelection | CompatibleSelectionRangeTypes.TableSelection
    > {
    /**
     * Table that has cells selected
     */
    table: HTMLTableElement;
    /**
     * Coordinates of first and last Cell
     */
    coordinates: TableSelection | undefined;
}

/**
 * Represents a selected image.
 */
export interface ImageSelectionRange
    extends SelectionRangeExBase<
        SelectionRangeTypes.ImageSelection | CompatibleSelectionRangeTypes.ImageSelection
    > {
    /**
     * Selected Image
     */
    image: HTMLImageElement;
}

/**
 * Represents normal selection
 */
export interface NormalSelectionRange
    extends SelectionRangeExBase<
        SelectionRangeTypes.Normal | CompatibleSelectionRangeTypes.Normal
    > {}

/**
 * Types of ranges used in editor api getSelectionRangeEx
 */
export type SelectionRangeEx = NormalSelectionRange | TableSelectionRange | ImageSelectionRange;
