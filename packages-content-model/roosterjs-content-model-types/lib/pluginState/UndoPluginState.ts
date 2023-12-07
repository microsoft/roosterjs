import type { ModeIndependentColor, UndoSnapshotsService } from 'roosterjs-editor-types';
import type { SelectionType } from '../selection/DOMSelection';
import type { EntityState } from '../parameter/FormatWithContentModelContext';

/**
 * Base interface for selection info inside an Undo Snapshot
 */
export interface UndoSnapshotSelectionBase<T extends SelectionType> {
    /**
     * Type of selection
     */
    type: T;
}

/**
 * Undo snapshot selection for range
 */
export interface RangeSnapshotSelection extends UndoSnapshotSelectionBase<'range'> {
    /**
     * Start path of selection
     */
    start: number[];

    /**
     * End path of selection
     */
    end: number[];
}

/**
 * Undo snapshot selection from table
 */
export interface TableSnapshotSelection extends UndoSnapshotSelectionBase<'table'> {
    /**
     * Id of selected table
     */
    tableId: string;

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
 * Undo snapshot selection for image
 */
export interface ImageSnapshotSelection extends UndoSnapshotSelectionBase<'image'> {
    /* Id of selected image*/
    imageId: string;
}

/**
 * Union type for all 3 selection types for Undo Snapshot
 */
export type UndoSnapshotSelection =
    | RangeSnapshotSelection
    | TableSnapshotSelection
    | ImageSnapshotSelection;

/**
 * Represents an undo snapshot
 */
export interface UndoSnapshot {
    /**
     * HTML content string
     */
    html: string;

    /**
     * Known colors for dark mode
     */
    knownColors: Readonly<ModeIndependentColor>[];

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
    selection?: UndoSnapshotSelection;
}

/**
 * The state object for UndoPlugin
 */
export interface UndoPluginState {
    /**
     * Snapshot service for undo, it helps handle snapshot add, remove and retrieve
     */
    snapshotsService: UndoSnapshotsService<UndoSnapshot>;

    /**
     * Whether restoring of undo snapshot is in progress.
     */
    isRestoring: boolean;

    /**
     * Whether there is new content change after last undo snapshot is taken
     */
    hasNewContent: boolean;

    /**
     * If addUndoSnapshot() or formatContentModel() is called nested in another one, this will be true
     */
    isNested: boolean;

    /**
     * Container after last auto complete. Undo autoComplete only works if the current position matches this one
     */
    posContainer: Node | null;

    /**
     * Offset after last auto complete. Undo autoComplete only works if the current position matches this one
     */
    posOffset: number | null;
}
