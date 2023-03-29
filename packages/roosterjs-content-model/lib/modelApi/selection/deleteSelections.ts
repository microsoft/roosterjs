import { BlockAndPath, getLeafSiblingBlock } from '../block/getLeafSiblingBlock';
import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelEntity } from '../../publicTypes/entity/ContentModelEntity';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelSelectionMarker } from '../../publicTypes/segment/ContentModelSelectionMarker';
import { createBr } from '../creators/createBr';
import { createParagraph } from '../creators/createParagraph';
import { createSelectionMarker } from '../creators/createSelectionMarker';
import { EntityOperation } from 'roosterjs-editor-types';
import { setParagraphNotImplicit } from '../block/setParagraphNotImplicit';
import {
    iterateSelections,
    IterateSelectionsOption,
    TableSelectionContext,
} from './iterateSelections';
import type { CompatibleEntityOperation } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * @internal
 */
export interface InsertPoint {
    marker: ContentModelSelectionMarker;
    paragraph: ContentModelParagraph;
    path: ContentModelBlockGroup[];
    tableContext?: TableSelectionContext;
}

/**
 * @internal
 */
export type OnDeleteEntity = (
    entity: ContentModelEntity,
    operation:
        | EntityOperation.RemoveFromStart
        | EntityOperation.RemoveFromEnd
        | EntityOperation.Overwrite
        | CompatibleEntityOperation.RemoveFromStart
        | CompatibleEntityOperation.RemoveFromEnd
        | CompatibleEntityOperation.Overwrite
) => boolean;

export interface DeleteSelectionOptions {
    direction?: 'forward' | 'backward' | 'selectionOnly';
    onDeleteEntity?: OnDeleteEntity;
}

export interface DeleteSelectionResult {
    insertPoint: InsertPoint | null;
    isChanged: boolean;
}

const DeleteSelectionIteratingOptions: IterateSelectionsOption = {
    contentUnderSelectedTableCell: 'ignoreForTableOrCell', // When a table cell is selected, we replace all content for this cell, so no need to go into its content
    contentUnderSelectedGeneralElement: 'generalElementOnly', // When a general element is selected, we replace the whole element so no need to go into its content
    includeListFormatHolder: 'never',
};

const DefaultDeleteSelectionOptions: Required<DeleteSelectionOptions> = {
    direction: 'selectionOnly',
    onDeleteEntity: () => false,
};

interface DeleteSelectionContext {
    insertPoint?: InsertPoint;
    lastParagraph?: ContentModelParagraph;
    lastTableContext?: TableSelectionContext;
    isChanged: boolean;
}

/**
 * @internal
 */
export function deleteSelection(
    model: ContentModelDocument,
    options?: DeleteSelectionOptions
): DeleteSelectionResult {
    const fullOptions: Required<DeleteSelectionOptions> = {
        ...DefaultDeleteSelectionOptions,
        ...(options || {}),
    };
    const context: DeleteSelectionContext = { isChanged: false };

    DeleteSelectionSteps.forEach(step => step(context, fullOptions, model));

    return { insertPoint: context.insertPoint || null, isChanged: context.isChanged };
}

type DeleteSelectionStep = (
    context: DeleteSelectionContext,
    options: Required<DeleteSelectionOptions>,
    model: ContentModelDocument
) => void;

// Step 1: iterate the model and find all selected content if any, delete them, and keep/create an insert point
// at the first deleted position so that we know where to put cursor to after delete
const deleteSelectionStep1: DeleteSelectionStep = (context, options, model) => {
    const { onDeleteEntity, direction } = options;
    const isForward = direction == 'forward';

    iterateSelections(
        [model],
        (path, tableContext, block, segments) => {
            // Set paragraph, format and index for default position where we will put cursor to.
            // Later we can overwrite these info when process the selections
            let paragraph = createParagraph(true /*implicit*/);
            let markerFormat = model.format;
            let insertMarkerIndex = 0;

            if (segments) {
                // Delete segments inside a paragraph
                if (segments[0] && block?.blockType == 'Paragraph') {
                    // Now that we have found a paragraph with selections, we can overwrite the default paragraph with this one
                    // so we can put cursor here after delete
                    paragraph = block;
                    insertMarkerIndex = paragraph.segments.indexOf(segments[0]);
                    markerFormat = segments[0].format;

                    context.lastParagraph = paragraph;
                    context.lastTableContext = tableContext;

                    segments.forEach((segment, i) => {
                        if (
                            i == 0 &&
                            !context.insertPoint &&
                            segment.segmentType == 'SelectionMarker'
                        ) {
                            // First time we hit a selection and it is a selection marker, just mark it and not need to delete
                            // because this is possible a collapsed selection, then it will be handled later
                            context.insertPoint = createInsertPoint(
                                segment,
                                block,
                                path,
                                tableContext
                            );
                        } else {
                            context.isChanged =
                                deleteSegment(block.segments, segment, isForward, onDeleteEntity) ||
                                context.isChanged;
                        }
                    });
                }
            } else if (block) {
                // Delete a whole block (divider, table, ...)
                const blocks = path[0].blocks;
                context.isChanged =
                    deleteBlock(blocks, block, isForward, onDeleteEntity, paragraph) ||
                    context.isChanged;
            } else if (tableContext) {
                // Delete a whole table cell
                const { table, colIndex, rowIndex } = tableContext;
                const cell = table.cells[rowIndex][colIndex];

                path = [cell, ...path];
                paragraph.segments.push(createBr(model.format));
                cell.blocks = [paragraph];

                delete cell.cachedElement;
                context.isChanged = true;
            }

            if (!context.insertPoint) {
                // If we have not got a insert point after delete and we have a paragraph to put an insert point in, create insert point now
                const marker = createSelectionMarker(markerFormat);

                setParagraphNotImplicit(paragraph);
                paragraph.segments.splice(insertMarkerIndex, 0, marker);
                context.insertPoint = createInsertPoint(marker, paragraph, path, tableContext);
            }
        },
        DeleteSelectionIteratingOptions
    );
};

