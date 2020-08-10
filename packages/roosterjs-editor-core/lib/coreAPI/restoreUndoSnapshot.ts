import EditorCore, { RestoreUndoSnapshot } from '../interfaces/EditorCore';

/**
 * Restore an undo snapshot into editor
 * @param core The editor core object
 * @param step Steps to move, can be 0, positive or negative
 */
export const restoreUndoSnapshot: RestoreUndoSnapshot = (core: EditorCore, step: number) => {
    if (core.undo.value.hasNewContent && step < 0) {
        core.api.addUndoSnapshot(
            core,
            null /*callback*/,
            null /*changeSource*/,
            false /*canUndoByBackspace*/
        );
    }

    let snapshot = core.undo.value.snapshotsService.move(step);

    if (snapshot != null) {
        try {
            core.undo.value.isRestoring = true;
            core.api.setContent(core, snapshot, true /*triggerContentChangedEvent*/);
        } finally {
            core.undo.value.isRestoring = false;
        }
    }
};
