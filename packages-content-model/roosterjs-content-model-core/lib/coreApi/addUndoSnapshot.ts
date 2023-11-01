import { cloneModel, CloneModelOptions } from 'roosterjs-content-model-editor';
import { CoreEditorCore } from '../publicTypes/editor/CoreEditorCore';
import type { ContentChangedEvent } from '../publicTypes/event/ContentChangedEvent';
import type { AddUndoSnapshot } from '../publicTypes/coreApi/AddUndoSnapshot';
import type { EntityState } from 'roosterjs-content-model-types';

/**
 * @internal
 * Call an editing callback with adding undo snapshots around, and trigger a ContentChanged event if change source is specified.
 * Undo snapshot will not be added if this call is nested inside another addUndoSnapshot() call.
 * @param core The EditorCore object
 * @param callback The editing callback, accepting current selection start and end position, returns an optional object used as the data field of ContentChangedEvent.
 * @param changeSource The ChangeSource string of ContentChangedEvent. @default ChangeSource.Format. Set to null to avoid triggering ContentChangedEvent
 * @param canUndoByBackspace True if this action can be undone when user press Backspace key (aka Auto Complete).
 * @param additionalData @optional parameter to provide additional data related to the ContentChanged Event.
 */
export const addUndoSnapshot: AddUndoSnapshot = (
    core,
    callback,
    changeSource,
    canUndoByBackspace,
    additionalData
) => {
    const undoState = core.undo;
    const isNested = undoState.isNested;

    if (!isNested) {
        undoState.isNested = true;

        // When there is getEntityState, it means this is triggered by an entity change.
        // So if HTML content is not changed (hasNewContent is false), no need to add another snapshot before change
        if (core.undo.hasNewContent || !additionalData?.getEntityState || !callback) {
            addUndoSnapshotInternal(core, canUndoByBackspace, additionalData?.getEntityState?.());
        }
    }

    try {
        if (callback) {
            let data = callback();

            if (additionalData) {
                additionalData.additionalData = data;
            }

            if (!isNested) {
                const entityStates = additionalData?.getEntityState?.();
                addUndoSnapshotInternal(core, false /*isAutoCompleteSnapshot*/, entityStates);
            }
        }
    } finally {
        if (!isNested) {
            undoState.isNested = false;
        }
    }

    if (callback && changeSource) {
        const event: ContentChangedEvent = {
            eventType: 'contentChanged',
            source: changeSource,
            changeData: additionalData || {},
        };
        core.api.triggerEvent(core, event, true /*broadcast*/);
    }

    if (canUndoByBackspace) {
        const selection = core.api.getDOMSelection(core, false /*forceGetNewSelection*/);

        if (selection?.type == 'range' && selection.range.collapsed) {
            core.undo.hasNewContent = false;
            core.undo.autoCompleteRange = selection.range;
        }
    }
};

const cloneOption: CloneModelOptions = {
    includeCachedElement: (node, type) => (type == 'cache' ? undefined : node),
};

function addUndoSnapshotInternal(
    core: CoreEditorCore,
    canUndoByBackspace: boolean,
    entityStates?: EntityState[]
) {
    if (!core.lifecycle.isInShadowEdit) {
        const { currentIndex, snapshots } = core.undo;
        const model = core.api.createContentModel(core);

        snapshots.splice(currentIndex + 1, snapshots.length - currentIndex - 1);
        snapshots.push({
            contentModel: cloneModel(model, cloneOption),
            entityStates,
            canUndoByBackspace,
        });

        core.undo.hasNewContent = false;
    }
}