// Step 2: if we didn't delete anything, and we want to delete forward/backward, now perform it
const deleteSelectionStep2: DeleteSelectionStep = (context, options) => {
    if (context.insertPoint && !context.isChanged && options.direction != 'selectionOnly') {
        const { onDeleteEntity, direction } = options;
        const isForward = direction == 'forward';
        const { paragraph, marker, path, tableContext } = context.insertPoint;
        const segments = paragraph.segments;

        fixupBr(segments);

        const index = segments.indexOf(marker) + (isForward ? 1 : -1);
        const segmentToDelete = segments[index];
        let blockToDelete: BlockAndPath | null;

        if (segmentToDelete) {
            context.isChanged = deleteSegment(segments, segmentToDelete, isForward, onDeleteEntity);
        } else if ((blockToDelete = getLeafSiblingBlock(path, paragraph, isForward))) {
            const { block, path, siblingSegment } = blockToDelete;

            if (block.blockType == 'Paragraph') {
                if (siblingSegment) {
                    // When selection is under general segment, need to check if it has a sibling sibling, and delete from it
                    context.isChanged = deleteSegment(
                        block.segments,
                        siblingSegment,
                        isForward,
                        onDeleteEntity
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
                context.isChanged = deleteBlock(path[0].blocks, block, isForward, onDeleteEntity);
            }
        }
    }
};

// Step 3: if we end up with multiple paragraphs impacted, we need to merge them
const deleteSelectionStep3: DeleteSelectionStep = context => {
    const { insertPoint, isChanged, lastParagraph, lastTableContext } = context;

    if (
        insertPoint &&
        isChanged &&
        lastParagraph &&
        lastParagraph != insertPoint.paragraph &&
        lastTableContext == insertPoint.tableContext
    ) {
        insertPoint.paragraph.segments.push(...lastParagraph.segments);
        lastParagraph.segments = [];
    }
};

const DeleteSelectionSteps: DeleteSelectionStep[] = [
    deleteSelectionStep1,
    deleteSelectionStep2,
    deleteSelectionStep3,
];

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

function deleteSegment(
    segments: ContentModelSegment[],
    segmentToDelete: ContentModelSegment,
    isForward: boolean,
    onDeleteEntity: OnDeleteEntity
): boolean {
    const index = segments.indexOf(segmentToDelete);

    switch (segmentToDelete.segmentType) {
        case 'Br':
        case 'Image':
        case 'SelectionMarker':
            segments.splice(index, 1);
            return true;

        case 'Entity':
            if (
                !onDeleteEntity?.(
                    segmentToDelete,
                    segmentToDelete.isSelected
                        ? EntityOperation.Overwrite
                        : isForward
                        ? EntityOperation.RemoveFromStart
                        : EntityOperation.RemoveFromEnd
                )
            ) {
                segments.splice(index, 1);
            }

            return true;

        case 'Text':
            let text = segmentToDelete.text;

            if (text.length == 0 || segmentToDelete.isSelected) {
                segments.splice(index, 1);
            } else {
                segmentToDelete.text = isForward
                    ? text.substring(1)
                    : text.substring(0, text.length - 1);
            }

            return true;

        case 'General':
            if (segmentToDelete.isSelected) {
                segments.splice(index, 1);
                return true;
            } else {
                // No op if a general segment is not selected, let browser handle general segment
                // TODO: Need to revisit this
                return false;
            }
    }
}

function deleteBlock(
    blocks: ContentModelBlock[],
    blockToDelete: ContentModelBlock,
    isForward: boolean,
    onDeleteEntity: OnDeleteEntity,
    replacement?: ContentModelBlock
): boolean {
    const index = blocks.indexOf(blockToDelete);

    switch (blockToDelete.blockType) {
        case 'Table':
        case 'Divider':
            replacement ? blocks.splice(index, 1, replacement) : blocks.splice(index, 1);
            return true;

        case 'Entity':
            if (
                !onDeleteEntity(
                    blockToDelete,
                    blockToDelete.isSelected
                        ? EntityOperation.Overwrite
                        : isForward
                        ? EntityOperation.RemoveFromStart
                        : EntityOperation.RemoveFromEnd
                )
            ) {
                replacement ? blocks.splice(index, 1, replacement) : blocks.splice(index, 1);
            }

            return true;

        case 'BlockGroup':
            switch (blockToDelete.blockGroupType) {
                case 'General':
                    if (replacement) {
                        blocks.splice(index, 1, replacement);
                        return true;
                    } else {
                        // no op, let browser handle it
                        return false;
                    }

                case 'ListItem':
                case 'Quote':
                    blocks.splice(index, 1);
                    return true;
            }
    }

    return false;
}

function createInsertPoint(
    marker: ContentModelSelectionMarker,
    paragraph: ContentModelParagraph,
    path: ContentModelBlockGroup[],
    tableContext: TableSelectionContext | undefined
): InsertPoint {
    return {
        marker,
        paragraph,
        path,
        tableContext,
    };
}
