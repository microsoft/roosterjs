import { tableCellSelectionCommon } from './tableCellSelectionCommon';

/**
 * @internal Remove the style tag used
 * @param document element to get the owner document
 */
export function removeSelectionStyle(document: Document) {
    if (document) {
        const style = document.getElementById(tableCellSelectionCommon.STYLE_TAG_ID);
        if (style) {
            style.parentElement.removeChild(style);
        }
    }
}
