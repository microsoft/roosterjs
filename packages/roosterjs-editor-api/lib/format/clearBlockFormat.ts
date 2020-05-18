import collapseSelectedBlocks from '../utils/collapseSelectedBlocks';
import { ChangeSource, NodeType } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import {
    getTagOfNode,
    isBlockElement,
    unwrap,
    wrap,
    splitBalancedNodeRange,
    toArray,
} from 'roosterjs-editor-dom';

export const TAGS_TO_UNWRAP = 'B,I,U,STRONG,EM,SUB,SUP,STRIKE,FONT,CENTER,H1,H2,H3,H4,H5,H6,UL,OL,LI,SPAN,P,BLOCKQUOTE,CODE,S,PRE'.split(
    ','
);
export const TAGS_TO_STOP_UNWRAP = ['TD', 'TH', 'TR', 'TABLE', 'TBODY', 'THEAD'];
export const ATTRIBUTES_TO_PRESERVE = ['href'];

/**
 * Clear all formats of selected blocks.
 * When selection is collapsed, only clear format of current block.
 * @param editor The editor instance
 * @param tagsToUnwrap Optional. A string array contains HTML tags in upper case which we will unwrap when clear format
 * @param tagsToStopUnwrap Optional. A string array contains HTML tags in upper case which we will stop unwrap if these tags are hit
 */
export default function clearBlockFormat(
    editor: Editor,
    tagsToUnwrap: string[] = TAGS_TO_UNWRAP,
    tagsToStopUnwrap: string[] = TAGS_TO_STOP_UNWRAP,
    attributesToPreserve: string[] = ATTRIBUTES_TO_PRESERVE
) {
    editor.focus();
    editor.addUndoSnapshot((start, end) => {
        let groups: {
            first?: HTMLElement;
            last?: HTMLElement;
            td?: HTMLElement;
        }[] = [{}];
        let stopUnwrapSelector = tagsToStopUnwrap.join(',');

        // 1. Collapse the selected blocks and get first and last element
        collapseSelectedBlocks(editor, element => {
            let group = groups[groups.length - 1];
            let td = editor.getElementAtCursor(stopUnwrapSelector, element);
            if (td != group.td && group.first) {
                groups.push((group = {}));
            }

            group.td = td;
            group.first = group.first || element;
            group.last = element;
        });

        groups
            .filter(group => group.first)
            .forEach(group => {
                // 2. Collapse with first and last element to make them under same parent
                let nodes = editor.collapseNodes(group.first, group.last, true /*canSplitParent*/);

                // 3. Continue collapse until we can't collapse any more (hit root node, or a table)
                if (canCollapse(tagsToStopUnwrap, nodes[0])) {
                    while (
                        editor.contains(nodes[0].parentNode) &&
                        canCollapse(tagsToStopUnwrap, nodes[0].parentNode as HTMLElement)
                    ) {
                        nodes = [splitBalancedNodeRange(nodes)];
                    }
                }

                // 4. Clear formats of the nodes
                nodes.forEach(node =>
                    clearNodeFormat(
                        node as HTMLElement,
                        tagsToUnwrap,
                        tagsToStopUnwrap,
                        attributesToPreserve
                    )
                );

                // 5. Clear CSS of container TD if exist
                if (group.td) {
                    let styles = group.td.getAttribute('style') || '';
                    let styleArray = styles.split(';');
                    styleArray = styleArray.filter(
                        style => style.trim().toLowerCase().indexOf('border') == 0
                    );
                    styles = styleArray.join(';');
                    if (styles) {
                        group.td.setAttribute('style', styles);
                    } else {
                        group.td.removeAttribute('style');
                    }
                }
            });

        editor.select(start, end);
    }, ChangeSource.Format);
}

function clearNodeFormat(
    node: Node,
    tagsToUnwrap: string[],
    tagsToStopUnwrap: string[],
    attributesToPreserve: string[]
): boolean {
    if (node.nodeType != NodeType.Element || getTagOfNode(node) == 'BR') {
        return false;
    }

    // 1. Recursively clear format of all its child nodes
    let allChildrenAreBlock = toArray(node.childNodes)
        .map(n => clearNodeFormat(n, tagsToUnwrap, tagsToStopUnwrap, attributesToPreserve))
        .reduce((previousValue, value) => previousValue && value, true);

    if (!canCollapse(tagsToStopUnwrap, node)) {
        return false;
    }

    let returnBlockElement = isBlockElement(node);

    // 2. If we should unwrap this tag, put it into an array and unwrap it later
    if (tagsToUnwrap.indexOf(getTagOfNode(node)) >= 0 || allChildrenAreBlock) {
        if (returnBlockElement && !allChildrenAreBlock) {
            wrap(node);
        }
        unwrap(node);
    } else {
        // 3. Otherwise, remove all attributes
        clearAttribute(node as HTMLElement, attributesToPreserve);
    }

    return returnBlockElement;
}

function clearAttribute(element: HTMLElement, attributesToPreserve: string[]) {
    for (let attr of toArray(element.attributes)) {
        if (
            attributesToPreserve.indexOf(attr.name.toLowerCase()) < 0 &&
            attr.name.indexOf('data-') != 0
        ) {
            element.removeAttribute(attr.name);
        }
    }
}

function canCollapse(tagsToStopUnwrap: string[], node: Node) {
    return tagsToStopUnwrap.indexOf(getTagOfNode(node)) < 0;
}
