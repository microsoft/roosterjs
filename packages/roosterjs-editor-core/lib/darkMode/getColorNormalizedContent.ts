export default function getColorNormalizedContent(content: string | DocumentFragment): string {
    let el = document.createElement('div');
    // Leverage script execution policy on CEDs to try and prevent XSS
    el.setAttribute('contenteditable', 'true');
    if (content instanceof DocumentFragment) {
        el.appendChild(content);
    } else {
        el.innerHTML = content;
    }
    const allChildElements = el.getElementsByTagName('*') as HTMLCollectionOf<HTMLElement>;
    [].forEach.call(allChildElements, (element: HTMLElement) => {
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
            if (element.dataset.ogsc) {
                delete element.dataset.ogsc;
            }

            if (element.dataset.ogsb) {
                delete element.dataset.ogsb;
            }

            if (element.dataset.ogac) {
                delete element.dataset.ogac;
            }

            if (element.dataset.ogab) {
                delete element.dataset.ogab;
            }
        }
    });
    const newContent = el.innerHTML;
    return newContent;
}

function isDataAttributeSettable(newStyle: string) {
    return newStyle && newStyle != 'undefined' && newStyle != 'null';
}
