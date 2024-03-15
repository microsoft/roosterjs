import type { ParsedTable } from '../parameter/ParsedTable';
import type { DOMSelection } from '../selection/DOMSelection';

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
     * Coordinate for first selected table cell
     */
    firstCo: [number, number];

    /**
     * Coordinate for last selected table cell
     */
    lastCo?: [number, number];
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
}
