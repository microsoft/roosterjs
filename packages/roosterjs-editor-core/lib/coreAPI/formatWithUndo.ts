import EditorCore, { FormatWithUndo } from '../editor/EditorCore';
import { SelectionRange } from 'roosterjs-editor-dom/lib';
import { ChangeSource, ContentChangedEvent, PluginEventType } from 'roosterjs-editor-types';

const formatWithUndo: FormatWithUndo = (
    core: EditorCore,
    callback: () => void | Node,
    preserveSelection: boolean,
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
            if (preserveSelection) {
                let range = core.api.getLiveRange(core) || core.cachedRange;
                range = range && new SelectionRange(range).normalize().getRange();
                let fallbackNode = callback();
                if (!core.api.select(core, range) && fallbackNode) {
                    core.api.select(core, fallbackNode);
                }
            } else {
                callback();
            }

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

export default formatWithUndo;
