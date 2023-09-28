import { createRange, Position, toArray } from 'roosterjs-editor-dom';
import { isNodeOfType } from '../domUtils/isNodeOfType';
import type {
    ContentModelDocument,
    DOMSelection,
    ModelToDomBlockAndSegmentNode,
    ModelToDomContext,
    OnNodeCreated,
} from 'roosterjs-content-model-types';
import type { NodePosition } from 'roosterjs-editor-types';

/**
 * Create DOM tree fragment from Content Model document
 * @param doc Document object of the target DOM tree
 * @param root Target node that will become the container of new DOM tree.
 * When a DOM node with existing node is passed, it will be merged with content model so that unchanged blocks
 * won't be touched.
 * @param model The content model document to generate DOM tree from
 * @param context The context object for Content Model to DOM conversion
 * @param onNodeCreated Callback invoked when a DOM node is created
 * @returns The selection range created in DOM tree from this model, or null when there is no selection
 */
export function contentModelToDom(
    doc: Document,
    root: Node,
    model: ContentModelDocument,
    context: ModelToDomContext,
    onNodeCreated?: OnNodeCreated
): DOMSelection | null {
    context.onNodeCreated = onNodeCreated;

    context.modelHandlers.blockGroupChildren(doc, root, model, context);

    const range = extractSelectionRange(context);

    root.normalize();

    return range;
}

function extractSelectionRange(context: ModelToDomContext): DOMSelection | null {
    const {
        regularSelection: { start, end },
        tableSelection,
        imageSelection,
    } = context;

    let startPosition: NodePosition | undefined;
    let endPosition: NodePosition | undefined;

    if (imageSelection) {
        return imageSelection;
    } else if (
        (startPosition = start && calcPosition(start)) &&
        (endPosition = end && calcPosition(end))
    ) {
        return {
            type: 'range',
            range: createRange(startPosition, endPosition),
        };
    } else if (tableSelection) {
        return tableSelection;
    } else {
        return null;
    }
}

function calcPosition(pos: ModelToDomBlockAndSegmentNode): NodePosition | undefined {
    let result: NodePosition | undefined;

    if (pos.block) {
        if (!pos.segment) {
            result = new Position(pos.block, 0);
        } else if (isNodeOfType(pos.segment, 'TEXT_NODE')) {
            result = new Position(pos.segment, pos.segment.nodeValue?.length || 0);
        } else {
            result = new Position(
                pos.segment.parentNode!,
                toArray(pos.segment.parentNode!.childNodes as NodeListOf<Node>).indexOf(
                    pos.segment!
                ) + 1
            );
        }
    }

    if (isNodeOfType(result?.node, 'DOCUMENT_FRAGMENT_NODE')) {
        result = result?.normalize();
    }

    return result;
}
