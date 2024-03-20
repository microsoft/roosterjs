import { isElementOfType, isNodeOfType, moveChildNodes } from 'roosterjs-content-model-dom';
import type { EditorCore, SnapshotSelection } from 'roosterjs-content-model-types';
import { getPath } from './getPath';

/**
 * @internal
 */
export function createSnapshotSelection(core: EditorCore): SnapshotSelection {
    const { physicalRoot, api } = core;
    const selection = api.getDOMSelection(core);

    // Normalize tables to ensure they have TBODY element between TABLE and TR so that the selection path will include correct values
    if (selection?.type == 'range') {
        const { startContainer, startOffset, endContainer, endOffset } = selection.range;
        let isDOMChanged = normalizeTableTree(startContainer, physicalRoot);

        if (endContainer != startContainer) {
            isDOMChanged = normalizeTableTree(endContainer, physicalRoot) || isDOMChanged;
        }

        if (isDOMChanged) {
            const newRange = physicalRoot.ownerDocument.createRange();

            newRange.setStart(startContainer, startOffset);
            newRange.setEnd(endContainer, endOffset);
            api.setDOMSelection(
                core,
                {
                    type: 'range',
                    range: newRange,
                    isReverted: !!selection.isReverted,
                },
                true /*skipSelectionChangedEvent*/
            );
        }
    }

    switch (selection?.type) {
        case 'image':
            return {
                type: 'image',
                imageId: selection.image.id,
            };

        case 'table':
            return {
                type: 'table',
                tableId: selection.table.id,
                firstColumn: selection.firstColumn,
                lastColumn: selection.lastColumn,
                firstRow: selection.firstRow,
                lastRow: selection.lastRow,
            };

        case 'range':
            const range = selection.range;

            return {
                type: 'range',
                start: getPath(range.startContainer, range.startOffset, physicalRoot),
                end: getPath(range.endContainer, range.endOffset, physicalRoot),
                isReverted: !!selection.isReverted,
            };

        default:
            return {
                type: 'range',
                start: [],
                end: [],
                isReverted: false,
            };
    }
}

function normalizeTableTree(startNode: Node, root: Node) {
    let node: Node | null = startNode;
    let isDOMChanged = false;

    while (node && root.contains(node)) {
        if (isNodeOfType(node, 'ELEMENT_NODE') && isElementOfType(node, 'table')) {
            isDOMChanged = normalizeTable(node) || isDOMChanged;
        }

        node = node.parentNode;
    }

    return isDOMChanged;
}

function normalizeTable(table: HTMLTableElement): boolean {
    let isDOMChanged = false;
    let tbody: HTMLTableSectionElement | null = null;

    for (let child = table.firstChild; child; child = child.nextSibling) {
        const tag = isNodeOfType(child, 'ELEMENT_NODE') ? child.tagName : null;

        switch (tag) {
            case 'TR':
                if (!tbody) {
                    tbody = table.ownerDocument.createElement('tbody');
                    table.insertBefore(tbody, child);
                }

                tbody.appendChild(child);
                child = tbody;
                isDOMChanged = true;

                break;
            case 'TBODY':
                if (tbody) {
                    moveChildNodes(tbody, child, true /*keepExistingChildren*/);
                    child.parentNode?.removeChild(child);
                    child = tbody;
                    isDOMChanged = true;
                } else {
                    tbody = child as HTMLTableSectionElement;
                }
                break;
            default:
                tbody = null;
                break;
        }
    }

    const colgroups = table.querySelectorAll('colgroup');
    const thead = table.querySelector('thead');

    if (thead) {
        colgroups.forEach(colgroup => {
            if (!thead.contains(colgroup)) {
                thead.appendChild(colgroup);
            }
        });
    }

    return isDOMChanged;
}
