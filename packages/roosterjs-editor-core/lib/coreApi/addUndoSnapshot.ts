import {
    getEntityFromElement,
    getEntitySelector,
    getSelectionPath,
    Position,
} from 'roosterjs-editor-dom';
import {
    AddUndoSnapshot,
    ChangeSource,
    ContentChangedData,
    ContentChangedEvent,
    ContentMetadata,
    EditorCore,
    EntitySnapshot,
    NodePosition,
    PluginEventType,
    SelectionRangeEx,
    SelectionRangeTypes,
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
 * @param additionalData @optional parameter to provide additional data related to the ContentChanged Event.
 * @param entitySnapshot @optional snapshot for entity. This is normally passed from IEditor.addEntitySnapshot() from a plugin that handles entity state
 */
export const addUndoSnapshot: AddUndoSnapshot = (
    core: EditorCore,
    callback: ((start: NodePosition | null, end: NodePosition | null) => any) | null,
    changeSource: ChangeSource | CompatibleChangeSource | string | null,
    canUndoByBackspace: boolean,
    additionalData?: ContentChangedData,
    entitySnapshot?: EntitySnapshot
) => {
    const undoState = core.undo;
    const isNested = undoState.isNested;
    let data: any;

    if (!isNested) {
        undoState.isNested = true;

        addUndoSnapshotInternal(core, canUndoByBackspace, entitySnapshot);
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

function addUndoSnapshotInternal(
    core: EditorCore,
    canUndoByBackspace: boolean,
    entitySnapshot?: EntitySnapshot
) {
    if (!core.lifecycle.shadowEditFragment) {
        const rangeEx = core.api.getSelectionRangeEx(core);
        const isDarkMode = core.lifecycle.isDarkMode;
        const metadata = createContentMetadata(core.contentDiv, rangeEx, isDarkMode) || null;
        const entities: Record<string, HTMLElement> = {};

        core.contentDiv.querySelectorAll(getEntitySelector()).forEach(wrapper => {
            const entity = getEntityFromElement(wrapper as HTMLElement);

            if (entity) {
                entities[entity.id] = entity.wrapper;
            }
        });

        core.undo.snapshotsService.addSnapshot(
            {
                html: core.contentDiv.innerHTML,
                metadata,
                knownColors: core.darkColorHandler?.getKnownColorsCopy() || [],
                entities,
                entitySnapshot,
            },
            canUndoByBackspace,
            !!entitySnapshot /*force*/
        );
        core.undo.hasNewContent = false;
    }
}

function createContentMetadata(
    root: HTMLElement,
    rangeEx: SelectionRangeEx,
    isDarkMode: boolean
): ContentMetadata | undefined {
    switch (rangeEx?.type) {
        case SelectionRangeTypes.TableSelection:
            return {
                type: SelectionRangeTypes.TableSelection,
                tableId: rangeEx.table.id,
                isDarkMode: !!isDarkMode,
                ...rangeEx.coordinates!,
            };
        case SelectionRangeTypes.ImageSelection:
            return {
                type: SelectionRangeTypes.ImageSelection,
                imageId: rangeEx.image.id,
                isDarkMode: !!isDarkMode,
            };
        case SelectionRangeTypes.Normal:
            return {
                type: SelectionRangeTypes.Normal,
                isDarkMode: !!isDarkMode,
                start: [],
                end: [],
                ...(getSelectionPath(root, rangeEx.ranges[0]) || {}),
            };
    }
}
