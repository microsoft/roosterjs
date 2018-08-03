import { unwrap, wrap, getTagOfNode } from 'roosterjs-editor-dom';
import { Editor } from 'roosterjs-editor-core';
import toggleTagCore from './toggleTagCore';

const PRE_TAG = 'pre';
const CODE_TAG = 'code';
const CODE_NODE_TAG = 'CODE';

/**
 * Toggle code block at selection, if selection already contains any code blocked elements,
 * the code block elements will be no longer be code blocked and other elements will take no affect
 * @param editor The editor instance
 */
export default function toggleCodeBlock(editor: Editor, styler?: (element: HTMLElement) => void): void {
    toggleTagCore(editor, PRE_TAG, wrapWithCodeBlock, unwrapIfChildIsCodeBlock, _ => {});
}

function wrapWithCodeBlock(nodes: Node[]): HTMLElement {
    let codeBlock = wrap(nodes, CODE_TAG);
    return wrap(codeBlock, PRE_TAG);
}

function unwrapIfChildIsCodeBlock(node: HTMLElement): Node {
    if (!node || node.childNodes.length != 1) {
        return null;
    }

    let firstChild = node.childNodes[0];
    if (getTagOfNode(firstChild) == CODE_NODE_TAG) {
        unwrap(firstChild);
        return unwrap(node);
    }
}
