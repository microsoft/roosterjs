import { createBr, createParagraph, createSelectionMarker } from 'roosterjs-content-model-dom';
import { deleteSelection } from '../edit/deleteSelection';
import { FormatWithContentModelContext } from '../../publicTypes/parameter/FormatWithContentModelContext';
import { getClosestAncestorBlockGroupIndex } from '../common/getClosestAncestorBlockGroupIndex';
import { InsertPoint } from '../../publicTypes/selection/InsertPoint';
import { setSelection } from '../selection/setSelection';
import {
    ContentModelBlock,
    ContentModelBlockGroup,
    ContentModelDocument,
    ContentModelEntity,
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function insertEntityModel(
    model: ContentModelDocument,
    context: FormatWithContentModelContext,
    entityModel: ContentModelEntity,
    position: 'focus' | 'begin' | 'end' | 'root',
    isBlock: boolean,
    focusAfterEntity: boolean | undefined
) {
    let blockParent: ContentModelBlockGroup | undefined;
    let blockIndex = -1;
    let insertPoint: InsertPoint | null;

    if (position == 'begin' || position == 'end') {
        blockParent = model;
        blockIndex = position == 'begin' ? 0 : model.blocks.length;
    } else if ((insertPoint = deleteSelection(model, [], context).insertPoint)) {
        const { marker, paragraph, path } = insertPoint;

        if (!isBlock) {
            const index = paragraph.segments.indexOf(marker);

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
        const nextBlock = blockParent.blocks[blockIndex];
        const blocksToInsert = [
            isBlock ? entityModel : wrapWithParagraph(entityModel, model.format),
        ];
        let nextParagraph: ContentModelParagraph | undefined;

        if (nextBlock?.blockType == 'Paragraph') {
            nextParagraph = nextBlock;
        } else if (!nextBlock || nextBlock.blockType == 'Entity' || focusAfterEntity) {
            nextParagraph = createParagraph(false /*isImplicit*/, {}, model.format);
            nextParagraph.segments.push(createBr(model.format));
            blocksToInsert.push(nextParagraph);
        }

        blockParent.blocks.splice(blockIndex, 0, ...blocksToInsert);

        if (focusAfterEntity && nextParagraph) {
            const marker = createSelectionMarker(nextParagraph.segments[0]?.format || model.format);

            nextParagraph.segments.unshift(marker);
            setSelection(model, marker, marker);
        }
    }
}

function wrapWithParagraph(
    segment: ContentModelSegment,
    defaultFormat?: ContentModelSegmentFormat
): ContentModelParagraph {
    const para = createParagraph(false /*isImplicit*/, undefined /*format*/, defaultFormat);

    para.segments.push(segment);

    return para;
}
