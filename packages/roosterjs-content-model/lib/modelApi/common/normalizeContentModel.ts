import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { createBr } from '../creators/createBr';
import { isBlockEmpty, isSegmentEmpty } from './isEmpty';
import { unwrapBlock } from './unwrapBlock';

/**
 * @internal
 */
export function normalizeContentModel(group: ContentModelBlockGroup) {
    for (let i = group.blocks.length - 1; i >= 0; i--) {
        const block = group.blocks[i];

        switch (block.blockType) {
            case 'BlockGroup':
                if (block.blockGroupType == 'ListItem' && block.levels.length == 0) {
                    i += block.blocks.length;
                    unwrapBlock(group, block);
                } else {
                    normalizeContentModel(block);
                }
                break;
            case 'Paragraph':
                removeEmptySegments(block);

                normalizeParagraph(block);
                break;
            case 'Table':
                for (let r = 0; r < block.cells.length; r++) {
                    for (let c = 0; c < block.cells[r].length; c++) {
                        if (block.cells[r][c]) {
                            normalizeContentModel(block.cells[r][c]);
                        }
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
    const segments = block.segments;

    if (!block.isImplicit) {
        if (segments.length == 1 && segments[0].segmentType == 'SelectionMarker') {
            segments.push(createBr(segments[0].format));
        } else if (segments.length > 1 && segments[segments.length - 1].segmentType == 'Br') {
            const noMarkerSegments = segments.filter(x => x.segmentType != 'SelectionMarker');

            // When there is content with a <BR> tag at the end, we can remove the BR.
            // But if there are more than one <BR> at the end, do not remove them.
            if (
                noMarkerSegments.length > 1 &&
                noMarkerSegments[noMarkerSegments.length - 2].segmentType != 'Br'
            ) {
                segments.pop();
            }
        }
    }

    for (let i = 0; i < segments.length - 1; i++) {
        const segment = segments[i];

        if (segment.segmentType == 'Text') {
            // If the text is ended with &nbsp; and is not following another space,
            // replace it to regular space (\u0020) to allow next segment to be able to wrap
            segment.text = segment.text.replace(/([^\u0020])\u00A0$/, '$1\u0020');
        }
    }
}
