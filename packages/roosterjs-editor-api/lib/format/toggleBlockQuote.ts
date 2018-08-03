import { Editor } from 'roosterjs-editor-core';
import { unwrap, wrap } from 'roosterjs-editor-dom';
import toggleTagCore from './toggleTagCore';

const BLOCKQUOTE_TAG = 'blockquote';
const defaultStyler = (element: HTMLElement): void => {
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
    toggleTagCore(editor, BLOCKQUOTE_TAG, wrapFunction, unwrapFunction, styler || defaultStyler);
}

function wrapFunction(nodes: Node[]): HTMLElement {
    return wrap(nodes, BLOCKQUOTE_TAG);
}

function unwrapFunction(node: HTMLElement): Node {
    return unwrap(node);
}
