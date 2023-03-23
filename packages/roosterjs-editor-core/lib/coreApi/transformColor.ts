import { arrayPush, safeInstanceOf, setColor, toArray } from 'roosterjs-editor-dom';
import {
    ColorTransformDirection,
    DarkColorHandler,
    DarkModeDatasetNames,
    EditorCore,
    TransformColor,
} from 'roosterjs-editor-types';
import type { CompatibleColorTransformDirection } from 'roosterjs-editor-types/lib/compatibleTypes';

const enum ColorAttributeEnum {
    CssColor = 0,
    HtmlColor = 1,
    CssDataSet = 2,
    HtmlDataSet = 3,
}

const ColorAttributeName: { [key in ColorAttributeEnum]: string }[] = [
    {
        [ColorAttributeEnum.CssColor]: 'color',
        [ColorAttributeEnum.HtmlColor]: 'color',
        [ColorAttributeEnum.CssDataSet]: DarkModeDatasetNames.OriginalStyleColor,
        [ColorAttributeEnum.HtmlDataSet]: DarkModeDatasetNames.OriginalAttributeColor,
    },
    {
        [ColorAttributeEnum.CssColor]: 'background-color',
        [ColorAttributeEnum.HtmlColor]: 'bgcolor',
        [ColorAttributeEnum.CssDataSet]: DarkModeDatasetNames.OriginalStyleBackgroundColor,
        [ColorAttributeEnum.HtmlDataSet]: DarkModeDatasetNames.OriginalAttributeBackgroundColor,
    },
];

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
    const { darkColorHandler } = core;
    const elements =
        rootNode && (forceTransform || core.lifecycle.isDarkMode)
            ? getAll(rootNode, includeSelf)
            : [];

    callback?.();

    if (darkColorHandler) {
        transformV2(
            elements,
            darkColorHandler,
            !!fromDarkMode,
            direction == ColorTransformDirection.LightToDark
        );
    } else {
        if (direction == ColorTransformDirection.DarkToLight) {
            transformToLightMode(elements);
        } else if (core.lifecycle.onExternalContentTransform) {
            elements.forEach(element => core.lifecycle.onExternalContentTransform!(element));
        } else {
            transformToDarkMode(elements, core.lifecycle.getDarkColor);
        }
    }
};

function transformV2(
    elements: HTMLElement[],
    darkColorHandler: DarkColorHandler,
    fromDark: boolean,
    toDark: boolean
) {
    elements.forEach(element => {
        ColorAttributeName.forEach((names, i) => {
            const color = darkColorHandler.parseColorValue(
                element.style.getPropertyValue(names[ColorAttributeEnum.CssColor]) ||
                    element.getAttribute(names[ColorAttributeEnum.HtmlColor]),
                fromDark
            ).lightModeColor;

            element.style.setProperty(names[ColorAttributeEnum.CssColor], null);
            element.removeAttribute(names[ColorAttributeEnum.HtmlColor]);

            if (color && color != 'inherit') {
                setColor(
                    element,
                    color,
                    i != 0,
                    toDark,
                    false /*shouldAdaptFontColor*/,
                    darkColorHandler
                );
            }
        });
    });
}

function transformToLightMode(elements: HTMLElement[]) {
    elements.forEach(element => {
        ColorAttributeName.forEach(names => {
            // Reset color styles based on the content of the ogsc/ogsb data element.
            // If those data properties are empty or do not exist, set them anyway to clear the content.
            element.style.setProperty(
                names[ColorAttributeEnum.CssColor],
                getValueOrDefault(element.dataset[names[ColorAttributeEnum.CssDataSet]], '')
            );
            delete element.dataset[names[ColorAttributeEnum.CssDataSet]];

            // Some elements might have set attribute colors. We need to reset these as well.
            let value = getValueOrDefault(
                element.dataset[names[ColorAttributeEnum.HtmlDataSet]],
                null
            );

            if (value) {
                element.setAttribute(names[ColorAttributeEnum.HtmlColor], value);
            } else {
                element.removeAttribute(names[ColorAttributeEnum.HtmlColor]);
            }

            delete element.dataset[names[ColorAttributeEnum.HtmlDataSet]];
        });
    });
}

function transformToDarkMode(elements: HTMLElement[], getDarkColor: (color: string) => string) {
    ColorAttributeName.forEach(names => {
        elements
            .map(element => {
                const styleColor = element.style.getPropertyValue(
                    names[ColorAttributeEnum.CssColor]
                );
                const attrColor = element.getAttribute(names[ColorAttributeEnum.HtmlColor]);
                const existingDataSetCssValue =
                    element.dataset[names[ColorAttributeEnum.CssDataSet]];
                const existingDataSetHtmlValue =
                    element.dataset[names[ColorAttributeEnum.HtmlDataSet]];
                const needProcess =
                    (!existingDataSetCssValue || existingDataSetCssValue == styleColor) &&
                    (!existingDataSetHtmlValue || existingDataSetHtmlValue == attrColor) &&
                    (styleColor || attrColor) &&
                    styleColor != 'inherit'; // For inherit style, no need to change it and let it keep inherit from parent element

                return needProcess
                    ? {
                          element,
                          styleColor,
                          attrColor,
                          newColor:
                              styleColor || attrColor
                                  ? getDarkColor((styleColor || attrColor)!)
                                  : null,
                      }
                    : null;
            })
            .filter(x => !!x)
            .forEach(entry => {
                if (!entry) {
                    return;
                }

                const { element, styleColor, attrColor, newColor } = entry;
                element.style.setProperty(
                    names[ColorAttributeEnum.CssColor],
                    newColor,
                    'important'
                );
                element.dataset[names[ColorAttributeEnum.CssDataSet]] = styleColor || '';

                if (attrColor && newColor) {
                    element.setAttribute(names[ColorAttributeEnum.HtmlColor], newColor);
                    element.dataset[names[ColorAttributeEnum.HtmlDataSet]] = attrColor;
                }
            });
    });
}

function getValueOrDefault(value: string | undefined, defaultValue: string | null) {
    return value && value != 'undefined' && value != 'null' ? value : defaultValue;
}

function getAll(rootNode: Node, includeSelf: boolean): HTMLElement[] {
    const result: HTMLElement[] = [];

    if (safeInstanceOf(rootNode, 'HTMLElement')) {
        if (includeSelf) {
            result.push(rootNode);
        }
        const allChildren = rootNode.getElementsByTagName('*');
        arrayPush(result, toArray(allChildren));
    } else if (safeInstanceOf(rootNode, 'DocumentFragment')) {
        const allChildren = rootNode.querySelectorAll('*');
        arrayPush(result, toArray(allChildren));
    }

    return result.filter(isHTMLElement);
}

// This is not a strict check, we just need to make sure this element has style so that we can set style to it
// We don't use safeInstanceOf() here since this function will be called very frequently when extract html content
// in dark mode, so we need to make sure this check is fast enough
function isHTMLElement(element: Element): element is HTMLElement {
    const htmlElement = <HTMLElement>element;
    return !!htmlElement.style && !!htmlElement.dataset;
}
