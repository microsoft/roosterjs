/**
 * A color object contains both light mode and dark mode color
 */
export interface ModeIndependentColor {
    /**
     * The color to be used in dark mode, if enabled.
     */
    darkModeColor: string;

    /**
     * The color to be used in light mode, or stored as the original color in dark mode.
     */
    lightModeColor: string;
}

/**
 * State for an entity. This is used for storing entity undo snapshot
 */
export interface EntityState {
    /**
     * Type of the entity
     */
    type: string;

    /**
     * Id of the entity
     */
    id: string;

    /**
     * The state of this entity to store into undo snapshot.
     * The state can be any string, or a serialized JSON object.
     * We are using string here instead of a JSON object to make sure the whole state is serializable.
     */
    state: string;
}

/**
 * A serializable snapshot of editor content, including the html content and metadata
 */
export interface Snapshot {
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
}

/**
 * Represent an interface to provide functionalities for Undo Snapshots
 */
export interface UndoSnapshotsService<T = string> {
    /**
     * Check whether can move current undo snapshot with the given step
     * @param step The step to check, can be positive, negative or 0
     * @returns True if can move current snapshot with the given step, otherwise false
     */
    canMove(step: number): boolean;

    /**
     * Move current snapshot with the given step if can move this step. Otherwise no action and return null
     * @param step The step to move
     * @returns If can move with the given step, returns the snapshot after move, otherwise null
     */
    move(step: number): T | null;

    /**
     * Add a new undo snapshot
     * @param snapshot The snapshot to add
     */
    addSnapshot(snapshot: T, isAutoCompleteSnapshot: boolean): void;

    /**
     * Clear all undo snapshots after the current one
     */
    clearRedo(): void;

    /**
     * Whether there is a snapshot added before auto complete and it can be undone now
     */
    canUndoAutoComplete(): boolean;
}

/**
 * The state object for UndoPlugin
 */
export interface ContentModelUndoPluginState {
    /**
     * Snapshot service for undo, it helps handle snapshot add, remove and retrieve
     */
    snapshotsService: UndoSnapshotsService<Snapshot>;

    /**
     * Whether restoring of undo snapshot is in progress.
     */
    isRestoring: boolean;

    /**
     * Whether there is new content change after last undo snapshot is taken
     */
    hasNewContent: boolean;

    /**
     * If addUndoSnapshot() is called nested in another one, this will be true
     */
    isNested: boolean;
}
