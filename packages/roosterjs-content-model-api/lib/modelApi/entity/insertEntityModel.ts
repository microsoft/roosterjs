import { setSelection } from 'roosterjs-content-model-core';
import {
    createBr,
    createParagraph,
    createSelectionMarker,
    deleteSelection,
    getClosestAncestorBlockGroupIndex,
    normalizeContentModel,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelBlock,
    ContentModelBlockGroup,
    ContentModelDocument,
    ContentModelEntity,
    ContentModelParagraph,
    DeleteSelectionResult,
    FormatContentModelContext,
    InsertEntityPosition,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function insertEntityModel(
    model: ContentModelDocument,
    entityModel: ContentModelEntity,
    position: InsertEntityPosition,
    isBlock: boolean,
    focusAfterEntity?: boolean,
    context?: FormatContentModelContext
) {
    let blockParent: ContentModelBlockGroup | undefined;
    let blockIndex = -1;
    let deleteResult: DeleteSelectionResult;

    if (position == 'begin' || position == 'end') {
        blockParent = model;
        blockIndex = position == 'begin' ? 0 : model.blocks.length;

        if (!isBlock) {
            Object.assign(entityModel.format, model.format);
        }
    } else if ((deleteResult = deleteSelection(model, [], context)).insertPoint) {
        const { marker, paragraph, path } = deleteResult.insertPoint;

        if (deleteResult.deleteResult == 'range') {
            normalizeContentModel(model);
        }

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
            blockParent = path[pathIndex];
            const child = path[pathIndex - 1];
            const directChild: ContentModelBlock =
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
        const blocksToInsert: ContentModelBlock[] = [];
        let nextParagraph: ContentModelParagraph | undefined;

        if (isBlock) {
            const nextBlock = blockParent.blocks[blockIndex];

            blocksToInsert.push(entityModel);

            if (nextBlock?.blockType == 'Paragraph') {
                nextParagraph = nextBlock;
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

        blockParent.blocks.splice(blockIndex, 0, ...blocksToInsert);

        if (focusAfterEntity && nextParagraph) {
            const marker = createSelectionMarker(nextParagraph.segments[0]?.format || model.format);
            const segments = nextParagraph.segments;

            isBlock ? segments.unshift(marker) : segments.push(marker);
            setSelection(model, marker, marker);
        }
    }
}
