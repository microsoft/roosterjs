import { areSameFormats } from '../../domToModel/utils/areSameFormats';
import { createBr } from '../creators/createBr';
import { isSegmentEmpty } from './isEmpty';
import { isWhiteSpacePreserved } from '../../domUtils/isWhiteSpacePreserved';
import { mutateBlock, mutateSegment } from './mutate';
import { normalizeAllSegments } from './normalizeSegment';
import type {
    ContentModelSegmentFormat,
    ReadonlyContentModelParagraph,
    ReadonlyContentModelSegment,
} from 'roosterjs-content-model-types';

/**
 * @param paragraph The paragraph to normalize
 * Normalize a paragraph. If it is empty, add a BR segment to make sure it can insert content
 */
export function normalizeParagraph(paragraph: ReadonlyContentModelParagraph) {
    const segments = paragraph.segments;

    if (!paragraph.isImplicit && segments.length > 0) {
        const last = segments[segments.length - 1];
        const secondLast = segments[segments.length - 2];

        if (
            last.segmentType == 'SelectionMarker' &&
            (!secondLast || secondLast.segmentType == 'Br')
        ) {
            mutateBlock(paragraph).segments.push(createBr(last.format));
        } else if (segments.length > 1 && segments[segments.length - 1].segmentType == 'Br') {
            const noMarkerSegments = segments.filter(x => x.segmentType != 'SelectionMarker');

            // When there is content with a <BR> tag at the end, we can remove the BR.
            // But if there are more than one <BR> at the end, do not remove them.
            if (
                noMarkerSegments.length > 1 &&
                noMarkerSegments[noMarkerSegments.length - 2].segmentType != 'Br'
            ) {
                mutateBlock(paragraph).segments.pop();
            }
        }

        normalizeParagraphStyle(paragraph);
    }

    if (!isWhiteSpacePreserved(paragraph.format.whiteSpace)) {
        normalizeAllSegments(paragraph);
    }

    removeEmptyLinks(paragraph);
    removeEmptySegments(paragraph);
    moveUpSegmentFormat(paragraph);
}

function normalizeParagraphStyle(paragraph: ReadonlyContentModelParagraph) {
    // New paragraph should not have white-space style
    if (
        paragraph.format.whiteSpace &&
        paragraph.segments.every(
            seg => seg.segmentType == 'Br' || seg.segmentType == 'SelectionMarker'
        )
    ) {
        delete mutateBlock(paragraph).format.whiteSpace;
    }
}

function removeEmptySegments(block: ReadonlyContentModelParagraph) {
    for (let j = block.segments.length - 1; j >= 0; j--) {
        if (isSegmentEmpty(block.segments[j])) {
            mutateBlock(block).segments.splice(j, 1);
        }
    }
}

function removeEmptyLinks(paragraph: ReadonlyContentModelParagraph) {
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
            mutateSegment(paragraph, marker, mutableMarker => {
                delete mutableMarker.link;
            });
        }
    }
}

type FormatsToMoveUp = 'fontFamily' | 'fontSize' | 'textColor';
const formatsToMoveUp: FormatsToMoveUp[] = ['fontFamily', 'fontSize', 'textColor'];

// When all segments are sharing the same segment format (font name, size and color), we can move its format to paragraph
function moveUpSegmentFormat(paragraph: ReadonlyContentModelParagraph) {
    if (!paragraph.decorator) {
        const segments = paragraph.segments.filter(x => x.segmentType != 'SelectionMarker');
        const target = paragraph.segmentFormat || {};
        let changed = false;

        formatsToMoveUp.forEach(key => {
            changed = internalMoveUpSegmentFormat(segments, target, key) || changed;
        });

        if (changed) {
            mutateBlock(paragraph).segmentFormat = target;
        }
    }
}

function internalMoveUpSegmentFormat(
    segments: ReadonlyContentModelSegment[],
    target: ContentModelSegmentFormat,
    formatKey: FormatsToMoveUp
): boolean {
    const firstFormat = segments[0]?.format;

    if (
        firstFormat?.[formatKey] &&
        segments.every(segment => segment.format[formatKey] == firstFormat[formatKey]) &&
        target[formatKey] != firstFormat[formatKey]
    ) {
        target[formatKey] = firstFormat[formatKey];
        return true;
    } else {
        return false;
    }
}
