import toggleTagCore from '../utils/toggleTagCore';
import { Editor } from 'roosterjs-editor-core';

const BLOCKQUOTE_TAG = 'blockquote';
const DEFAULT_STYLER = (element: HTMLElement): void => {
    element.style.borderLeft = '3px solid';
    element.style.borderColor = '#C8C8C8';
    element.style.paddingLeft = '10px';
    element.style.color = '#666666';
};

/**
 * Toggle blockquote at selection, if selection already contains any blockquoted elements,
 * the blockquoted elements will be unblockquoted and other elements will take no affect
 * @param editor The editor instance
 * @param styler (Optional) The custom styler for setting the style for the blockquote element
 */
export default function toggleBlockQuote(editor: Editor, styler?: (element: HTMLElement) => void) {
    toggleTagCore(editor, BLOCKQUOTE_TAG, styler || DEFAULT_STYLER);
}
