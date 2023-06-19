import { ColorTransformDirection, EditorCore, TransformColor } from 'roosterjs-editor-types';
import type { CompatibleColorTransformDirection } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * @internal
 * Edit and transform color of elements between light mode and dark mode
 * @param core The EditorCore object
 * @param rootNode The root HTML elements to transform
 * @param includeSelf True to transform the root node as well, otherwise false
 * @param callback The callback function to invoke before do color transformation
 * @param direction To specify the transform direction, light to dark, or dark to light
 * @param forceTransform By default this function will only work when editor core is in dark mode.
 * Pass true to this value to force do color transformation even editor core is in light mode
 */
export const transformColor: TransformColor = (
    core: EditorCore,
    rootNode: Node | null,
    includeSelf: boolean,
    callback: (() => void) | null,
    direction: ColorTransformDirection | CompatibleColorTransformDirection,
    forceTransform?: boolean,
    fromDarkMode?: boolean
) => {
    if (rootNode) {
        core.darkColorHandler.transformColors(
            rootNode,
            direction == ColorTransformDirection.DarkToLight,
            includeSelf
        );
    }

    callback?.();
};
