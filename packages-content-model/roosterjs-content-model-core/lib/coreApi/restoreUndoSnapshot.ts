import { RestoreUndoSnapshot } from '../publicTypes/coreApi/RestoreUndoSnapshot';

/**
 * @internal
 * Restore an undo snapshot into editor
 * @param core The editor core object
 * @param step Steps to move, can be 0, positive or negative
 */
export const restoreUndoSnapshot: RestoreUndoSnapshot = (core, step) => {
    if (core.undo.hasNewContent && step < 0) {
        core.api.addUndoSnapshot(
            core,
            null /*callback*/,
            null /*changeSource*/,
            false /*canUndoByBackspace*/
        );
    }

    const newIndex = core.undo.currentIndex + step;
    const snapshot = core.undo.snapshots[newIndex];

    if (snapshot) {
        core.undo.currentIndex = newIndex;
        core.api.setContentModel(core, snapshot.contentModel);

        snapshot.entityStates?.forEach(entityState => {
            const { entity, state } = entityState;

            if (entity) {
                core.api.triggerEvent(
                    core,
                    {
                        eventType: 'entityOperation',
                        operation: 'updateEntityState',
                        entity: entity,
                        state,
                    },
                    false
                );
            }
        });
    }
};
