import { getLeafSiblingBlock } from '../utils/getLeafSiblingBlock';
import { setModelIndentation } from 'roosterjs-content-model-api';
import {
    deleteBlock,
    deleteSegment,
    getClosestAncestorBlockGroupIndex,
    mutateBlock,
    setParagraphNotImplicit,
} from 'roosterjs-content-model-dom';
import type { ReadonlyBlockAndPath } from '../utils/getLeafSiblingBlock';
import type {
    ContentModelParagraph,
    ContentModelSegment,
    DeleteSelectionStep,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelDocument,
    ReadonlyContentModelParagraph,
} from 'roosterjs-content-model-types';

function getDeleteCollapsedSelection(direction: 'forward' | 'backward'): DeleteSelectionStep {
    return context => {
        if (context.deleteResult != 'notDeleted') {
            return;
        }

        const isForward = direction == 'forward';
        const { paragraph, marker, path, tableContext } = context.insertPoint;
        const segments = paragraph.segments;

        fixupBr(paragraph);

        const index = segments.indexOf(marker) + (isForward ? 1 : -1);
        const segmentToDelete = segments[index];
        let blockToDelete: ReadonlyBlockAndPath | null;
        let root: ReadonlyContentModelDocument | null;

        if (segmentToDelete) {
            if (deleteSegment(paragraph, segmentToDelete, context.formatContext, direction)) {
                context.deleteResult = 'singleChar';

                // It is possible that we have deleted everything from this paragraph, so we need to mark it as not implicit
                // to avoid losing its format. See https://github.com/microsoft/roosterjs/issues/1953
                setParagraphNotImplicit(paragraph);
            }
        } else if (
            shouldOutdentParagraph(isForward, segments, paragraph, path) &&
            (root = getRoot(path))
        ) {
            setModelIndentation(root, 'outdent');
            context.deleteResult = 'range';
        } else if ((blockToDelete = getLeafSiblingBlock(path, paragraph, isForward))) {
            const { block: readonlyBlock, path, siblingSegment } = blockToDelete;

            if (readonlyBlock.blockType == 'Paragraph') {
                const block = mutateBlock(readonlyBlock);

                if (siblingSegment) {
                    // When selection is under general segment, need to check if it has a sibling sibling, and delete from it
                    if (deleteSegment(block, siblingSegment, context.formatContext, direction)) {
                        context.deleteResult = 'range';
                    }
                } else {
                    if (isForward) {
                        context.lastParagraph = block;
                    } else {
                        if (block.segments[block.segments.length - 1]?.segmentType == 'Br') {
                            mutateBlock(block).segments.pop();
                        }

                        context.insertPoint = {
                            marker,
                            paragraph: block,
                            path,
                            tableContext,
                        };
                        context.lastParagraph = paragraph;
                    }

                    context.deleteResult = 'range';
                }

                // When go across table, getLeafSiblingBlock will return null, when we are here, we must be in the same table context
                context.lastTableContext = tableContext;
            } else {
                if (
                    deleteBlock(
                        mutateBlock(path[0]).blocks,
                        readonlyBlock,
                        undefined /*replacement*/,
                        context.formatContext,
                        direction
                    )
                ) {
                    context.deleteResult = 'range';
                }
            }
        } else {
            // We have nothing to delete, in this case we don't want browser handle it as well.
            // Because when Backspace on an empty document, it will also delete the only DIV and SPAN element, causes
            // editor is really empty. We don't want that happen. So the handling should stop here.
            context.deleteResult = 'nothingToDelete';
        }
    };
}

function getRoot(path: ReadonlyContentModelBlockGroup[]): ReadonlyContentModelDocument | null {
    const lastInPath = path[path.length - 1];
    return lastInPath.blockGroupType == 'Document' ? lastInPath : null;
}

function shouldOutdentParagraph(
    isForward: boolean,
    segments: ContentModelSegment[],
    paragraph: ContentModelParagraph,
    path: ReadonlyContentModelBlockGroup[]
) {
    return (
        !isForward &&
        segments.length == 1 &&
        segments[0].segmentType == 'SelectionMarker' &&
        paragraph.format.marginLeft &&
        parseInt(paragraph.format.marginLeft) &&
        getClosestAncestorBlockGroupIndex(path, ['Document', 'TableCell'], ['ListItem']) > -1
    );
}

/**
 * If the last segment is BR, remove it for now. We may add it back later when normalize model.
 * So that if this is an empty paragraph, it will start to delete next block
 */
function fixupBr(paragraph: ReadonlyContentModelParagraph) {
    const { segments } = paragraph;

    if (segments[segments.length - 1]?.segmentType == 'Br') {
        const segmentsWithoutBr = segments.filter(x => x.segmentType != 'SelectionMarker');

        if (segmentsWithoutBr[segmentsWithoutBr.length - 2]?.segmentType != 'Br') {
            mutateBlock(paragraph).segments.pop();
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
