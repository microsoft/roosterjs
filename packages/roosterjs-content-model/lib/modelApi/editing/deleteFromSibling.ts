import { BlockAndPath, getLeafSiblingBlock } from '../block/getLeafSiblingBlock';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { createInsertPoint } from './createInsertPoint';
import { deleteBlock, deleteSegment } from './deletingUtils';
import { DeleteSelectionStep } from './DeleteSelectionStep';
import { setParagraphNotImplicit } from '../block/setParagraphNotImplicit';

/**
 * @internal
 * If we didn't delete anything yet, and we want to delete forward/backward, now perform it
 */
export const deleteFromSibling: DeleteSelectionStep = (context, options) => {
    if (context.insertPoint && !context.isChanged && options.direction != 'selectionOnly') {
        const { onDeleteEntity, direction } = options;
        const isForward = direction == 'forward';
        const { paragraph, marker, path, tableContext } = context.insertPoint;
        const segments = paragraph.segments;

        fixupBr(segments);
        setParagraphNotImplicit(paragraph);

        const index = segments.indexOf(marker) + (isForward ? 1 : -1);
        const segmentToDelete = segments[index];
        let blockToDelete: BlockAndPath | null;

        if (segmentToDelete) {
            context.isChanged = deleteSegment(segments, segmentToDelete, isForward, onDeleteEntity);
        } else if ((blockToDelete = getLeafSiblingBlock(path, paragraph, isForward))) {
            const { block, path } = blockToDelete;

            if (block.blockType == 'Paragraph') {
                if (isForward) {
                    context.lastParagraph = block;
                } else {
                    if (block.segments[block.segments.length - 1]?.segmentType == 'Br') {
                        block.segments.pop();
                    }

                    context.insertPoint = createInsertPoint(marker, block, path, tableContext);
                    context.lastParagraph = paragraph;
                    delete block.cachedElement;
                }

                // When go across table, getLeafSiblingBlock will return null, when we are here, we must be in the same table context
                context.lastTableContext = tableContext;
                context.isChanged = true;
            } else {
                context.isChanged = deleteBlock(path[0].blocks, block, isForward, onDeleteEntity);
            }
        }
    }
};

/**
 * If the last segment is BR, remove it for now. We may add it back later when normalize model.
 * So that if this is an empty paragraph, it will start to delete next block
 */
function fixupBr(segments: ContentModelSegment[]) {
    if (segments[segments.length - 1]?.segmentType == 'Br') {
        const segmentsWithoutBr = segments.filter(x => x.segmentType != 'SelectionMarker');

        if (segmentsWithoutBr[segmentsWithoutBr.length - 2]?.segmentType != 'Br') {
            segments.pop();
        }
    }
}
