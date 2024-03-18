import { transformColor } from '../../publicApi/color/transformColor';
import type { EditorCore, Snapshot } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function restoreSnapshotColors(core: EditorCore, snapshot: Snapshot) {
    const isDarkMode = core.lifecycle.isDarkMode;

    core.darkColorHandler.updateKnownColor(isDarkMode); // Pass no parameter to force update all colors

    if (!!snapshot.isDarkMode != !!isDarkMode) {
        transformColor(
            core.physicalRoot,
            false /*includeSelf*/,
            isDarkMode ? 'lightToDark' : 'darkToLight',
            core.darkColorHandler
        );
    }
}
