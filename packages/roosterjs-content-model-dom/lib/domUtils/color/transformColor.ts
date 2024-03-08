import { getColor, setColor } from '../../domUtils/color/color';
import type { DarkColorHandler } from 'roosterjs-content-model-types';

/**
 * Edit and transform color of elements between light mode and dark mode
 * @param rootNode The root DOM node to transform
 * @param includeSelf True to transform the root node as well, otherwise false
 * @param direction To specify the transform direction, light to dark, or dark to light
 * @param darkColorHandler The dark color handler object to help do color transformation
 */
export function transformColor(
    rootNode: Node,
    includeSelf: boolean,
    direction: 'lightToDark' | 'darkToLight',
    darkColorHandler?: DarkColorHandler
) {
    const toDarkMode = direction == 'lightToDark';
    const transformer = (element: HTMLElement) => {
        const textColor = getColor(element, false /*isBackground*/, !toDarkMode, darkColorHandler);
        const backColor = getColor(element, true /*isBackground*/, !toDarkMode, darkColorHandler);

        setColor(element, textColor, false /*isBackground*/, toDarkMode, darkColorHandler);
        setColor(element, backColor, true /*isBackground*/, toDarkMode, darkColorHandler);
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
