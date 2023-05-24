import { BlockAndPath, getLeafSiblingBlock } from '../../block/getLeafSiblingBlock';
import { ContentModelSegment } from 'roosterjs-content-model';
import { createInsertPoint } from '../utils/createInsertPoint';
import { deleteBlock } from '../utils/deleteBlock';
import { deleteSegment } from '../utils/deleteSegment';
import { EditStep } from '../utils/EditStep';

function getDeleteCollapsedSelection(direction: 'forward' | 'backward'): EditStep {
    return (context, options) => {
        const isForward = direction == 'forward';

        const { onDeleteEntity } = options;
        const { paragraph, marker, path, tableContext } = context.insertPoint;
        const segments = paragraph.segments;

        fixupBr(segments);

        const index = segments.indexOf(marker) + (isForward ? 1 : -1);
        const segmentToDelete = segments[index];
        let blockToDelete: BlockAndPath | null;

        if (segmentToDelete) {
            context.isChanged = deleteSegment(
                paragraph,
                segmentToDelete,
                onDeleteEntity,
                direction
            );
        } else if ((blockToDelete = getLeafSiblingBlock(path, paragraph, isForward))) {
            const { block, path, siblingSegment } = blockToDelete;

            if (block.blockType == 'Paragraph') {
                if (siblingSegment) {
                    // When selection is under general segment, need to check if it has a sibling sibling, and delete from it
                    context.isChanged = deleteSegment(
                        block,
                        siblingSegment,
                        onDeleteEntity,
                        direction
                    );
                } else {
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

                    context.isChanged = true;
                }

                // When go across table, getLeafSiblingBlock will return null, when we are here, we must be in the same table context
                context.lastTableContext = tableContext;
            } else {
                context.isChanged = deleteBlock(
                    path[0].blocks,
                    block,
                    onDeleteEntity,
                    undefined /*replacement*/,
                    direction
                );
            }

            context.addUndoSnapshot = context.isChanged;
        } else {
            // We have nothing to delete, in this case we don't want browser handle it as well.
            // Because when Backspace on an empty document, it will also delete the only DIV and SPAN element, causes
            // editor is really empty. We don't want that happen. So the handling should stop here.
            context.isChanged = true;
        }
    };
}

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

/**
 * @internal if we didn't delete anything, and we want to delete forward, now perform it
 */
export const forwardDeleteCollapsedSelection = getDeleteCollapsedSelection('forward');

/**
 * @internal if we didn't delete anything, and we want to delete backward, now perform it
 */
export const backwardDeleteCollapsedSelection = getDeleteCollapsedSelection('backward');
