import { ColorTransformDirection } from 'roosterjs-editor-types';
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
        core.api.transformColor(
            core,
            core.contentDiv,
            false /*includeSelf*/,
            null /*callback*/,
            isDarkMode ? ColorTransformDirection.LightToDark : ColorTransformDirection.DarkToLight,
            true /*forceTransform*/,
            snapshot.isDarkMode
        );
    }
}
