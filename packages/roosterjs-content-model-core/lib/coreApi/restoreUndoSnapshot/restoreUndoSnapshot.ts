import type { ContentChangedEvent, RestoreUndoSnapshot } from 'roosterjs-content-model-types';
import { ChangeSource } from '../../constants/ChangeSource';
import { restoreSnapshotColors } from './restoreSnapshotColors';
import { restoreSnapshotHTML } from './restoreSnapshotHTML';
import { restoreSnapshotLogicalRoot } from './restoreSnapshotLogicalRoot';
import { restoreSnapshotSelection } from './restoreSnapshotSelection';

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

        restoreSnapshotHTML(core, snapshot);
        restoreSnapshotLogicalRoot(core, snapshot);
        restoreSnapshotSelection(core, snapshot);
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
