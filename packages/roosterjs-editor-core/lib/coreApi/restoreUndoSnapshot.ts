import { EditorCore, RestoreUndoSnapshot } from 'roosterjs-editor-types';

/**
 * @internal
 * Restore an undo snapshot into editor
 * @param core The editor core object
 * @param step Steps to move, can be 0, positive or negative
 */
export const restoreUndoSnapshot: RestoreUndoSnapshot = (core: EditorCore, step: number) => {
    if (core.undo.hasNewContent && step < 0) {
        core.api.addUndoSnapshot(
            core,
            null /*callback*/,
            null /*changeSource*/,
            false /*canUndoByBackspace*/
        );
    }

    const snapshot = core.undo.snapshotsService.move(step);

    if (snapshot != null) {
        try {
            core.undo.isRestoring = true;
            core.api.setContent(core, snapshot, true /*triggerContentChangedEvent*/);
        } finally {
            core.undo.isRestoring = false;
        }
    }
};
