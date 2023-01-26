import { ContentModelDocument } from '../publicTypes/group/ContentModelDocument';
import { createModelToDomContext } from '../modelToDom/context/createModelToDomContext';
import { createRange, Position, toArray } from 'roosterjs-editor-dom';
import { EditorContext } from '../publicTypes/context/EditorContext';
import { isNodeOfType } from '../domUtils/isNodeOfType';
import { ModelToDomBlockAndSegmentNode } from '../publicTypes/context/ModelToDomSelectionContext';
import { ModelToDomContext } from '../publicTypes/context/ModelToDomContext';
import { ModelToDomOption } from '../publicTypes/IExperimentalContentModelEditor';
import { optimize } from '../modelToDom/optimizers/optimize';
import {
    NodePosition,
    NodeType,
    SelectionRangeEx,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

/**
 * Create DOM tree fragment from Content Model document
 * @param doc Document object of the target DOM tree
 * @param model The content model document to generate DOM tree from
 * @param editorContext Content for Content Model editor
 * @param option Additional options to customize the behavior of Content Model to DOM conversion
 * @returns A tuple of the following 3 objects:
 * 1. Document Fragment that contains the DOM tree generated from the given model
 * 2. A SelectionRangeEx object that contains selection info from the model if any, or null
 * 3. An array entity DOM wrapper and its placeholder node pair for reusable root level entities.
 */
export default function contentModelToDom(
    doc: Document,
    model: ContentModelDocument,
    editorContext: EditorContext,
    option?: ModelToDomOption
): [DocumentFragment, SelectionRangeEx | null, Record<string, HTMLElement>] {
    const fragment = doc.createDocumentFragment();
    const modelToDomContext = createModelToDomContext(editorContext, option);

    modelToDomContext.modelHandlers.blockGroup(doc, fragment, model, modelToDomContext);
    optimize(fragment, 2 /*optimizeLevel*/);

    const range = extractSelectionRange(modelToDomContext);

    fragment.normalize();

    return [fragment, range, modelToDomContext.entities];
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
