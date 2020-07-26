import { UndoPluginState } from '../corePlugins/UndoPlugin';

/**
 * @internal
 */
export default function restoreSnapshot(state: UndoPluginState, delta: number) {
    let snapshot = state.snapshotsService.move(delta);

    if (snapshot != null) {
        try {
            state.isRestoring = true;
            state.setContent(snapshot);
        } finally {
            state.isRestoring = false;
        }
    }
}
