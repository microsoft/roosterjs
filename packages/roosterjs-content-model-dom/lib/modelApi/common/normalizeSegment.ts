import { hasSpacesOnly } from './hasSpacesOnly';
import { mutateSegment } from './mutate';
import type {
    ReadonlyContentModelParagraph,
    ReadonlyContentModelSegment,
    ReadonlyContentModelText,
} from 'roosterjs-content-model-types';

const SPACE = '\u0020';
const NONE_BREAK_SPACE = '\u00A0';
const LEADING_SPACE_REGEX = /^\u0020+/;
const TRAILING_SPACE_REGEX = /\u0020+$/;

/**
 * @internal
 */
export function normalizeAllSegments(paragraph: ReadonlyContentModelParagraph) {
    const context = resetNormalizeSegmentContext();

    paragraph.segments.forEach(segment => {
        normalizeSegment(paragraph, segment, context);
    });

    normalizeTextSegments(paragraph, context.textSegments, context.lastInlineSegment);
    normalizeLastTextSegment(paragraph, context.lastTextSegment, context.lastInlineSegment);
}

/**
 * Normalize a given segment, make sure its spaces are correctly represented by space and non-break space
 * @param segment The segment to normalize
 * @param ignoreTrailingSpaces Whether we should ignore the trailing space of the text segment @default false
 */
export function normalizeSingleSegment(
    paragraph: ReadonlyContentModelParagraph,
    segment: ReadonlyContentModelSegment,
    ignoreTrailingSpaces: boolean = false
) {
    const context = resetNormalizeSegmentContext();
    const index = paragraph.segments.indexOf(segment);

    context.ignoreTrailingSpaces = ignoreTrailingSpaces;

    // Search backward for the nearest non-empty text segment (skipping SelectionMarkers and empty text),
    // to determine whether leading spaces of the current segment should be preserved.
    // If the previous text doesn't end with a space, keep the leading space to maintain word separation.
    for (let i = index - 1; i >= 0; i--) {
        const s = paragraph.segments[i];

        if (s.segmentType == 'Text') {
            if (s.text.length > 0) {
                if (s.text.substr(-1) != SPACE) {
                    context.ignoreLeadingSpaces = false;
                }
                break;
            }
        } else if (s.segmentType == 'Image') {
            // If the previous segment is an image, we should keep the leading space of the current segment to maintain word separation.
            context.ignoreLeadingSpaces = false;
            break;
        } else if (s.segmentType == 'Br') {
            // If the previous segment is a line break, we should ignore the leading space of the current segment.
            context.ignoreLeadingSpaces = true;
        } else if (s.segmentType != 'SelectionMarker') {
            break;
        }
    }

    normalizeSegment(paragraph, segment, context);
}

/**
 * @internal Export for test only
 */
export interface NormalizeSegmentContext {
    textSegments: ReadonlyContentModelText[];
    ignoreLeadingSpaces: boolean;
    ignoreTrailingSpaces: boolean;
    lastTextSegment: ReadonlyContentModelText | undefined;
    lastInlineSegment: ReadonlyContentModelSegment | undefined;
}

/**
 * @internal Export for test only
 */
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
 * @internal Export for test only
 */
export function normalizeSegment(
    paragraph: ReadonlyContentModelParagraph,
    segment: ReadonlyContentModelSegment,
    context: NormalizeSegmentContext
) {
    switch (segment.segmentType) {
        case 'Br':
            normalizeTextSegments(paragraph, context.textSegments, context.lastInlineSegment);
            normalizeLastTextSegment(paragraph, context.lastTextSegment, context.lastInlineSegment);

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
            // Skip empty text segments to avoid affecting normalization context
            if (segment.text.length == 0) {
                break;
            }

            context.textSegments.push(segment);
            context.lastInlineSegment = segment;
            context.lastTextSegment = segment;

            const first = segment.text.substring(0, 1);
            const last = segment.text.substr(-1);

            if (!hasSpacesOnly(segment.text)) {
                if (first == SPACE) {
                    // 1. Multiple leading space => single space or empty (depends on if previous segment ends with space)
                    mutateSegment(paragraph, segment, textSegment => {
                        textSegment.text = textSegment.text.replace(
                            LEADING_SPACE_REGEX,
                            context.ignoreLeadingSpaces ? '' : SPACE
                        );
                    });
                }

                if (last == SPACE) {
                    // 2. Multiple trailing space => single space
                    mutateSegment(paragraph, segment, textSegment => {
                        textSegment.text = textSegment.text.replace(
                            TRAILING_SPACE_REGEX,
                            context.ignoreTrailingSpaces ? SPACE : NONE_BREAK_SPACE
                        );
                    });
                }
            }

            context.ignoreLeadingSpaces = last == SPACE;

            break;
    }
}

function normalizeTextSegments(
    paragraph: ReadonlyContentModelParagraph,
    segments: ReadonlyContentModelText[],
    lastInlineSegment: ReadonlyContentModelSegment | undefined
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
                mutateSegment(paragraph, segment, textSegment => {
                    textSegment.text = text.substring(0, text.length - 1) + SPACE;
                });
            }
        }
    });
}

function normalizeLastTextSegment(
    paragraph: ReadonlyContentModelParagraph,
    segment: ReadonlyContentModelText | undefined,
    lastInlineSegment: ReadonlyContentModelSegment | undefined
) {
    if (segment && segment == lastInlineSegment && segment?.text.substr(-1) == SPACE) {
        // 4. last text segment of the paragraph, remove trailing space
        mutateSegment(paragraph, segment, textSegment => {
            textSegment.text = textSegment.text.replace(TRAILING_SPACE_REGEX, '');
        });
    }
}
