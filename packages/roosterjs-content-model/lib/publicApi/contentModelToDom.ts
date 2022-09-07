import { BlockAndSegmentNode, ModelToDomContext } from '../modelToDom/context/ModelToDomContext';
import { ContentModelContext } from '../publicTypes/ContentModelContext';
import { ContentModelDocument } from '../publicTypes/block/group/ContentModelDocument';
import { createModelToDomContext } from '../modelToDom/context/createModelToDomContext';
import { createRange, Position, toArray } from 'roosterjs-editor-dom';
import { handleBlock } from '../modelToDom/handlers/handleBlock';
import { isNodeOfType } from '../domUtils/isNodeOfType';
import { optimize } from '../modelToDom/optimizers/optimize';
import {
    NodePosition,
    NodeType,
    SelectionRangeEx,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

/**
 * Create DOM tree fragment from Content Model document
 * @param model The content model document to generate DOM tree from
 * @param contentModelContext Content for Content Model
 * @returns A Document Fragment that contains the DOM tree generated from the given model,
 * and a SelectionRangeEx object that contains selection info from the model if any, or null
 */
export default function contentModelToDom(
    model: ContentModelDocument,
    contentModelContext: ContentModelContext
): [DocumentFragment, SelectionRangeEx | null] {
    const fragment = model.document.createDocumentFragment();
    const modelToDomContext = createModelToDomContext(contentModelContext);

    handleBlock(model.document, fragment, model, modelToDomContext);
    optimize(fragment, 2 /*optimizeLevel*/);

    const range = extractSelectionRange(modelToDomContext);

    fragment.normalize();

    return [fragment, range];
}

function extractSelectionRange(context: ModelToDomContext): SelectionRangeEx | null {
    const {
        regularSelection: { start, end },
        tableSelection,
    } = context;
    if (tableSelection?.table) {
        return {
            type: SelectionRangeTypes.TableSelection,
            ranges: [],
            areAllCollapsed: false,
            table: tableSelection.table,
            coordinates: {
                firstCell: tableSelection.firstCell,
                lastCell: tableSelection.lastCell,
                selectionPath: tableSelection.selectionPath,
            },
        };
    }

    if (start && end) {
        const startPosition = calcPosition(start);
        const endPosition = calcPosition(end);
        const range = startPosition && endPosition && createRange(startPosition, endPosition);

        if (range) {
            return {
                type: SelectionRangeTypes.Normal,
                ranges: [range],
                areAllCollapsed: range.collapsed,
            };
        }
    }

    return null;
}

function calcPosition(pos: BlockAndSegmentNode): NodePosition | undefined {
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
