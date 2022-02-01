import { removeSelectionStyle } from './removeSelectionStyle';
import { tableCellSelectionCommon } from './tableCellSelectionCommon';

/**
 * @internal Remove the style tag used
 * @param element element to get the owner document
 */
export function insertSelectionStyle(element: HTMLElement, doc: Document) {
    doc = doc ?? element.ownerDocument;
    const css = `._tableSelected ._tableCellSelected { background-color: ${tableCellSelectionCommon.HIGHLIGHT_COLOR} !important }`;
    removeSelectionStyle(doc);

    const style = doc.createElement('style');
    style.id = tableCellSelectionCommon.STYLE_TAG_ID;
    style.appendChild(doc.createTextNode(css));
    doc.head.appendChild(style);
}
