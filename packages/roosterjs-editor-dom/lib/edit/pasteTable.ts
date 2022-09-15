import findClosestElementAncestor from 'roosterjs-editor-dom/lib/utils/findClosestElementAncestor';
import getTagOfNode from 'roosterjs-editor-dom/lib/utils/getTagOfNode';
import toArray from 'roosterjs-editor-dom/lib/jsUtils/toArray';
import VTable from 'roosterjs-editor-dom/lib/table/VTable';
import { NodePosition, NodeType, TableOperation } from 'roosterjs-editor-types';

/**
 * @internal
 * STILL NOT WRITTEN
 *
 */
export default function pasteTable(
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition,
    range: Range
) {
    if (
        (nodeToInsert.childNodes.length >= 1 &&
            getTagOfNode(nodeToInsert.childNodes[0]) == 'TABLE') ||
        getTagOfNode(nodeToInsert) == 'TABLE'
    ) {
        let rootNodeToInsert: Node | null = nodeToInsert;

        if (rootNodeToInsert.nodeType == NodeType.DocumentFragment) {
            let rootNodes = toArray(rootNodeToInsert.childNodes).filter(
                (n: ChildNode) => getTagOfNode(n) != 'BR'
            );
            rootNodeToInsert = rootNodes.length == 1 ? rootNodes[0] : null;
        }

        let tdNode = findClosestElementAncestor(position.node, root, 'TD,TH');
        //let trNode = tdNode && findClosestElementAncestor(tdNode, root, 'TR');

        let newTable = new VTable(<HTMLTableElement>rootNodeToInsert);
        let currentcell = new VTable(<HTMLTableCellElement>tdNode);

        let rows = currentcell.row + newTable.cells?.length;
        let columns = currentcell.col + newTable.cells?.[0].length;

        while (currentcell.cells.length < rows) {
            currentcell.edit(TableOperation.InsertBelow);
        }

        while (currentcell.cells[0].length < columns) {
            currentcell.edit(TableOperation.InsertRight);
        }

        for (let i = currentcell.row; i < rows; i++) {
            for (let j = currentcell.col; j < columns; j++) {
                let cell = currentcell.getCell(i, j);
                let newcell = newTable.getTd(i - currentcell.row, j - currentcell.col);
                if (!cell.spanAbove && !cell.spanLeft) {
                    if (newcell.hasChildNodes()) {
                        newcell.childNodes.forEach(child => {
                            cell.td.append(child);
                        });
                    }
                }
            }
        }

        currentcell.writeBack();

        return null as Node;
    }
}

void function addEmpty(tr: HTMLTableRowElement, prevtr: HTMLTableRowElement) {
    tr.appendChild(prevtr.firstChild.cloneNode());
};
