import type { DOMSelection, EditorCore, Snapshot } from 'roosterjs-content-model-types';
import { getPositionFromPath } from './getPositionFromPath';

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
