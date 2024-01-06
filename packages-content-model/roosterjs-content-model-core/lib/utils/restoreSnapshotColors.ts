import { transformColor } from '../publicApi/color/transformColor';
import type { StandaloneEditorCore, Snapshot } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function restoreSnapshotColors(core: StandaloneEditorCore, snapshot: Snapshot) {
    const isDarkMode = core.lifecycle.isDarkMode;
    const snapshots = core.undo.snapshotsManager;

    snapshots.updateKnownColor(isDarkMode); // Pass no parameter to force update all colors

    if (!!snapshot.isDarkMode != !!isDarkMode) {
        transformColor(
            core.contentDiv,
            false /*includeSelf*/,
            isDarkMode ? 'lightToDark' : 'darkToLight',
            snapshots
        );
    }
}
