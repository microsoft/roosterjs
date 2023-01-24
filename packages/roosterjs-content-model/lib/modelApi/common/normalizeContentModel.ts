import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { createBr } from '../creators/createBr';
import { isBlockEmpty, isSegmentEmpty } from './isEmpty';

/**
 * @internal
 */
export function normalizeContentModel(group: ContentModelBlockGroup) {
    for (let i = group.blocks.length - 1; i >= 0; i--) {
        const block = group.blocks[i];

        switch (block.blockType) {
            case 'BlockGroup':
                normalizeContentModel(block);
                break;
            case 'Paragraph':
                removeEmptySegments(block);

                normalizeParagraph(block);
                break;
            case 'Table':
                for (let r = 0; r < block.cells.length; r++) {
                    for (let c = 0; c < block.cells[r].length; c++) {
                        normalizeContentModel(block.cells[r][c]);
                    }
                }
                break;
        }

        if (isBlockEmpty(block)) {
            group.blocks.splice(i, 1);
        }
    }
}

function removeEmptySegments(block: ContentModelParagraph) {
    for (let j = block.segments.length - 1; j >= 0; j--) {
        if (isSegmentEmpty(block.segments[j])) {
            block.segments.splice(j, 1);
        }
    }
}

function normalizeParagraph(block: ContentModelParagraph) {
    if (!block.isImplicit) {
        const segments = block.segments;

        if (segments.length == 1 && segments[0].segmentType == 'SelectionMarker') {
            segments.push(createBr(segments[0].format));
        } else if (
            segments.length > 1 &&
            segments[segments.length - 1].segmentType == 'Br' &&
            segments.some(
                segment => segment.segmentType != 'SelectionMarker' && segment.segmentType != 'Br'
            )
        ) {
            segments.pop();
        }
    }
}
