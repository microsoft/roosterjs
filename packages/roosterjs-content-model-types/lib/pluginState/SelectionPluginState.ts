import type { ParsedTable } from '../parameter/ParsedTable';
import type { DOMSelection } from '../selection/DOMSelection';

/**
 * Logical coordinate of a table cell
 */
export interface TableCellCoordinate {
    /**
     * Row index
     */
    row: number;

    /**
     * Column index
     */
    col: number;
}

/**
 * Table selection internal info for SelectionPlugin
 */
export interface TableSelectionInfo {
    /**
     * Selected table
     */
    table: HTMLTableElement;

    /**
     * Parsed table structure, cache this value to avoid calculating again while selecting table
     */
    parsedTable: ParsedTable;

    /**
     * The node where the focus is at when start selection
     */
    startNode: Node;

    /**
     * Coordinate for first selected table cell
     */
    firstCo: TableCellCoordinate;

    /**
     * Coordinate for last selected table cell
     */
    lastCo?: TableCellCoordinate;
}

/**
 * The state object for SelectionPlugin
 */
export interface SelectionPluginState {
    /**
     * Cached selection range
     */
    selection: DOMSelection | null;

    /**
     * Table selection internal info for SelectionPlugin
     */
    tableSelection: TableSelectionInfo | null;

    /**
     * Disposer function for MouseMove event
     */
    mouseDisposer?: () => void;

    /**
     * When set to true, onFocus event will not trigger reselect cached range
     */
    skipReselectOnFocus?: boolean;

    /**
     * Color of the border of a selectedImage. Default color: '#DB626C'
     */
    imageSelectionBorderColor?: string;

    /**
     * Background color of a selected table cell. Default color: '#C6C6C6'
     */
    tableCellSelectionBackgroundColor?: string;
}
