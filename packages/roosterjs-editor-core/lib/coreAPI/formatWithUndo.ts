import EditorCore from '../editor/EditorCore';
import getLiveRange from '../coreAPI/getLiveRange';
import select from '../coreAPI/select';
import { SelectionRange } from 'roosterjs-editor-dom/lib';
import { ChangeSource, ContentChangedEvent, PluginEventType } from 'roosterjs-editor-types';
import triggerEvent from './triggerEvent';

export default function formatWithUndo(
    core: EditorCore,
    callback: () => void | Node,
    preserveSelection: boolean,
    changeSource: ChangeSource | string,
    dataCallback: () => any,
    skipAddingUndoAfterFormat: boolean
) {
    let isNested = core.suspendAddingUndoSnapshot;

    if (!isNested) {
        core.undo.addUndoSnapshot();
        core.suspendAddingUndoSnapshot = true;
    }

    try {
        if (callback) {
            if (preserveSelection) {
                let range = getLiveRange(core) || core.cachedRange;
                range = range && new SelectionRange(range).normalize().getRange();
                let fallbackNode = callback();
                if (!select(core, range) && fallbackNode) {
                    select(core, fallbackNode);
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
                triggerEvent(core, event, true /*broadcast*/);
            }
        }
    } finally {
        if (!isNested) {
            core.suspendAddingUndoSnapshot = false;
        }
    }
}
