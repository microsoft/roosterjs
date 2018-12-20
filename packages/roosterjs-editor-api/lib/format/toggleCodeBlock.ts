import toggleTagCore from '../utils/toggleTagCore';
import { Editor } from 'roosterjs-editor-core';
import { getTagOfNode, unwrap, wrap } from 'roosterjs-editor-dom';

const PRE_TAG = 'pre';
const CODE_TAG = 'code';
const CODE_NODE_TAG = 'CODE';

/**
 * Toggle code block at selection, if selection already contains any code blocked elements,
 * the code block elements will be no longer be code blocked and other elements will take no affect
 * @param editor The editor instance
 * @param styler (Optional) The custom styler for setting the style for the code block element
 */
export default function toggleCodeBlock(
    editor: Editor,
    styler?: (element: HTMLElement) => void
): void {
    toggleTagCore(editor, PRE_TAG, styler, wrapFunction, unwrapFunction);
}

function wrapFunction(nodes: Node[]): HTMLElement {
    let codeBlock = wrap(nodes, CODE_TAG);
    return wrap(codeBlock, PRE_TAG);
}

function unwrapFunction(node: HTMLElement): Node {
    if (!node) {
        return null;
    }

    let firstChild = node.childNodes[0];
    if (node.childNodes.length == 1 && getTagOfNode(firstChild) == CODE_NODE_TAG) {
        unwrap(firstChild);
    }

    return unwrap(node);
}
