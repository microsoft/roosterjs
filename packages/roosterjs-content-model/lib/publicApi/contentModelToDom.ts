import { ContentModelContext } from '../publicTypes/ContentModelContext';
import { ContentModelDocument } from '../publicTypes/block/group/ContentModelDocument';
import { createModelToDomContext } from '../modelToDom/context/createModelToDomContext';
import { createRange } from 'roosterjs-editor-dom';
import { getSelectionPosition } from '../modelToDom/utils/getSelectionPosition';
import { handleBlock } from '../modelToDom/handlers/handleBlock';
import { isNodeOfType } from '../domUtils/isNodeOfType';
import { ModelToDomContext } from '../modelToDom/context/ModelToDomContext';
import { NodeType, SelectionRangeEx, SelectionRangeTypes } from 'roosterjs-editor-types';
import { optimize } from '../modelToDom/optimizers/optimize';

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
    if (context.tableSelection?.table) {
        return {
            type: SelectionRangeTypes.TableSelection,
            ranges: [],
            areAllCollapsed: false,
            table: context.tableSelection.table,
            coordinates: {
                firstCell: context.tableSelection.firstCell,
                lastCell: context.tableSelection.lastCell,
            },
        };
    }

    if (context.regularSelection?.start) {
        if (isNodeOfType(context.regularSelection.start.node, NodeType.DocumentFragment)) {
            context.regularSelection.start = context.regularSelection.start.normalize();
        }

        context.regularSelection.end =
            context.regularSelection.end || getSelectionPosition(context.regularSelection);

        if (isNodeOfType(context.regularSelection.end!.node, NodeType.DocumentFragment)) {
            context.regularSelection.end = context.regularSelection.end!.normalize();
        }

        const range = createRange(context.regularSelection.start, context.regularSelection.end);

        return {
            type: SelectionRangeTypes.Normal,
            ranges: [range],
            areAllCollapsed: range.collapsed,
        };
    }

    return null;
}
