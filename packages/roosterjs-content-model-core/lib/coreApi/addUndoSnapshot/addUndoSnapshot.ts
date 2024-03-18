import { parseEntityFormat } from 'roosterjs-content-model-dom';
import type {
    AddUndoSnapshot,
    EntityOperationEvent,
    Snapshot,
} from 'roosterjs-content-model-types';
import { createSnapshotSelection } from './createSnapshotSelection';
import { getPath } from './getPath';

const ENTITY_INFO_NAME = '_Entity';

/**
 * @internal
 * Add an undo snapshot to current undo snapshot stack
 * @param core The EditorCore object
 * @param canUndoByBackspace True if this action can be undone when user press Backspace key (aka Auto Complete).
 * @param entityStates @optional Entity states related to this snapshot.
 * Each entity state will cause an EntityOperation event with operation = EntityOperation.UpdateEntityState
 * when undo/redo to this snapshot
 */
export const addUndoSnapshot: AddUndoSnapshot = (core, canUndoByBackspace, entityStates) => {
    const { lifecycle, physicalRoot, logicalRoot, undo } = core;
    let snapshot: Snapshot | null = null;

    if (!lifecycle.shadowEditFragment) {
        // Need to create snapshot selection before retrieve innerHTML since HTML can be changed during creating selection when normalize table
        const selection = createSnapshotSelection(core);
        const html = physicalRoot.innerHTML;

        // give plugins the chance to share entity states to include in the snapshot
        const logicalRootEntityWrapper = logicalRoot.closest<HTMLElement>(`.${ENTITY_INFO_NAME}`);
        if (!entityStates && logicalRootEntityWrapper) {
            const entityFormat = parseEntityFormat(logicalRootEntityWrapper);
            if (entityFormat.entityType && entityFormat.id) {
                const event = <EntityOperationEvent>{
                    eventType: 'entityOperation',
                    operation: 'snapshotEntityState',
                    entity: {
                        type: entityFormat.entityType,
                        id: entityFormat.id,
                        wrapper: logicalRootEntityWrapper,
                        isReadonly: entityFormat.isReadonly,
                    },
                    state: undefined,
                };

                core.api.triggerEvent(core, event, false);

                // copy out any entity states from the plugins
                if (event.state) {
                    entityStates = [
                        {
                            type: entityFormat.entityType,
                            id: entityFormat.id,
                            state: event.state,
                        },
                    ];
                }
            }
        }

        snapshot = {
            html,
            entityStates,
            isDarkMode: !!lifecycle.isDarkMode,
            selection,
            logicalRootPath: getPath(logicalRoot, 0, physicalRoot),
        };

        undo.snapshotsManager.addSnapshot(snapshot, !!canUndoByBackspace);
        undo.snapshotsManager.hasNewContent = false;
    }

    return snapshot;
};
