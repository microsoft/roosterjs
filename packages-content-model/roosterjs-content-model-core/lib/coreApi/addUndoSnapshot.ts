import { isNodeOfType } from 'roosterjs-content-model-dom';
import type {
    AddUndoSnapshot,
    DOMSelection,
    UndoSnapshot,
    UndoSnapshotSelection,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Add an undo snapshot to current undo snapshot stack
 * @param core The StandaloneEditorCore object
 * @param canUndoByBackspace True if this action can be undone when user press Backspace key (aka Auto Complete).
 * @param entityStates @optional Entity states related to this snapshot.
 * Each entity state will cause an EntityOperation event with operation = EntityOperation.UpdateEntityState
 * when undo/redo to this snapshot
 */
export const addUndoSnapshot: AddUndoSnapshot = (core, canUndoByBackspace, entityStates) => {
    const { lifecycle, api, contentDiv, darkColorHandler, undo } = core;

    if (!lifecycle.shadowEditFragment) {
        const selection = api.getDOMSelection(core);
        const snapshot: UndoSnapshot = {
            html: contentDiv.innerHTML,
            knownColors: darkColorHandler.getKnownColorsCopy(),
            entityStates,
            isDarkMode: !!lifecycle.isDarkMode,
            selection: createUndoSnapshotSelection(contentDiv, selection),
        };

        undo.snapshotsService.addSnapshot(snapshot, !!canUndoByBackspace);
        undo.hasNewContent = false;

        return snapshot;
    } else {
        return null;
    }
};

function createUndoSnapshotSelection(
    contentDiv: HTMLDivElement,
    selection: DOMSelection | null
): UndoSnapshotSelection {
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
            };

        default:
            return {
                type: 'range',
                start: [],
                end: [],
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
