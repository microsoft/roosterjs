import EditorCore, { EditWithUndo } from '../interfaces/EditorCore';
import { Position } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    ContentChangedEvent,
    NodePosition,
    PluginEventType,
} from 'roosterjs-editor-types';

/**
 * Call an editing callback with adding undo snapshots around, and trigger a ContentChanged event if change source is specified.
 * Undo snapshot will not be added if this call is nested inside another editWithUndo() call.
 * @param core The EditorCore object
 * @param callback The editing callback, accepting current selection start and end position, returns an optional object used as the data field of ContentChangedEvent.
 * @param changeSource The ChangeSource string of ContentChangedEvent. @default ChangeSource.Format. Set to null to avoid triggering ContentChangedEvent
 */
export const editWithUndo: EditWithUndo = (
    core: EditorCore,
    callback: (start: NodePosition, end: NodePosition, snapshotBeforeCallback: string) => any,
    changeSource: ChangeSource | string
) => {
    let isNested = core.currentUndoSnapshot !== null;
    let data: any;

    if (!isNested) {
        core.currentUndoSnapshot = core.corePlugins.undo.addUndoSnapshot();
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
                core.corePlugins.undo.addUndoSnapshot();
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
