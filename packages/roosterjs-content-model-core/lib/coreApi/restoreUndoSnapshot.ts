import { ChangeSource } from '../constants/ChangeSource';
import { getPositionFromPath } from '../utils/getPositionFromPath';
import { restoreSnapshotColors } from '../utils/restoreSnapshotColors';
import { restoreSnapshotHTML } from '../utils/restoreSnapshotHTML';
import { restoreSnapshotSelection } from '../utils/restoreSnapshotSelection';
import type { ContentChangedEvent, RestoreUndoSnapshot } from 'roosterjs-content-model-types';

/**
 * @internal
 * Restore an undo snapshot into editor
 * @param core The editor core object
 * @param step Steps to move, can be 0, positive or negative
 */
export const restoreUndoSnapshot: RestoreUndoSnapshot = (core, snapshot) => {
    core.api.triggerEvent(
        core,
        {
            eventType: 'beforeSetContent',
            newContent: snapshot.html,
        },
        true /*broadcast*/
    );

    try {
        core.undo.isRestoring = true;

        // reset logical root to physical root
        core.api.setLogicalRoot(core, null);

        // put back the HTML
        restoreSnapshotHTML(core, snapshot);

        // restore logical root if needed
        if (snapshot.logicalRootPath && snapshot.logicalRootPath.length > 0) {
            const restoredLogicalRoot = getPositionFromPath(
                core.physicalRoot,
                snapshot.logicalRootPath
            ).node as HTMLDivElement;
            if (restoredLogicalRoot !== core.logicalRoot) {
                core.api.setLogicalRoot(core, restoredLogicalRoot);
            }
        }

        // restore selection and colors
        try {
            // might fail if the selection is not present, but we do not want to crash
            restoreSnapshotSelection(core, snapshot);
        } catch {}
        restoreSnapshotColors(core, snapshot);

        const event: ContentChangedEvent = {
            eventType: 'contentChanged',
            entityStates: snapshot.entityStates,
            source: ChangeSource.SetContent,
        };

        core.api.triggerEvent(core, event, false /*broadcast*/);
    } finally {
        core.undo.isRestoring = false;
    }
};
