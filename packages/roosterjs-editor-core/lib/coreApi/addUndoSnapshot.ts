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
    callback: (start: NodePosition, end: NodePosition, snapshotBeforeCallback: string) => any,
    changeSource: ChangeSource | string,
    canUndoByBackspace: boolean
) => {
    const undoState = core.undo.value;
    let isNested = undoState.outerUndoSnapshot !== null;
    let data: any;

    if (!isNested) {
        undoState.outerUndoSnapshot = core.api.getContent(
            core,
            GetContentMode.RawHTMLWithSelection
        );
        undoState.snapshotsService.addSnapshot(undoState.outerUndoSnapshot);
        undoState.hasNewContent = false;
    }

    const autoCompleteSnapshot = canUndoByBackspace && undoState.outerUndoSnapshot;

    try {
        if (callback) {
            let range = core.api.getSelectionRange(core, true /*tryGetFromCache*/);
            data = callback(
                range && Position.getStart(range).normalize(),
                range && Position.getEnd(range).normalize(),
                undoState.outerUndoSnapshot
            );

            if (!isNested) {
                undoState.snapshotsService.addSnapshot(
                    core.api.getContent(core, GetContentMode.RawHTMLWithSelection)
                );
                undoState.hasNewContent = false;
            }
        }
    } finally {
        if (!isNested) {
            undoState.outerUndoSnapshot = null;
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
        // Need to set this snapshot after ContentChangedEvent is fired to avoid it is cleared by event handler in AutoCompletePlugin
        core.autoComplete.value = autoCompleteSnapshot;
    }
};
