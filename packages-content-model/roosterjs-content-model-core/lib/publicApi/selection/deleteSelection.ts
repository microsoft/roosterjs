import hasSelectionInBlock from './hasSelectionInBlock';
import hasSelectionInBlockGroup from './hasSelectionInBlockGroup';
import { deleteExpandedSelection } from '../../modelApi/edit/deleteExpandedSelection';
import { getClosestAncestorBlockGroupIndex } from '../model/getClosestAncestorBlockGroupIndex';
import type {
    ContentModelBlock,
    ContentModelDocument,
    DeleteSelectionContext,
    DeleteSelectionResult,
    DeleteSelectionStep,
    FormatWithContentModelContext,
    ValidDeleteSelectionContext,
} from 'roosterjs-content-model-types';

/**
 * Delete selected content from Content Model
 * @param model The model to delete selected content from
 * @param additionalSteps @optional Addition delete steps
 * @param formatContext @optional A context object provided by formatContentModel API
 * @param isCut @optional True if this is a cut operation, false if this is a delete operation
 * @returns A DeleteSelectionResult object to specify the deletion result
 */
export function deleteSelection(
    model: ContentModelDocument,
    additionalSteps: (DeleteSelectionStep | null)[] = [],
    formatContext?: FormatWithContentModelContext,
    isCut?: boolean
): DeleteSelectionResult {
    const context = deleteExpandedSelection(model, formatContext);

    additionalSteps.forEach(step => {
        if (
            step &&
            isValidDeleteSelectionContext(context) &&
            context.deleteResult == 'notDeleted'
        ) {
            step(context);
        }
    });

    mergeParagraphAfterDelete(context);
    deleteEmptyList(context, isCut);

    return context;
}

function isValidDeleteSelectionContext(
    context: DeleteSelectionContext
): context is ValidDeleteSelectionContext {
    return !!context.insertPoint;
}

// If we end up with multiple paragraphs impacted, we need to merge them
function mergeParagraphAfterDelete(context: DeleteSelectionContext) {
    const { insertPoint, deleteResult, lastParagraph, lastTableContext } = context;

    if (
        insertPoint &&
        deleteResult != 'notDeleted' &&
        deleteResult != 'nothingToDelete' &&
        lastParagraph &&
        lastParagraph != insertPoint.paragraph &&
        lastTableContext == insertPoint.tableContext
    ) {
        insertPoint.paragraph.segments.push(...lastParagraph.segments);
        lastParagraph.segments = [];
    }
}

function isEmptyBlock(block: ContentModelBlock | undefined): boolean {
    if (block && block.blockType == 'Paragraph') {
        return block.segments.every(
            segment => segment.segmentType !== 'SelectionMarker' && segment.segmentType == 'Br'
        );
    }

    if (block && block.blockType == 'BlockGroup') {
        return block.blocks.every(isEmptyBlock);
    }

    return !!block;
}

//Verify if we need to remove the list item levels
//If the first item o the list is selected in a expanded selection, we need to remove the list item levels
function deleteEmptyList(context: DeleteSelectionContext, isCut?: boolean) {
    const { insertPoint, deleteResult } = context;
    if (deleteResult == 'range' && insertPoint?.path && isCut) {
        const index = getClosestAncestorBlockGroupIndex(insertPoint.path, ['ListItem']);
        const item = insertPoint.path[index];
        if (index >= 0 && item && item.blockGroupType == 'ListItem') {
            const listItemIndex = insertPoint.path[index + 1].blocks.indexOf(item);
            const previousBlock =
                listItemIndex > -1
                    ? insertPoint.path[index + 1].blocks[listItemIndex - 1]
                    : undefined;
            const nextBlock =
                listItemIndex > -1
                    ? insertPoint.path[index + 1].blocks[listItemIndex + 1]
                    : undefined;
            if (
                hasSelectionInBlockGroup(item) &&
                (!previousBlock || hasSelectionInBlock(previousBlock)) &&
                nextBlock &&
                isEmptyBlock(nextBlock)
            ) {
                item.levels = [];
            }
        }
    }
}
