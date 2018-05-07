import EditorCore, { RunWithUndo } from '../editor/EditorCore';
import { ChangeSource, ContentChangedEvent, PluginEventType } from 'roosterjs-editor-types';

const runWithUndo: RunWithUndo = (
    core: EditorCore,
    callback: () => void,
    changeSource: ChangeSource | string,
    dataCallback: () => any,
    skipAddingUndoAfterFormat: boolean
) => {
    let isNested = core.suspendAddingUndoSnapshot;

    if (!isNested) {
        core.undo.addUndoSnapshot();
        core.suspendAddingUndoSnapshot = true;
    }

    try {
        if (callback) {
            callback();
            if (!isNested && !skipAddingUndoAfterFormat) {
                core.undo.addUndoSnapshot();
            }

            if (!isNested && changeSource) {
                let event: ContentChangedEvent = {
                    eventType: PluginEventType.ContentChanged,
                    source: changeSource,
                    data: dataCallback ? dataCallback() : null,
                };
                core.api.triggerEvent(core, event, true /*broadcast*/);
            }
        }
    } finally {
        if (!isNested) {
            core.suspendAddingUndoSnapshot = false;
        }
    }
};

export default runWithUndo;
