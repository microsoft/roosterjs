import { removeSelectionStyle } from './removeSelectionStyle';
import { tableCellSelectionCommon } from './tableCellSelectionCommon';

/**
 * @internal Remove the style tag used
 * @param element element to get the owner document
 */
export function insertSelectionStyle(element: HTMLElement) {
    const css = `._tableSelected ._tableCellSelected { background-color: ${tableCellSelectionCommon.HIGHLIGHT_COLOR} !important }`;
    const doc = element.ownerDocument;
    removeSelectionStyle(element);

    const style = doc.createElement('style');
    style.id = tableCellSelectionCommon.STYLE_TAG_ID;
    style.appendChild(doc.createTextNode(css));
    document.head.appendChild(style);
}
