import { createRange, Position, toArray } from 'roosterjs-editor-dom';
import { isNodeOfType } from '../domUtils/isNodeOfType';
import {
    ContentModelDocument,
    ModelToDomBlockAndSegmentNode,
    ModelToDomContext,
    OnNodeCreated,
} from 'roosterjs-content-model-types';
import {
    NodePosition,
    NodeType,
    SelectionRangeEx,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

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
): SelectionRangeEx | null {
    context.onNodeCreated = onNodeCreated;

    context.modelHandlers.blockGroupChildren(doc, root, model, context);

    const range = extractSelectionRange(context);

    root.normalize();

    return range;
}

function extractSelectionRange(context: ModelToDomContext): SelectionRangeEx | null {
    const {
        regularSelection: { start, end },
        tableSelection,
        imageSelection,
    } = context;

    let startPosition: NodePosition | undefined;
    let endPosition: NodePosition | undefined;

    if (imageSelection?.image) {
        return {
            type: SelectionRangeTypes.ImageSelection,
            ranges: [createRange(imageSelection.image)],
            areAllCollapsed: false,
            image: imageSelection.image,
        };
    } else if (
        (startPosition = start && calcPosition(start)) &&
        (endPosition = end && calcPosition(end))
    ) {
        const range = createRange(startPosition, endPosition);

        return {
            type: SelectionRangeTypes.Normal,
            ranges: [createRange(startPosition, endPosition)],
            areAllCollapsed: range.collapsed,
        };
    } else if (tableSelection?.table) {
        return {
            type: SelectionRangeTypes.TableSelection,
            ranges: [],
            areAllCollapsed: false,
            table: tableSelection.table,
            coordinates: {
                firstCell: tableSelection.firstCell,
                lastCell: tableSelection.lastCell,
            },
        };
    } else {
        return null;
    }
}

function calcPosition(pos: ModelToDomBlockAndSegmentNode): NodePosition | undefined {
    let result: NodePosition | undefined;

    if (pos.block) {
        if (!pos.segment) {
            result = new Position(pos.block, 0);
        } else if (isNodeOfType(pos.segment, NodeType.Text)) {
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

    if (isNodeOfType(result?.node, NodeType.DocumentFragment)) {
        result = result?.normalize();
    }

    return result;
}
