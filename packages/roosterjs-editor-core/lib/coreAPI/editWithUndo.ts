import EditorCore, { EditWithUndo } from '../editor/EditorCore';
import { ChangeSource, ContentChangedEvent, PluginEventType } from 'roosterjs-editor-types';
import { Position } from 'roosterjs-editor-dom';

const editWithUndo: EditWithUndo = (
    core: EditorCore,
    callback: (start: Position, end: Position, snapshotBeforeCallback: string) => any,
    changeSource: ChangeSource | string
) => {
    let isNested = core.currentUndoSnapshot !== null;
    let data: any;

    if (!isNested) {
        core.currentUndoSnapshot = core.undo.addUndoSnapshot();
    }

    try {
        if (callback) {
            let range = core.api.getSelectionRange(core, true /*tryGetFromCache*/);
            data = callback(
                range && Position.getStart(range).normalize(),
                range && Position.getEnd(range).normalize(),
                core.currentUndoSnapshot
            );

            if (!isNested) {
                core.undo.addUndoSnapshot();
            }
        }
    } finally {
        if (!isNested) {
            core.currentUndoSnapshot = null;
        }
    }

    if (callback && changeSource) {
        let event: ContentChangedEvent = {
            eventType: PluginEventType.ContentChanged,
            source: changeSource,
            data: data,
        };
        core.api.triggerEvent(core, event, true /*broadcast*/);
    }
};

export default editWithUndo;
