import { isEntityElement } from '../../domUtils/entityUtils';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { mergeNode } from './mergeNode';
import { removeUnnecessarySpan } from './removeUnnecessarySpan';
import type {
    ModelToDomBlockAndSegmentNode,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function optimize(root: Node, context: ModelToDomContext) {
    /**
     * Do no do any optimization to entity
     */
    if (isEntityElement(root)) {
        return;
    }

    removeUnnecessarySpan(root);
    mergeNode(root);

    for (let child = root.firstChild; child; child = child.nextSibling) {
        optimize(child, context);
    }

    normalizeTextNode(root, context);
}

// Merge continuous text nodes into one single node (same with normalize()),
// and update selection and dom indexes
function normalizeTextNode(root: Node, context: ModelToDomContext) {
    let lastText: Text | null = null;
    let child: Node | null;
    let next: Node | null;
    const selection = context.regularSelection;

    for (
        child = root.firstChild, next = child ? child.nextSibling : null;
        child;
        child = next, next = child ? child.nextSibling : null
    ) {
        if (!isNodeOfType(child, 'TEXT_NODE')) {
            lastText = null;
        } else if (!lastText) {
            lastText = child;
        } else {
            const originalLength = lastText.nodeValue?.length ?? 0;

            context.domIndexer?.onMergeText(lastText, child);
            lastText.nodeValue += child.nodeValue ?? '';

            if (selection) {
                updateSelection(selection.start, lastText, child, originalLength);
                updateSelection(selection.end, lastText, child, originalLength);
            }

            root.removeChild(child);
        }
    }
}

function updateSelection(
    mark: ModelToDomBlockAndSegmentNode | undefined,
    lastText: Text,
    nextText: Text,
    lastTextOriginalLength: number
) {
    if (mark && mark.offset == undefined) {
        if (mark.segment == lastText) {
            mark.offset = lastTextOriginalLength;
        } else if (mark.segment == nextText) {
            mark.segment = lastText;
        }
    }
}
