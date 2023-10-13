import { areSameFormats } from '../../domToModel/utils/areSameFormats';
import { createBr } from '../creators/createBr';
import { isSegmentEmpty } from './isEmpty';
import { isWhiteSpacePreserved } from './isWhiteSpacePreserved';
import { normalizeAllSegments } from './normalizeSegment';
import type { ContentModelParagraph } from 'roosterjs-content-model-types';
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
        normalizeAllSegments(paragraph);
    }

    removeEmptyLinks(paragraph);

    removeEmptySegments(paragraph);
}

function removeEmptySegments(block: ContentModelParagraph) {
    for (let j = block.segments.length - 1; j >= 0; j--) {
        if (isSegmentEmpty(block.segments[j])) {
            block.segments.splice(j, 1);
        }
    }
}

function removeEmptyLinks(paragraph: ContentModelParagraph) {
    const marker = paragraph.segments.find(x => x.segmentType == 'SelectionMarker');
    if (marker) {
        const markerIndex = paragraph.segments.indexOf(marker);
        const prev = paragraph.segments[markerIndex - 1];
        const next = paragraph.segments[markerIndex + 1];
        if (
            (prev &&
                !prev.link &&
                areSameFormats(prev.format, marker.format) &&
                (!next || (!next.link && areSameFormats(next.format, marker.format))) &&
                marker.link) ||
            (!prev &&
                marker.link &&
                next &&
                !next.link &&
                areSameFormats(next.format, marker.format))
        ) {
            delete marker.link;
        }
    }
}
