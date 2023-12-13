import { transformColor } from '../publicApi/color/transformColor';
import type { StandaloneEditorCore, Snapshot } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function restoreSnapshotColors(core: StandaloneEditorCore, snapshot: Snapshot) {
    const isDarkMode = core.lifecycle.isDarkMode;
    const darkColorHandler = core.darkColorHandler;

    snapshot.knownColors.forEach(color => {
        darkColorHandler.registerColor(color.lightModeColor, isDarkMode, color.darkModeColor);
    });

    if (!!snapshot.isDarkMode != !!isDarkMode) {
        transformColor(
            core.contentDiv,
            false /*includeSelf*/,
            isDarkMode ? 'lightToDark' : 'darkToLight',
            darkColorHandler
        );
    }
}
