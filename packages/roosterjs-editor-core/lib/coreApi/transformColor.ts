import { arrayPush, safeInstanceOf, toArray } from 'roosterjs-editor-dom';
import {
    ColorTransformDirection,
    DarkModeDatasetNames,
    EditorCore,
    TransformColor,
} from 'roosterjs-editor-types';

const STYLE_DATASET_MAP = {
    /**
     * Original style color
     */
    [DarkModeDatasetNames.OriginalStyleColor]: (element: HTMLElement, value: string) =>
        (element.style.color = value),

    /**
     * Original style background color
     */
    [DarkModeDatasetNames.OriginalStyleBackgroundColor]: (element: HTMLElement, value: string) =>
        (element.style.backgroundColor = value),
};
const ATTR_DATASET_MAP = {
    /**
     * Original attribute color
     */
    [DarkModeDatasetNames.OriginalAttributeColor]: 'color',

    /**
     * Original attribute background color
     */
    [DarkModeDatasetNames.OriginalAttributeBackgroundColor]: 'bgcolor',
};

/**
 * @internal
 * Edit and transform color of elements between light mode and dark mode
 * @param core The EditorCore object
 * @param rootNode The root HTML elements to transform
 * @param includeSelf True to transform the root node as well, otherwise false
 * @param callback The callback function to invoke before do color transformation
 * @param direction To specify the transform direction, light to dark, or dark to light
 */
export const transformColor: TransformColor = (
    core: EditorCore,
    rootNode: Node,
    includeSelf: boolean,
    callback: () => void,
    direction: ColorTransformDirection
) => {
    let elementsToTransform = core.lifecycle.isDarkMode ? getAll(rootNode, includeSelf) : [];

    callback?.();

    elementsToTransform.forEach(element => {
        if (direction == ColorTransformDirection.DarkToLight && element?.dataset) {
            // Reset color styles based on the content of the ogsc/ogsb data element.
            // If those data properties are empty or do not exist, set them anyway to clear the content.
            Object.keys(STYLE_DATASET_MAP).forEach((name: keyof typeof STYLE_DATASET_MAP) => {
                STYLE_DATASET_MAP[name](element, getValueOrDefault(element.dataset[name], ''));
                delete element.dataset[name];
            });

            // Some elements might have set attribute colors. We need to reset these as well.
            Object.keys(ATTR_DATASET_MAP).forEach((name: keyof typeof ATTR_DATASET_MAP) => {
                const value = element.dataset[name];
                if (getValueOrDefault(value, null)) {
                    element.setAttribute(ATTR_DATASET_MAP[name], value);
                } else {
                    element.removeAttribute(ATTR_DATASET_MAP[name]);
                }
                delete element.dataset[name];
            });
        } else if (element) {
            if (core.lifecycle.onExternalContentTransform) {
                core.lifecycle.onExternalContentTransform(element);
            } else {
                element.style.color = null;
                element.style.backgroundColor = null;
            }
        }
    });
};

function getValueOrDefault(value: string, defualtValue: string | null) {
    return value && value != 'undefined' && value != 'null' ? value : defualtValue;
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

    return result;
}
