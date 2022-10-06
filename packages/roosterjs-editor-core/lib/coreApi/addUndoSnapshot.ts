import { getSelectionPath, Position } from 'roosterjs-editor-dom';
import {
    AddUndoSnapshot,
    ChangeSource,
    ContentChangedEvent,
    EditorCore,
    NodePosition,
    PluginEventType,
    SelectionRangeTypes,
    ContentMetadata,
    ContentChangedData,
} from 'roosterjs-editor-types';
import type { CompatibleChangeSource } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * @internal
 * Call an editing callback with adding undo snapshots around, and trigger a ContentChanged event if change source is specified.
 * Undo snapshot will not be added if this call is nested inside another addUndoSnapshot() call.
 * @param core The EditorCore object
 * @param callback The editing callback, accepting current selection start and end position, returns an optional object used as the data field of ContentChangedEvent.
 * @param changeSource The ChangeSource string of ContentChangedEvent. @default ChangeSource.Format. Set to null to avoid triggering ContentChangedEvent
 * @param canUndoByBackspace True if this action can be undone when user press Backspace key (aka Auto Complete).
 * @param formatApiName Optional parameter to provide the ContentChangeEvent which FormatApi was invoked.
 */
export const addUndoSnapshot: AddUndoSnapshot = (
    core: EditorCore,
    callback: ((start: NodePosition | null, end: NodePosition | null) => any) | null,
    changeSource: ChangeSource | CompatibleChangeSource | string | null,
    canUndoByBackspace: boolean,
    additionalData?: ContentChangedData
) => {
    const undoState = core.undo;
    const isNested = undoState.isNested;
    let data: any;

    if (!isNested) {
        undoState.isNested = true;

        addUndoSnapshotInternal(core, canUndoByBackspace);
    }

    try {
        if (callback) {
            let range = core.api.getSelectionRange(core, true /*tryGetFromCache*/);
            data = callback(
                range && Position.getStart(range).normalize(),
                range && Position.getEnd(range).normalize()
            );

            if (!isNested) {
                addUndoSnapshotInternal(core, false /*isAutoCompleteSnapshot*/);
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
            additionalData,
        };
        core.api.triggerEvent(core, event, true /*broadcast*/);
    }

    if (canUndoByBackspace) {
        const range = core.api.getSelectionRange(core, false /*tryGetFromCache*/);

        if (range) {
            core.undo.hasNewContent = false;
            core.undo.autoCompletePosition = Position.getStart(range);
        }
    }
};

function addUndoSnapshotInternal(core: EditorCore, canUndoByBackspace: boolean) {
    if (!core.lifecycle.shadowEditFragment) {
        const rangeEx = core.api.getSelectionRangeEx(core);
        const isDarkMode = core.lifecycle.isDarkMode;
        const metadata: ContentMetadata =
            rangeEx?.type == SelectionRangeTypes.TableSelection
                ? {
                      type: SelectionRangeTypes.TableSelection,
                      tableId: rangeEx.table.id,
                      isDarkMode,
                      ...rangeEx.coordinates!,
                  }
                : {
                      type: SelectionRangeTypes.Normal,
                      isDarkMode,
                      start: [],
                      end: [],
                      ...(getSelectionPath(core.contentDiv, rangeEx?.ranges[0] ?? null) || {}),
                  };

        core.undo.snapshotsService.addSnapshot(
            {
                html: core.contentDiv.innerHTML,
                metadata,
            },
            canUndoByBackspace
        );
        core.undo.hasNewContent = false;
    }
}
