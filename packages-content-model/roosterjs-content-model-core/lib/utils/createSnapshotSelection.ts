import { isElementOfType, isNodeOfType, moveChildNodes } from 'roosterjs-content-model-dom';
import type { SnapshotSelection, StandaloneEditorCore } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createSnapshotSelection(core: StandaloneEditorCore): SnapshotSelection {
    const { contentDiv, api } = core;
    const selection = api.getDOMSelection(core);

    // Normalize tables to ensure they have TBODY element between TABLE and TR so that the selection path will include correct values
    if (selection?.type == 'range') {
        const { startContainer, startOffset, endContainer, endOffset } = selection.range;
        let isDOMChanged = normalizeTableTree(startContainer, contentDiv);

        if (endContainer != startContainer) {
            isDOMChanged = normalizeTableTree(endContainer, contentDiv) || isDOMChanged;
        }

        if (isDOMChanged) {
            const newRange = contentDiv.ownerDocument.createRange();

            newRange.setStart(startContainer, startOffset);
            newRange.setEnd(endContainer, endOffset);
            api.setDOMSelection(
                core,
                {
                    type: 'range',
                    range: newRange,
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
                start: getPath(range.startContainer, range.startOffset, contentDiv),
                end: getPath(range.endContainer, range.endOffset, contentDiv),
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

/**
 * Get the path of the node relative to rootNode.
 * The path of the node is an array of integer indices into the childNodes of the given node.
 *
 * The node path will be what the node path will be on a _normalized_ dom
 * (e.g. empty text nodes will be ignored and adjacent text nodes will be concatenated)
 *
 * @param rootNode the node the path will be relative to
 * @param position the position to get indexes from. Follows the same semantics
 * as selectionRange (if node is of type Text, it is an offset into the text of that node.
 * If node is of type Element, it is the index of a child in that Element node.)
 */
function getPath(node: Node | null, offset: number, rootNode: Node): number[] {
    const result: number[] = [];
    let parent: Node | null;

    if (!node || !rootNode.contains(node)) {
        return result;
    }

    if (isNodeOfType(node, 'TEXT_NODE')) {
        parent = node.parentNode;

        while (node.previousSibling && isNodeOfType(node.previousSibling, 'TEXT_NODE')) {
            offset += node.previousSibling.nodeValue?.length || 0;
            node = node.previousSibling;
        }

        result.unshift(offset);
    } else {
        parent = node;
        node = node.childNodes[offset];
    }

    do {
        offset = 0;
        let isPreviousText = false;

        for (let c: Node | null = parent?.firstChild || null; c && c != node; c = c.nextSibling) {
            if (isNodeOfType(c, 'TEXT_NODE')) {
                if (c.nodeValue?.length === 0 || isPreviousText) {
                    continue;
                }

                isPreviousText = true;
            } else {
                isPreviousText = false;
            }

            offset++;
        }

        result.unshift(offset);
        node = parent;
        parent = parent?.parentNode || null;
    } while (node && node != rootNode);

    return result;
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
