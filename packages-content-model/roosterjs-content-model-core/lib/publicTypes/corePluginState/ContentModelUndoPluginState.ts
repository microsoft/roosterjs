import type { ContentModelDocument, EntityState } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export interface UndoSnapshot {
    contentModel: ContentModelDocument;
    entityStates?: EntityState[];
    canUndoByBackspace?: boolean;
}

/**
 * @internal
 * The state object for UndoPlugin
 */
export interface ContentModelUndoPluginState {
    /**
     * Snapshot Content Model array
     */
    snapshots: UndoSnapshot[];

    /**
     * Current snapshot index
     */
    currentIndex: number;

    /**
     * Whether there is new content change after last undo snapshot is taken
     */
    hasNewContent: boolean;

    /**
     * If addUndoSnapshot() is called nested in another one, this will be true
     */
    isNested: boolean;

    /**
     * Selection range for auto complete.
     * When there is "Undo auto complete" allowed, check if current selection range equals to this range,
     * then we can undo an auto complete when user presses Backspace
     */
    autoCompleteRange: Range | null;
}
