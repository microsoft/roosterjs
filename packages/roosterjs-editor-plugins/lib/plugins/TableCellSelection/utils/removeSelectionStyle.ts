import { tableCellSelectionCommon } from './tableCellSelectionCommon';

/**
 * @internal Remove the style tag used
 * @param element element to get the owner document
 */
export function removeSelectionStyle(element: HTMLElement) {
    const doc = element.ownerDocument;

    const style = doc.getElementById(tableCellSelectionCommon.STYLE_TAG_ID);
    if (style) {
        style.parentElement.removeChild(style);
    }
}
