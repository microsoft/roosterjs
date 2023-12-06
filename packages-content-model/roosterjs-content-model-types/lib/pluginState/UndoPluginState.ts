import type { ModeIndependentColor, UndoSnapshotsService } from 'roosterjs-editor-types';
import type { SelectionType } from '../selection/DOMSelection';
import type { EntityState } from '../parameter/FormatWithContentModelContext';

export interface UndoSnapshotBase<T extends SelectionType> {
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
     * Type of selection
     */
    type: T;
}

export interface RangeUndoSnapshot extends UndoSnapshotBase<'range'> {
    /**
     * Start path of selection
     */
    start: number[];

    /**
     * End path of selection
     */
    end: number[];
}

export interface TableUndoSnapshot extends UndoSnapshotBase<'table'> {
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

export interface ImageUndoSnapshot extends UndoSnapshotBase<'image'> {
    /* Id of selected image*/
    imageId: string;
}

export type UndoSnapshot = RangeUndoSnapshot | ImageUndoSnapshot | TableUndoSnapshot;

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
