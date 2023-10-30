import type { CoreEditorCore } from '../editor/CoreEditorCore';

/**
 * @internal
 * Edit and transform color of elements between light mode and dark mode
 * @param core The CoreEditorCore object
 * @param rootNode The root HTML node to transform
 * @param includeSelf True to transform the root node as well, otherwise false
 * @param toDark To specify the transform direction, true means light to dark, false means dark to light
 */
export type TransformColor = (
    core: CoreEditorCore,
    rootNode: Node,
    includeSelf: boolean,
    toDark: boolean
) => void;
