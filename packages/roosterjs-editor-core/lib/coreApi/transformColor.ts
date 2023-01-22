import { arrayPush, safeInstanceOf, toArray } from 'roosterjs-editor-dom';
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
    forceTransform?: boolean
) => {
    const elements =
        rootNode && (forceTransform || core.lifecycle.isDarkMode)
            ? getAll(rootNode, includeSelf)
            : [];

    callback?.();

    const {
        lifecycle: { onExternalContentTransform },
    } = core;

    const transform =
        direction == ColorTransformDirection.DarkToLight
            ? (element: HTMLElement) => {
                  transformToLightMode(core, element, 'background-color');
                  transformToLightMode(core, element, 'color');
              }
            : onExternalContentTransform
            ? (element: HTMLElement) => onExternalContentTransform(element)
            : (element: HTMLElement) => {
                  transformToDarkModel(core, element, 'background-color');
                  transformToDarkModel(core, element, 'color');
              };

    elements.forEach(transform);
};

function transformToLightMode(
    core: EditorCore,
    element: HTMLElement,
    cssName: 'background-color' | 'color'
) {
    const color = element.style.getPropertyValue(cssName);

    if (color) {
        core.api.setColorToElement(core, element, color, cssName, false /*isDarkMode*/);
    }
}

function transformToDarkModel(
    core: EditorCore,
    element: HTMLElement,
    cssName: 'background-color' | 'color'
) {
    const color =
        element.style.getPropertyValue(cssName) ||
        element.getAttribute(cssName == 'color' ? 'color' : 'bgcolor');

    if (color && color != 'inherit') {
        core.api.setColorToElement(core, element, color, cssName, true /*isDarkMode*/);
    }
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
