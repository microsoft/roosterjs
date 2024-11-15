import { areSameFormats } from '../../domToModel/utils/areSameFormats';
import type {
    ContentModelText,
    ReadonlyContentModelCode,
    ReadonlyContentModelLink,
    ReadonlyContentModelSegment,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * Find continuous text segments that have the same format and decorators, merge them, So we can reduce total count of segments
 * @param block The parent paragraph to check.
 */
export function mergeTextSegments(block: ShallowMutableContentModelParagraph) {
    let lastText: ContentModelText | null = null;

    for (let i = 0; i < block.segments.length; i++) {
        const segment = block.segments[i];

        if (segment.segmentType != 'Text') {
            lastText = null;
        } else if (!lastText || !segmentsWithSameFormat(lastText, segment)) {
            lastText = segment;
        } else {
            lastText.text += segment.text;
            block.segments.splice(i, 1);
            i--;
        }
    }
}

function segmentsWithSameFormat(
    seg1: ReadonlyContentModelSegment,
    seg2: ReadonlyContentModelSegment
) {
    return (
        !!seg1.isSelected == !!seg2.isSelected &&
        areSameFormats(seg1.format, seg2.format) &&
        areSameLinks(seg1.link, seg2.link) &&
        areSameCodes(seg1.code, seg2.code)
    );
}

function areSameLinks(
    link1: ReadonlyContentModelLink | undefined,
    link2: ReadonlyContentModelLink | undefined
) {
    return (
        (!link1 && !link2) ||
        (link1 &&
            link2 &&
            areSameFormats(link1.format, link2.format) &&
            areSameFormats(link1.dataset, link2.dataset))
    );
}

function areSameCodes(
    code1: ReadonlyContentModelCode | undefined,
    code2: ReadonlyContentModelCode | undefined
) {
    return (!code1 && !code2) || (code1 && code2 && areSameFormats(code1.format, code2.format));
}
