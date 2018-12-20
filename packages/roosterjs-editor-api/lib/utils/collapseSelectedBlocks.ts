import { BlockElement, NodeType } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { StartEndBlockElement, getTagOfNode } from 'roosterjs-editor-dom';

/**
 * Collapse all selected blocks, return single HTML elements for each block
 * @param editor The editor instance
 * @param forEachCallback A callback function to invoke for each of the collapsed element
 */
export default function collapseSelectedBlocked(
    editor: Editor,
    forEachCallback: (element: HTMLElement) => any
) {
    let traverser = editor.getSelectionTraverser();
    let block = traverser && traverser.currentBlockElement;
    let blocks: BlockElement[] = [];
    while (block) {
        if (!isEmptyBlockUnderTR(block)) {
            blocks.push(block);
        }
        block = traverser.getNextBlockElement();
    }

    blocks.forEach(block => {
        let element = block.collapseToSingleElement();
        forEachCallback(element);
    });
}

function isEmptyBlockUnderTR(block: BlockElement): boolean {
    let startNode = block.getStartNode();

    return (
        block instanceof StartEndBlockElement &&
        startNode == block.getEndNode() &&
        startNode.nodeType == NodeType.Text &&
        ['TR', 'TABLE'].indexOf(getTagOfNode(startNode.parentNode)) >= 0
    );
}
