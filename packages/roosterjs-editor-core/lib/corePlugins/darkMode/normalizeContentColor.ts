import { toArray } from 'roosterjs-editor-dom';

const COLOR_DATA_SET_NAMES = ['ogsc', 'ogsb', 'ogac', 'ogab'];

/**
 * @internal
 */
export default function normalizeContentColor(root: HTMLElement) {
    const allChildElements = toArray(root.getElementsByTagName('*'));
    allChildElements.forEach(e => {
        const element = e as HTMLElement;
        if (element.dataset) {
            // Reset color styles based on the content of the ogsc/ogsb data element.
            // If those data properties are empty or do not exist, set them anyway to clear the content.
            element.style.color = isDataAttributeSettable(element.dataset.ogsc)
                ? element.dataset.ogsc
                : '';
            element.style.backgroundColor = isDataAttributeSettable(element.dataset.ogsb)
                ? element.dataset.ogsb
                : '';

            // Some elements might have set attribute colors. We need to reset these as well.
            if (isDataAttributeSettable(element.dataset.ogac)) {
                element.setAttribute('color', element.dataset.ogac);
            } else {
                element.removeAttribute('color');
            }

            if (isDataAttributeSettable(element.dataset.ogab)) {
                element.setAttribute('bgcolor', element.dataset.ogab);
            } else {
                element.removeAttribute('bgcolor');
            }

            // Clean up any remaining data attributes.
            COLOR_DATA_SET_NAMES.forEach(name => {
                delete element.dataset[name];
            });
        }
    });
}

function isDataAttributeSettable(newStyle: string) {
    return newStyle && newStyle != 'undefined' && newStyle != 'null';
}
