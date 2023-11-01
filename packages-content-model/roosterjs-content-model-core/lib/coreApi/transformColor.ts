import { TransformColor } from '../publicTypes/coreApi/TransformColor';

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
export const transformColor: TransformColor = (core, rootNode, includeSelf, toDarkMode) => {
    const { colorManager } = core;

    if (rootNode) {
        const transformer = (element: HTMLElement) => {
            colorManager.transformElementColor(element, !toDarkMode, toDarkMode);
        };

        iterateElements(rootNode, transformer, includeSelf);
    }
};

function iterateElements(
    root: Node,
    transformer: (element: HTMLElement) => void,
    includeSelf?: boolean
) {
    if (includeSelf && isHTMLElement(root)) {
        transformer(root);
    }

    for (let child = root.firstChild; child; child = child.nextSibling) {
        if (isHTMLElement(child)) {
            transformer(child);
        }

        iterateElements(child, transformer);
    }
}

// This is not a strict check, we just need to make sure this element has style so that we can set style to it
// We don't use safeInstanceOf() here since this function will be called very frequently when extract html content
// in dark mode, so we need to make sure this check is fast enough
function isHTMLElement(node: Node): node is HTMLElement {
    const htmlElement = <HTMLElement>node;
    return node.nodeType == Node.ELEMENT_NODE && !!htmlElement.style;
}
