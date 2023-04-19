import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelText } from '../../publicTypes/segment/ContentModelText';
import { createBr } from '../creators/createBr';
import { isWhiteSpacePreserved } from './isWhiteSpacePreserved';

const SPACE = '\u0020';
const NONE_BREAK_SPACE = '\u00A0';
const LEADING_SPACE_REGEX = /^\u0020+/;
const TRAILING_SPACE_REGEX = /\u0020+$/;

/**
 * @internal
 */
export function normalizeParagraph(paragraph: ContentModelParagraph) {
    const segments = paragraph.segments;

    if (!paragraph.isImplicit) {
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

    let ignoreLeadingSpaces = true;

    if (!isWhiteSpacePreserved(paragraph)) {
        let lastTextSegment: ContentModelText | undefined;

        segments.forEach(segment => {
            if (segment.segmentType == 'Text') {
                lastTextSegment = segment;

                const first = segment.text.substring(0, 1);
                const last = segment.text.substr(-1);

                if (first == SPACE) {
                    // 1. Multiple leading space => single &nbsp; or empty (depends on if previous segment ends with space)
                    segment.text = segment.text.replace(
                        LEADING_SPACE_REGEX,
                        ignoreLeadingSpaces ? '' : NONE_BREAK_SPACE
                    );
                }

                if (last == SPACE) {
                    // 2. Multiple trailing space => single space
                    segment.text = segment.text.replace(TRAILING_SPACE_REGEX, SPACE);
                }

                ignoreLeadingSpaces = last == SPACE;
            } else if (segment.segmentType != 'SelectionMarker') {
                ignoreLeadingSpaces = true;
            }
        });

        segments.forEach(segment => {
            // 3. Segment ends with &nbsp; replace it with space if the previous char is not space so that next segment can wrap
            // Only do this for segments that is not the last one since the last space will be removed in step 4
            if (segment.segmentType == 'Text' && segment != lastTextSegment) {
                const text = segment.text;

                if (text.substr(-1) == NONE_BREAK_SPACE && text.substr(-2, 1) != SPACE) {
                    segment.text = text.substring(0, text.length - 1) + SPACE;
                }
            }
        });

        if (lastTextSegment?.text.substr(-1) == SPACE) {
            // 4. last text segment of the paragraph, remove trailing space
            lastTextSegment.text = lastTextSegment.text.replace(TRAILING_SPACE_REGEX, '');
        }
    }
}
