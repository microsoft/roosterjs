import { BlockElement, IEditor, NodeType } from 'roosterjs-editor-types';
import { getTagOfNode, safeInstanceOf, VTable } from 'roosterjs-editor-dom';

/**
 * @internal
 * Collapse all selected blocks, return single HTML elements for each block
 * @param editor The editor instance
 * @param forEachCallback A callback function to invoke for each of the collapsed element
 */
export default function collapseSelectedBlocks(
    editor: IEditor,
    forEachCallback: (element: HTMLElement) => any
) {
    const tableSelection = editor.getTableSelection();
    if (!tableSelection?.vSelection) {
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
    } else {
        const table = editor.getElementAtCursor('table');
        if (safeInstanceOf(table, 'HTMLTableElement')) {
            const vTable = new VTable(table);
            vTable.startRange = tableSelection.startRange;
            vTable.endRange = tableSelection.endRange;

            vTable.forEachSelectedCell(cell => {
                if (cell.td) {
                    forEachCallback(cell.td);
                }
            });
        }
    }
}

function isEmptyBlockUnderTR(block: BlockElement): boolean {
    let startNode = block.getStartNode();

    return (
        startNode == block.getEndNode() &&
        startNode.nodeType == NodeType.Text &&
        ['TR', 'TABLE'].indexOf(getTagOfNode(startNode.parentNode)) >= 0
    );
}
