/**
 * Represents the selection made inside of a table.
 */
export interface ITableSelectionRange extends ISelectionRangeEx {
    /**
     * Selection Type definition
     */
    type: SelectionRangeTypes.VSelection;

    /**
     * Whether the selection is collapsed
     */
    isCollapsed: () => boolean;

    /**
     * Ranges
     */
    ranges: Range[];
}

/**
 * Represents normal selection
 */
export interface INormalSelectionRange extends ISelectionRangeEx {
    /**
     * Selection Type definition
     */
    type: SelectionRangeTypes.Normal;

    /**
     * Whether the selection is collapsed
     */
    isCollapsed: () => boolean;

    /**
     * Ranges
     */
    ranges: Range[];
}

/**
 * Represents normal selection
 */
export interface ISelectionRangeEx {
    /**
     * Selection Type definition
     */
    type: SelectionRangeTypes;

    /**
     * Whether the selection is collapsed
     */
    isCollapsed: () => boolean;

    /**
     * Ranges
     */
    ranges: Range[];
}

export const enum SelectionRangeTypes {
    Normal,
    VSelection,
}

export type SelectionRangeEx = INormalSelectionRange | ITableSelectionRange;
