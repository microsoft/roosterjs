import { isNodeOfType } from '../domUtils/isNodeOfType';
import { toArray } from '../domUtils/toArray';
import type { ContentModelDocumentWithPersistedCache } from '../modelApi/selection/iterateSelections';
import type {
    ContentModelDocument,
    DOMSelection,
    ModelToDomBlockAndSegmentNode,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

/**
 * Create DOM tree fragment from Content Model document
 * @param doc Document object of the target DOM tree
 * @param root Target node that will become the container of new DOM tree.
 * When a DOM node with existing node is passed, it will be merged with content model so that unchanged blocks
 * won't be touched.
 * @param model The content model document to generate DOM tree from
 * @param context The context object for Content Model to DOM conversion
 * @returns The selection range created in DOM tree from this model, or null when there is no selection
 */
export function contentModelToDom(
    doc: Document,
    root: Node,
    model: ContentModelDocument,
    context: ModelToDomContext
): DOMSelection | null {
    context.modelHandlers.blockGroupChildren(doc, root, model, context);

    const range = extractSelectionRange(doc, context);

    if (model.hasRevertedRangeSelection && range?.type == 'range') {
        range.isReverted = true;
    }

    if (context.domIndexer && context.allowCacheElement) {
        (model as ContentModelDocumentWithPersistedCache).persistCache = true;
    }

    root.normalize();

    return range;
}

function extractSelectionRange(doc: Document, context: ModelToDomContext): DOMSelection | null {
    const {
        regularSelection: { start, end },
        tableSelection,
        imageSelection,
    } = context;

    let startPosition: { container: Node; offset: number } | undefined;
    let endPosition: { container: Node; offset: number } | undefined;

    if (imageSelection) {
        return imageSelection;
    } else if (
        (startPosition = start && calcPosition(start)) &&
        (endPosition = end && calcPosition(end))
    ) {
        const range = doc.createRange();

        range.setStart(startPosition.container, startPosition.offset);
        range.setEnd(endPosition.container, endPosition.offset);

        return {
            type: 'range',
            range,
            isReverted: false,
        };
    } else if (tableSelection) {
        return tableSelection;
    } else {
        return null;
    }
}

function calcPosition(
    pos: ModelToDomBlockAndSegmentNode
): { container: Node; offset: number } | undefined {
    let result: { container: Node; offset: number } | undefined;

    if (pos.block) {
        if (!pos.segment) {
            result = { container: pos.block, offset: 0 };
        } else if (isNodeOfType(pos.segment, 'TEXT_NODE')) {
            result = { container: pos.segment, offset: pos.segment.nodeValue?.length || 0 };
        } else if (pos.segment.parentNode) {
            result = {
                container: pos.segment.parentNode,
                offset:
                    toArray(pos.segment.parentNode.childNodes as NodeListOf<Node>).indexOf(
                        pos.segment
                    ) + 1,
            };
        }
    }

    if (result && isNodeOfType(result.container, 'DOCUMENT_FRAGMENT_NODE')) {
        const childNodes = result.container.childNodes;

        if (childNodes.length > result.offset) {
            result = { container: childNodes[result.offset], offset: 0 };
        } else if (result.container.lastChild) {
            const container = result.container.lastChild;
            result = {
                container,
                offset: isNodeOfType(container, 'TEXT_NODE')
                    ? container.nodeValue?.length ?? 0
                    : container.childNodes.length,
            };
        } else {
            result = undefined;
        }
    }

    return result;
}
