import findClosestElementAncestor from 'roosterjs-editor-dom/lib/utils/findClosestElementAncestor';
import getTagOfNode from 'roosterjs-editor-dom/lib/utils/getTagOfNode';
import toArray from 'roosterjs-editor-dom/lib/jsUtils/toArray';
import VTable from 'roosterjs-editor-dom/lib/table/VTable';
import { NodePosition, NodeType, TableOperation } from 'roosterjs-editor-types';

/**
 * @internal
 * @param root The table to paste into
 * @param nodeToInsert A Node containing the table to be inserted
 * @param position The position to paste the table
 */
export default function pasteTable(
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition,
    range: Range
) {
    console.log(nodeToInsert.childNodes);
    if (
        (nodeToInsert.childNodes.length == 1 &&
            getTagOfNode(nodeToInsert.childNodes[0]) == 'TABLE') ||
        (nodeToInsert.childNodes.length == 2 &&
            getTagOfNode(nodeToInsert.childNodes[0]) == 'TABLE' &&
            getTagOfNode(nodeToInsert.childNodes[1]) == 'BR')
    ) {
        let rootNodeToInsert: Node | null = nodeToInsert;

        if (rootNodeToInsert.nodeType == NodeType.DocumentFragment) {
            let rootNodes = toArray(rootNodeToInsert.childNodes).filter(
                (n: ChildNode) => getTagOfNode(n) != 'BR'
            );
            rootNodeToInsert = rootNodes.length == 1 ? rootNodes[0] : null;
        }

        let tdNode = findClosestElementAncestor(position.node, root, 'TD,TH');

        // This is the table on the clipboard
        let newTable = new VTable(<HTMLTableElement>rootNodeToInsert);
        // This table is already on the editor
        let currentCell = new VTable(<HTMLTableCellElement>tdNode);

        let currentRow = currentCell.row!;
        let currentCol = currentCell.col!;

        let rows = currentRow + newTable.cells?.length!;
        let columns = currentCol + newTable.cells?.[0].length!;

        while (currentCell.cells!.length! < rows) {
            currentCell.edit(TableOperation.InsertBelow);
        }

        while (currentCell.cells![0].length < columns) {
            currentCell.edit(TableOperation.InsertRight);
        }

        for (let i = currentRow; i < rows; i++) {
            for (let j = currentCol; j < columns; j++) {
                let cell = currentCell.getCell(i, j);
                let newcell = newTable.getTd(i - currentRow, j - currentCol);
                if (!cell.spanAbove && !cell.spanLeft) {
                    if (newcell.hasChildNodes()) {
                        // Prevent double <br>
                        cell.td?.removeChild(cell.td.lastChild);
                        newcell.childNodes.forEach(child => {
                            cell.td.append(child);
                        });
                    }
                }
            }
        }

        currentCell.writeBack();
    }
}
