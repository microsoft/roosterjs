import EditorCore, { EditWithUndo } from '../editor/EditorCore';
import { ChangeSource, ContentChangedEvent, PluginEventType } from 'roosterjs-editor-types';
import { Position, SelectionRange } from 'roosterjs-editor-dom';

const editWithUndo: EditWithUndo = (
    core: EditorCore,
    callback: (start: Position, end: Position) => any,
    changeSource: ChangeSource | string
) => {
    let isNested = core.suspendUndo;

    if (!isNested) {
        core.undo.addUndoSnapshot();
        core.suspendUndo = true;
    }

    try {
        if (callback) {
            let range = new SelectionRange(core.api.getSelectionRange(core, true /*tryGetFromCache*/)).normalize();
            let data = callback(range.start, range.end);

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
