import { isNodeOfType } from 'roosterjs-content-model-dom';
import type { DOMSelection, EditorCore, Snapshot } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function restoreSnapshotSelection(core: EditorCore, snapshot: Snapshot) {
    const snapshotSelection = snapshot.selection;
    const { physicalRoot } = core;
    let domSelection: DOMSelection | null = null;

    if (snapshotSelection) {
        switch (snapshotSelection.type) {
            case 'range':
                const startPos = getPositionFromPath(physicalRoot, snapshotSelection.start);
                const endPos = getPositionFromPath(physicalRoot, snapshotSelection.end);
                const range = physicalRoot.ownerDocument.createRange();

                range.setStart(startPos.node, startPos.offset);
                range.setEnd(endPos.node, endPos.offset);

                domSelection = {
                    type: 'range',
                    range,
                    isReverted: snapshotSelection.isReverted,
                };
                break;
            case 'table':
                const table = physicalRoot.querySelector(
                    '#' + snapshotSelection.tableId
                ) as HTMLTableElement;

                if (table) {
                    domSelection = {
                        type: 'table',
                        table: table,
                        firstColumn: snapshotSelection.firstColumn,
                        firstRow: snapshotSelection.firstRow,
                        lastColumn: snapshotSelection.lastColumn,
                        lastRow: snapshotSelection.lastRow,
                    };
                }
                break;
            case 'image':
                const image = physicalRoot.querySelector(
                    '#' + snapshotSelection.imageId
                ) as HTMLImageElement;

                if (image) {
                    domSelection = {
                        type: 'image',
                        image: image,
                    };
                }
                break;
        }
    }

    if (domSelection) {
        core.api.setDOMSelection(core, domSelection);
    }
}

function getPositionFromPath(node: Node, path: number[]): { node: Node; offset: number } {
    // Iterate with a for loop to avoid mutating the passed in element path stack
    // or needing to copy it.
    let offset: number = 0;

    for (let i = 0; i < path.length; i++) {
        offset = path[i];

        if (
            i < path.length - 1 &&
            node &&
            isNodeOfType(node, 'ELEMENT_NODE') &&
            node.childNodes.length > offset
        ) {
            node = node.childNodes[offset];
        } else {
            break;
        }
    }

    return { node, offset };
}
