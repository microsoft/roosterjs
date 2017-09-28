import EditorPlugin from './EditorPlugin';

// This defines replaceable undo service for editor
interface UndoService extends EditorPlugin {
    undo: () => void;
    redo: () => void;
    addUndoSnapshot?: () => void;
    canUndo?: () => boolean;
    canRedo?: () => boolean;
    clear?: () => void;
}

export default UndoService;
