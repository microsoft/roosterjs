import { ChangeSource } from '../constants/ChangeSource';
import { PluginEventType } from 'roosterjs-editor-types';
import { restoreSnapshotColors } from '../utils/restoreSnapshotColors';
import { restoreSnapshotHTML } from '../utils/restoreSnapshotHTML';
import { restoreSnapshotSelection } from '../utils/restoreSnapshotSelection';
import type {
    ContentModelContentChangedEvent,
    RestoreUndoSnapshot,
} from 'roosterjs-content-model-types';

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
            eventType: PluginEventType.BeforeSetContent,
            newContent: snapshot.html,
        },
        true /*broadcast*/
    );

    try {
        core.undo.isRestoring = true;

        restoreSnapshotHTML(core, snapshot);
        restoreSnapshotSelection(core, snapshot);
        restoreSnapshotColors(core, snapshot);

        const event: ContentModelContentChangedEvent = {
            eventType: PluginEventType.ContentChanged,
            entityStates: snapshot.entityStates,
            source: ChangeSource.SetContent,
        };

        core.api.triggerEvent(core, event, false /*broadcast*/);
    } finally {
        core.undo.isRestoring = false;
    }
};
