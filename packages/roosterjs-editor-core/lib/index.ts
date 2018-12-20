export { default as CorePlugin } from './editor/CorePlugin';
export { default as Editor } from './editor/Editor';
export {
    default as EditorCore,
    CoreApiMap,
    AttachDomEvent,
    EditWithUndo,
    Focus,
    GetCustomData,
    GetSelectionRange,
    HasFocus,
    InsertNode,
    Select,
    TriggerEvent,
} from './editor/EditorCore';
export { default as EditorOptions } from './editor/EditorOptions';
export { default as EditorPlugin } from './editor/EditorPlugin';
export { default as Undo } from './undo/Undo';
export { default as UndoSnapshotsService } from './undo/UndoSnapshots';
export { default as UndoService } from './editor/UndoService';
export { default as browserData, BrowserData } from './deprecated/BrowserData';
export { default as cacheGetEventData } from './eventApi/cacheGetEventData';
export { default as clearEventDataCache } from './eventApi/clearEventDataCache';
export {
    cacheGetContentSearcher,
    clearContentSearcherCache,
} from './eventApi/cacheGetContentSearcher';
export { default as cacheGetElementAtCursor } from './eventApi/cacheGetElementAtCursor';

export { buildSnapshot, restoreSnapshot } from './deprecated/snapshotUtils';
