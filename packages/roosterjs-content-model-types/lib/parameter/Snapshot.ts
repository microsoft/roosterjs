import type { TableSelectionCoordinates } from '../selection/TableSelectionCoordinates';
import type { EntityState } from './FormatContentModelContext';
import type { SelectionType } from '../selection/DOMSelection';

/**
 * Base interface for selection info inside an Undo Snapshot
 */
export interface SnapshotSelectionBase<T extends SelectionType> {
    /**
     * Type of selection
     */
    type: T;
}

/**
 * Undo snapshot selection for range
 */
export interface RangeSnapshotSelection extends SnapshotSelectionBase<'range'> {
    /**
     * Start path of selection
     */
    start: number[];

    /**
     * End path of selection
     */
    end: number[];

    /**
     * Whether the selection was from left to right (in document order) or
     * right to left (reverse of document order)
     */
    isReverted: boolean;
}

/**
 * Undo snapshot selection from table
 */
export interface TableSnapshotSelection
    extends TableSelectionCoordinates,
        SnapshotSelectionBase<'table'> {
    /**
     * Id of selected table
     */
    tableId: string;
}

/**
 * Undo snapshot selection for image
 */
export interface ImageSnapshotSelection extends SnapshotSelectionBase<'image'> {
    /* Id of selected image*/
    imageId: string;
}

/**
 * Union type for all 3 selection types for Undo Snapshot
 */
export type SnapshotSelection =
    | RangeSnapshotSelection
    | TableSnapshotSelection
    | ImageSnapshotSelection;

/**
 * Represents an undo snapshot
 */
export interface Snapshot {
    /**
     * HTML content string
     */
    html: string;

    /**
     * Entity states related to this undo snapshots. When undo/redo to this snapshot, each entity state will trigger
     * an EntityOperation event with operation = EntityOperation.UpdateEntityState
     */
    entityStates?: EntityState[];

    /**
     * Whether this snapshot was taken from dark mode
     */
    isDarkMode: boolean;

    /**
     * Selection of this snapshot
     */
    selection?: SnapshotSelection;

    /**
     * Path to logical root from physical at the time of snapshot
     */
    logicalRootPath: number[];
}

/**
 * Represents a data structure of snapshots, this is usually used for undo snapshots
 */
export interface Snapshots {
    /**
     * The snapshot array
     */
    snapshots: Snapshot[];

    /**
     * Size of all snapshots
     */
    totalSize: number;

    /**
     * Current index
     */
    currentIndex: number;

    /**
     * Index of snapshot added before an auto complete action
     */
    autoCompleteIndex: number;

    /**
     * An optional callback to be invoked when snapshots are changed
     */
    onChanged?: (type: 'add' | 'move' | 'clear') => void;

    /**
     * Max size of all snapshots
     */
    readonly maxSize: number;
}
