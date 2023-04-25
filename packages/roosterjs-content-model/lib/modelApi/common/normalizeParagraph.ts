import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { createBr } from '../creators/createBr';
import { isSegmentEmpty } from './isEmpty';
import { isWhiteSpacePreserved } from './isWhiteSpacePreserved';
import {
    createNormalizeSegmentContext,
    normalizeLastTextSegment,
    normalizeSegment,
    normalizeTextSegments,
} from './normalizeSegment';

/**
 * @internal
 */
export function normalizeParagraph(paragraph: ContentModelParagraph) {
    const segments = paragraph.segments;

    if (!paragraph.isImplicit && segments.length > 0) {
        const last = segments[segments.length - 1];
        const secondLast = segments[segments.length - 2];

        if (
            last.segmentType == 'SelectionMarker' &&
            (!secondLast || secondLast.segmentType == 'Br')
        ) {
            segments.push(createBr(last.format));
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

    if (!isWhiteSpacePreserved(paragraph)) {
        const context = createNormalizeSegmentContext();

        segments.forEach(segment => {
            normalizeSegment(segment, context);
        });

        normalizeTextSegments(context.textSegments, context.lastInlineSegment);
        normalizeLastTextSegment(context.lastTextSegment, context.lastInlineSegment);
    }

    removeEmptySegments(paragraph);
}

function removeEmptySegments(block: ContentModelParagraph) {
    for (let j = block.segments.length - 1; j >= 0; j--) {
        if (isSegmentEmpty(block.segments[j])) {
            block.segments.splice(j, 1);
        }
    }
}
