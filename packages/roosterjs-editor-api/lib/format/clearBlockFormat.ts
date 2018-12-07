import collapseSelectedBlocks from '../utils/collapseSelectedBlocks';
import { Editor } from 'roosterjs-editor-core';
import {
    getTagOfNode,
    isBlockElement,
    unwrap,
    wrap,
    shouldSkipNode,
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
        let groups: {
            first?: HTMLElement;
            last?: HTMLElement;
            td?: HTMLElement;
        }[] = [{}];
        let group = groups[0];

        // 1. Collapse the selected blocks and get first and last element
        collapseSelectedBlocks(editor, element => {
            let td = editor.getElementAtCursor(tagsToStopUnwrap.join(','), element);
            if (td != group.td && group.first) {
                group = { td };
                groups.push(group);
            } else {
                group.td = td;
            }

            group.first = group.first || element;
            group.last = element;
        });

        groups.forEach(group => {
            let { first, last } = group;

            // 2. Collapse with first and last element to make them under same parent
            let elements = editor.collapseNodes(first, last, true /*canSplitParent*/);

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
                .forEach(element => clearTagFormat(element as HTMLElement, tagsToUnWrap, tagsToStopUnwrap));

        });

        editor.select(start, end);
    }, ChangeSource.Format);
}

function clearTagFormat(element: HTMLElement, tagsToUnWrap: string[], tagsToStopUnwrap: string[]) {
    // 1. Recursively clear format of all its child nodes
    for (let child of [].slice.call(element.childNodes) as Node[]) {
        if (child.nodeType == NodeType.Element) {
            clearTagFormat(child as HTMLElement, tagsToUnWrap, tagsToStopUnwrap);
        }
    }

    let canProcessElement = tagsToStopUnwrap.indexOf(getTagOfNode(element)) < 0;

    // 2. If we should unwrap this tag, put it into an array and unwrap it later
    if (tagsToUnWrap.indexOf(getTagOfNode(element)) >= 0) {
        let temp = element;
        if (isBlockElement(element)) {
            temp = wrap(element);
        }
        unwrap(element);
        element = temp;
    } else if (canProcessElement) {
        // 3. Otherwise, remove all attributes
        for (let attr of [].slice.call(element.attributes) as Attr[]) {
            element.removeAttributeNode(attr);
        }
    }

    if (canProcessElement) {
        let hasInlineElement = false;
        for (let child: Node = element.firstChild; child && !hasInlineElement; child = child.nextSibling) {
            hasInlineElement = !isBlockElement(child) && !shouldSkipNode(child);
        }

        if (!hasInlineElement) {
            unwrap(element);
        }
    }
}
