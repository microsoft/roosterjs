import { BorderColorKeyMap, BorderKeys } from '../../formatHandlers/utils/borderKeys';
import { isElementOfType } from '../isElementOfType';
import {
    adaptColor,
    getColor,
    getLightModeColor,
    setColor,
} from '../../formatHandlers/utils/color';
import type { DarkColorHandler } from 'roosterjs-content-model-types';

/**
 * Configuration options for controlling which elements and styles undergo color transformation.
 * By default, text and background colors are transformed for all elements.
 */
export interface TransformColorOptions {
    tableBorders: boolean;
}

/**
 * Edit and transform color of elements between light mode and dark mode
 * By default, text and background colors are transformed for all elements.
 * @param rootNode The root DOM node to transform
 * @param includeSelf True to transform the root node as well, otherwise false
 * @param direction To specify the transform direction, light to dark, or dark to light
 * @param darkColorHandler The dark color handler object to help do color transformation
 * @param transformColorOptions Configuration options for controlling which elements and styles undergo color transformation.
 */
export function transformColor(
    rootNode: Node,
    includeSelf: boolean,
    direction: 'lightToDark' | 'darkToLight',
    darkColorHandler?: DarkColorHandler,
    transformColorOptions?: TransformColorOptions,
    defaultTextColor?: string
) {
    const toDarkMode = direction == 'lightToDark';
    const tableBorders = transformColorOptions?.tableBorders || false;
    const transformer = (element: HTMLElement, parentTextColor?: string) => {
        const textColor = getColor(element, false /*isBackground*/, !toDarkMode, darkColorHandler);
        const backColor = getColor(element, true /*isBackground*/, !toDarkMode, darkColorHandler);
        const comparingColor = textColor || parentTextColor;

        setColor(element, textColor, false /*isBackground*/, toDarkMode, darkColorHandler);
        setColor(
            element,
            backColor,
            true /*isBackground*/,
            toDarkMode,
            darkColorHandler,
            comparingColor
        );

        if (tableBorders) {
            transformBorderColor(element, toDarkMode, darkColorHandler);
        }

        return comparingColor;
    };

    iterateElements(rootNode, transformer, includeSelf, defaultTextColor);
}

function transformBorderColor(
    element: HTMLElement,
    toDarkMode: boolean,
    darkColorHandler?: DarkColorHandler
) {
    if (isElementOfType(element, 'td') || isElementOfType(element, 'th')) {
        BorderKeys.forEach(key => {
            const borderColorProperty = BorderColorKeyMap[key];
            const style = element.style.getPropertyValue(borderColorProperty);
            if (style) {
                const lightColor = getLightModeColor(style, !toDarkMode, darkColorHandler);
                if (lightColor) {
                    const transformedColor = adaptColor(
                        element,
                        lightColor,
                        'border',
                        toDarkMode,
                        darkColorHandler
                    );
                    if (transformedColor) {
                        element.style.setProperty(borderColorProperty, transformedColor);
                    }
                }
            }
        });
    }
}

function iterateElements(
    root: Node,
    transformer: (element: HTMLElement, parentTextColor?: string) => string | undefined,
    includeSelf?: boolean,
    parentTextColor?: string
) {
    if (includeSelf && isHTMLElement(root)) {
        parentTextColor = transformer(root, parentTextColor);
    }

    for (let child = root.firstChild; child; child = child.nextSibling) {
        let textColor = parentTextColor;

        if (isHTMLElement(child)) {
            textColor = transformer(child, parentTextColor);
        }

        iterateElements(child, transformer, false, textColor);
    }
}

// This is not a strict check, we just need to make sure this element has style so that we can set style to it
// We don't use safeInstanceOf() here since this function will be called very frequently when extract html content
// in dark mode, so we need to make sure this check is fast enough
function isHTMLElement(node: Node): node is HTMLElement {
    const htmlElement = <HTMLElement>node;
    return node.nodeType == Node.ELEMENT_NODE && !!htmlElement.style;
}
