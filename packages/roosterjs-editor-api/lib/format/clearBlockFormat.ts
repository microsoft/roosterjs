import collapseSelectedBlocks from '../utils/collapseSelectedBlocks';
import { Editor } from 'roosterjs-editor-core';
import {
    getTagOfNode,
    isBlockElement,
    unwrap,
    wrap,
    splitBalancedNodeRange,
} from 'roosterjs-editor-dom';
import { ChangeSource, NodeType } from 'roosterjs-editor-types';

const TAGS_TO_UNWRAP = 'B,I,U,STRONG,EM,SUB,SUP,STRIKE,FONT,CENTER,A,H1,H2,H3,H4,H5,H6,UL,OL,LI,SPAN,P,BLOCKQUOTE,CODE'.split(
    ','
);
const TAGS_TO_STOP_UNWRAP = ['TD', 'TH', 'TR', 'TABLE', 'TBODY', 'THEAD'];

/**
 * Clear all formats of selected blocks.
 * When selection is collapsed, only clear format of current block.
 * @param editor The editor instance
 * @param tagsToUnWrap Optional. A string array contains HTML tags in upper case which we will unwrap when clear format
 * @param tagsToStopUnwrap Optional. A string array contains HTML tags in upper case which we will stop unwrap if these tags are hit
 */
export default function clearBlockFormat(
    editor: Editor,
    tagsToUnWrap?: string[],
    tagsToStopUnwrap?: string[]
) {
    tagsToUnWrap = tagsToUnWrap || TAGS_TO_UNWRAP;
    tagsToStopUnwrap = tagsToStopUnwrap || TAGS_TO_STOP_UNWRAP;

    editor.focus();

    editor.addUndoSnapshot((start, end) => {
        // 1. Collapse the selected blocks and get first and last element
        let firstElement: HTMLElement;
        let lastElement: HTMLElement;
        collapseSelectedBlocks(editor, element => {
            firstElement = firstElement || element;
            lastElement = element;
        });

        // 2. Collapse with first and last element to make them under same parent
        let elements = editor.collapseNodes(firstElement, lastElement, true /*canSplitParent*/);

        // 3. Continue collapse until we can't collapse any more (hit root node, or a table)
        while (
            editor.contains(elements[0].parentNode) &&
            tagsToStopUnwrap.indexOf(getTagOfNode(elements[0].parentNode)) < 0
        ) {
            elements = [splitBalancedNodeRange(elements)];
        }

        // 4. Clear formats of the nodes
        elements
            .filter(element => element.nodeType == NodeType.Element)
            .forEach(element => clearTagFormat(element as HTMLElement, tagsToUnWrap));

        editor.select(start, end);
    }, ChangeSource.Format);
}

function clearTagFormat(element: HTMLElement, tagsToUnWrap: string[]) {
    // 1. Recursively clear format of all its child nodes
    for (let child of [].slice.call(element.childNodes) as Node[]) {
        if (child.nodeType == NodeType.Element) {
            clearTagFormat(child as HTMLElement, tagsToUnWrap);
        }
    }

    // 2. If we should unwrap this tag, put it into an array and unwrap it later
    if (tagsToUnWrap.indexOf(getTagOfNode(element)) >= 0) {
        if (isBlockElement(element)) {
            wrap(element);
        }
        unwrap(element);
    } else {
        // 3. Otherwise, remove all its attributes
        for (let attr of [].slice.call(element.attributes) as Attr[]) {
            element.removeAttributeNode(attr);
        }
    }
}
