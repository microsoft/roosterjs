import type {
    AddUndoSnapshot,
    Snapshot,
    SnapshotLogicalRootEvent,
} from 'roosterjs-content-model-types';
import { createSnapshotSelection } from '../utils/createSnapshotSelection';
import { getPath } from '../utils/getPath';

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

        if (!entityStates) {
            // give plugins the chance to share entity states to include in the snapshot
            const event = <SnapshotLogicalRootEvent>{
                eventType: 'snapshotLogicalRoot',
                logicalRoot,
                entityStates: [],
            };
            core.api.triggerEvent(core, event, false);

            // copy out any entity states from the plugins
            entityStates = event.entityStates;
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
