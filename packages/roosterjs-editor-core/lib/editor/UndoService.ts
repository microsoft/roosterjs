import EditorPlugin from './EditorPlugin';

/**
 * Defines replaceable undo service for editor
 */
interface UndoService extends EditorPlugin {
    /**
     * Undo last change if any
     */
    undo: () => void;

    /**
     * Redo next change if any
     */
    redo: () => void;

    /**
     * Add an undo snapshot for current content inside editor
     * This method will not trigger ExtractContent event, so any temporary content will be
     * added into undo snapshot
     */
    addUndoSnapshot: () => string;

    /**
     * Whether there is snapshot for undo
     */
    canUndo: () => boolean;

    /**
     * Whether there is snapshot for redo
     */
    canRedo: () => boolean;

    /**
     * Clear all existing undo snapshots
     */
    clear: () => void;
}

export default UndoService;
