import { Position } from 'roosterjs-editor-dom';
import {
    AddUndoSnapshot,
    ChangeSource,
    ContentChangedEvent,
    EditorCore,
    NodePosition,
    PluginEventType,
    GetContentMode,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Call an editing callback with adding undo snapshots around, and trigger a ContentChanged event if change source is specified.
 * Undo snapshot will not be added if this call is nested inside another addUndoSnapshot() call.
 * @param core The EditorCore object
 * @param callback The editing callback, accepting current selection start and end position, returns an optional object used as the data field of ContentChangedEvent.
 * @param changeSource The ChangeSource string of ContentChangedEvent. @default ChangeSource.Format. Set to null to avoid triggering ContentChangedEvent
 * @param canUndoByBackspace True if this action can be undone when user press Backspace key (aka Auto Complelte).
 */
export const addUndoSnapshot: AddUndoSnapshot = (
    core: EditorCore,
    callback: (start: NodePosition, end: NodePosition) => any,
    changeSource: ChangeSource | string,
    canUndoByBackspace: boolean
) => {
    const undoState = core.undo.value;
    let isNested = undoState.isNested;
    let data: any;

    if (!isNested) {
        undoState.isNested = true;
        undoState.snapshotsService.addSnapshot(
            core.api.getContent(core, GetContentMode.RawHTMLWithSelection),
            canUndoByBackspace
        );
        undoState.hasNewContent = false;
    }

    try {
        if (callback) {
            let range = core.api.getSelectionRange(core, true /*tryGetFromCache*/);
            data = callback(
                range && Position.getStart(range).normalize(),
                range && Position.getEnd(range).normalize()
            );

            if (!isNested) {
                undoState.snapshotsService.addSnapshot(
                    core.api.getContent(core, GetContentMode.RawHTMLWithSelection),
                    false /*isAutoCompleteSnapshot*/
                );
                undoState.hasNewContent = false;
            }
        }
    } finally {
        if (!isNested) {
            undoState.isNested = false;
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

    if (canUndoByBackspace) {
        const range = core.api.getSelectionRange(core, false /*tryGetFromCache*/);

        if (range) {
            core.undo.value.hasNewContent = false;
            core.undo.value.autoCompletePosition = Position.getStart(range);
        }
    }
};
