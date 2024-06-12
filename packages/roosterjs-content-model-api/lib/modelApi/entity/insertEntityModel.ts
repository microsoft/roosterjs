import {
    createBr,
    createParagraph,
    createSelectionMarker,
    normalizeContentModel,
    deleteSelection,
    getClosestAncestorBlockGroupIndex,
    setSelection,
    mutateBlock,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelEntity,
    FormatContentModelContext,
    InsertEntityPosition,
    InsertPoint,
    ReadonlyContentModelBlock,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelDocument,
    ShallowMutableContentModelBlock,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function insertEntityModel(
    model: ReadonlyContentModelDocument,
    entityModel: ContentModelEntity,
    position: InsertEntityPosition,
    isBlock: boolean,
    focusAfterEntity?: boolean,
    context?: FormatContentModelContext,
    insertPointOverride?: InsertPoint
) {
    let blockParent: ReadonlyContentModelBlockGroup | undefined;
    let blockIndex = -1;
    let insertPoint: InsertPoint | null;

    if (position == 'begin' || position == 'end') {
        blockParent = model;
        blockIndex = position == 'begin' ? 0 : model.blocks.length;

        if (!isBlock) {
            Object.assign(entityModel.format, model.format);
        }
    } else if ((insertPoint = getInsertPoint(model, insertPointOverride, context))) {
        const { marker, paragraph, path } = insertPoint;

        if (!isBlock) {
            const index = paragraph.segments.indexOf(marker);

            Object.assign(entityModel.format, marker.format);

            if (index >= 0) {
                paragraph.segments.splice(focusAfterEntity ? index : index + 1, 0, entityModel);
            }
        } else {
            const pathIndex =
                position == 'root'
                    ? getClosestAncestorBlockGroupIndex(path, ['TableCell', 'Document'])
                    : 0;
            blockParent = mutateBlock(path[pathIndex]);

            const child = path[pathIndex - 1];
            const directChild: ReadonlyContentModelBlock =
                child?.blockGroupType == 'FormatContainer' ||
                child?.blockGroupType == 'General' ||
                child?.blockGroupType == 'ListItem'
                    ? child
                    : paragraph;
            const childIndex = blockParent.blocks.indexOf(directChild);
            blockIndex = childIndex >= 0 ? childIndex + 1 : -1;
        }
    }

    if (blockIndex >= 0 && blockParent) {
        const blocksToInsert: ShallowMutableContentModelBlock[] = [];
        let nextParagraph: ShallowMutableContentModelParagraph | undefined;

        if (isBlock) {
            const nextBlock = blockParent.blocks[blockIndex];

            blocksToInsert.push(entityModel);

            if (nextBlock?.blockType == 'Paragraph') {
                nextParagraph = mutateBlock(nextBlock);
            } else if (!nextBlock || nextBlock.blockType == 'Entity' || focusAfterEntity) {
                nextParagraph = createParagraph(false /*isImplicit*/, {}, model.format);
                nextParagraph.segments.push(createBr(model.format));
                blocksToInsert.push(nextParagraph);
            }
        } else {
            nextParagraph = createParagraph(
                false /*isImplicit*/,
                undefined /*format*/,
                model.format
            );

            nextParagraph.segments.push(entityModel);
            blocksToInsert.push(nextParagraph);
        }

        mutateBlock(blockParent).blocks.splice(blockIndex, 0, ...blocksToInsert);

        if (focusAfterEntity && nextParagraph) {
            const marker = createSelectionMarker(nextParagraph.segments[0]?.format || model.format);
            const segments = nextParagraph.segments;

            isBlock ? segments.unshift(marker) : segments.push(marker);
            setSelection(model, marker, marker);
        }
    }
}

function getInsertPoint(
    model: ReadonlyContentModelDocument,
    insertPointOverride?: InsertPoint,
    context?: FormatContentModelContext
): InsertPoint | null {
    if (insertPointOverride) {
        const { paragraph, marker, tableContext, path } = insertPointOverride;
        const index = paragraph.segments.indexOf(marker);
        const previousSegment = index > 0 ? paragraph.segments[index - 1] : null;

        // It is possible that the real selection is right before the override selection marker.
        // This happens when:
        // [Override marker][Entity node to wrap][Real marker]
        // Then we will move the entity node into entity wrapper, causes the override marker and real marker are at the same place
        // And recreating content model causes real marker to appear before override marker.
        // Once that happens, we need to use the real marker instead so that after insert entity, real marker can be placed
        // after new entity (if insertPointOverride==true)
        return previousSegment?.segmentType == 'SelectionMarker' && previousSegment.isSelected
            ? {
                  marker: previousSegment,
                  paragraph,
                  tableContext,
                  path,
              }
            : insertPointOverride;
    } else {
        const deleteResult = deleteSelection(model, [], context);
        const insertPoint = deleteResult.insertPoint;

        if (deleteResult.deleteResult == 'range') {
            normalizeContentModel(model);
        }

        return insertPoint;
    }
}
