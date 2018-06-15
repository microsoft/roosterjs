import EditorCore, { EditWithUndo } from '../editor/EditorCore';
import { ChangeSource, ContentChangedEvent, PluginEventType } from 'roosterjs-editor-types';
import { Position, SelectionRange } from 'roosterjs-editor-dom';

const editWithUndo: EditWithUndo = (
    core: EditorCore,
    callback: (start: Position, end: Position) => any,
    changeSource: ChangeSource | string,
    addUndoSnapshotBeforeAction: boolean
) => {
    let isNested = core.suspendUndo;
    core.suspendUndo = true;

    if (!isNested && addUndoSnapshotBeforeAction) {
        core.undo.addUndoSnapshot();
    }

    try {
        if (callback) {
            let range = core.api.getSelectionRange(core, true /*tryGetFromCache*/);
            let selectionRange = range && new SelectionRange(range).normalize();
            let data = selectionRange ? callback(selectionRange.start, selectionRange.end) : callback(null, null);

            if (!isNested) {
                core.undo.addUndoSnapshot();
            }

            if (changeSource) {
                let event: ContentChangedEvent = {
                    eventType: PluginEventType.ContentChanged,
                    source: changeSource,
                    data: data,
                };
                core.api.triggerEvent(core, event, true /*broadcast*/);
            }
        }
    } finally {
        if (!isNested) {
            core.suspendUndo = false;
        }
    }
};

export default editWithUndo;
