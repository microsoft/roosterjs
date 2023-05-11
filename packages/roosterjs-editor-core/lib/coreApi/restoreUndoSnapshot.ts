import {
    EditorCore,
    EntityOperation,
    PluginEventType,
    RestoreUndoSnapshot,
} from 'roosterjs-editor-types';

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

    if (snapshot && snapshot.html != null) {
        try {
            const { html, metadata, entities, entitySnapshot } = snapshot;
            core.undo.isRestoring = true;
            core.api.setContent(
                core,
                html,
                true /*triggerContentChangedEvent*/,
                metadata ?? undefined,
                entities
            );

            if (entitySnapshot) {
                core.api.triggerEvent(
                    core,
                    {
                        eventType: PluginEventType.EntityOperation,
                        operation: EntityOperation.UpdateEntityState,
                        entity: entitySnapshot.entity,
                        entityState: entitySnapshot.state,
                    },
                    false
                );
            }

            const darkColorHandler = core.darkColorHandler;
            const isDarkModel = core.lifecycle.isDarkMode;

            snapshot.knownColors.forEach(color => {
                darkColorHandler.registerColor(
                    color.lightModeColor,
                    isDarkModel,
                    color.darkModeColor
                );
            });
        } finally {
            core.undo.isRestoring = false;
        }
    }
};
