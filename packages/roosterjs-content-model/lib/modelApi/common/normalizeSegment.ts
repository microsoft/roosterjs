import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelText } from '../../publicTypes/segment/ContentModelText';
import { hasSpacesOnly } from '../../domUtils/stringUtil';

const SPACE = '\u0020';
const NONE_BREAK_SPACE = '\u00A0';
const LEADING_SPACE_REGEX = /^\u0020+/;
const TRAILING_SPACE_REGEX = /\u0020+$/;

/**
 * @internal
 */
export interface NormalizeSegmentContext {
    textSegments: ContentModelText[];
    ignoreLeadingSpaces: boolean;
    ignoreTrailingSpaces: boolean;
    lastTextSegment: ContentModelText | undefined;
    lastInlineSegment: ContentModelSegment | undefined;
}

export function createNormalizeSegmentContext(): NormalizeSegmentContext {
    return resetNormalizeSegmentContext();
}

function resetNormalizeSegmentContext(
    context?: Partial<NormalizeSegmentContext>
): NormalizeSegmentContext {
    return Object.assign(context ?? {}, {
        textSegments: [],
        ignoreLeadingSpaces: true,
        ignoreTrailingSpaces: true,
        lastInlineSegment: undefined,
        lastTextSegment: undefined,
    });
}

/**
 * @internal
 */
export function normalizeSegment(segment: ContentModelSegment, context: NormalizeSegmentContext) {
    switch (segment.segmentType) {
        case 'Br':
            normalizeTextSegments(context.textSegments, context.lastInlineSegment);
            normalizeLastTextSegment(context.lastTextSegment, context.lastInlineSegment);

            // Line ends, reset all states
            resetNormalizeSegmentContext(context);
            break;

        case 'Entity':
        case 'General':
        case 'Image':
            // Here "inline segment" means a segment showing some content inline such as text, image, or other inline HTML elements
            // BR will end current line, so it is not treated as "inline" here.
            // We will do some normalization to the trailing spaces for non-inline-segments
            context.lastInlineSegment = segment;
            context.ignoreLeadingSpaces = false;
            break;

        case 'Text':
            context.textSegments.push(segment);
            context.lastInlineSegment = segment;
            context.lastTextSegment = segment;

            const first = segment.text.substring(0, 1);
            const last = segment.text.substr(-1);

            if (!hasSpacesOnly(segment.text)) {
                if (first == SPACE) {
                    // 1. Multiple leading space => single &nbsp; or empty (depends on if previous segment ends with space)
                    segment.text = segment.text.replace(
                        LEADING_SPACE_REGEX,
                        context.ignoreLeadingSpaces ? '' : NONE_BREAK_SPACE
                    );
                }

                if (last == SPACE) {
                    // 2. Multiple trailing space => single space
                    segment.text = segment.text.replace(
                        TRAILING_SPACE_REGEX,
                        context.ignoreTrailingSpaces ? SPACE : NONE_BREAK_SPACE
                    );
                }
            }

            context.ignoreLeadingSpaces = last == SPACE;

            break;
    }
}

export function normalizeTextSegments(
    segments: ContentModelText[],
    lastInlineSegment: ContentModelSegment | undefined
) {
    segments.forEach(segment => {
        // 3. Segment ends with &nbsp; replace it with space if the previous char is not space so that next segment can wrap
        // Only do this for segments that is not the last one since the last space will be removed in step 4
        if (segment != lastInlineSegment) {
            const text = segment.text;

            if (
                text.substr(-1) == NONE_BREAK_SPACE &&
                text.length > 1 &&
                text.substr(-2, 1) != SPACE
            ) {
                segment.text = text.substring(0, text.length - 1) + SPACE;
            }
        }
    });
}

export function normalizeLastTextSegment(
    segment: ContentModelText | undefined,
    lastInlineSegment: ContentModelSegment | undefined
) {
    if (segment && segment == lastInlineSegment && segment?.text.substr(-1) == SPACE) {
        // 4. last text segment of the paragraph, remove trailing space
        segment.text = segment.text.replace(TRAILING_SPACE_REGEX, '');
    }
}
