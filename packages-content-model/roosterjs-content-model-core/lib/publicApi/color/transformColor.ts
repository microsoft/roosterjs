import { getColor, setColor } from 'roosterjs-content-model-dom';
import type { ColorManager } from 'roosterjs-content-model-types';

/**
 * Edit and transform color of elements between light mode and dark mode
 * @param rootNode The root DOM node to transform
 * @param includeSelf True to transform the root node as well, otherwise false
 * @param direction To specify the transform direction, light to dark, or dark to light
 * @param colorManager @optional The color manager object to help manager dark mode color
 */
export function transformColor(
    rootNode: Node,
    includeSelf: boolean,
    direction: 'lightToDark' | 'darkToLight',
    colorManager?: ColorManager
) {
    const toDarkMode = direction == 'lightToDark';
    const transformer = (element: HTMLElement) => {
        const textColor = getColor(element, false /*isBackground*/, !toDarkMode, colorManager);
        const backColor = getColor(element, true /*isBackground*/, !toDarkMode, colorManager);

        setColor(element, textColor, false /*isBackground*/, toDarkMode, colorManager);
        setColor(element, backColor, true /*isBackground*/, toDarkMode, colorManager);
    };

    iterateElements(rootNode, transformer, includeSelf);
}

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
