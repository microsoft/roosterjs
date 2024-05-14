import type {
    ContentModelBlockWithCache,
    ContentModelParagraph,
    ContentModelSegment,
    MutableType,
    ReadonlyContentModelParagraph,
    ReadonlyContentModelSegment,
} from 'roosterjs-content-model-types';

/**
 * Convert a readonly block to mutable block, clear cached element if exist
 * @param block The block to convert from
 * @returns The same block object of its related mutable type
 */
export function mutateBlock<T extends ContentModelBlockWithCache>(block: T): MutableType<T> {
    if (block.cachedElement) {
        delete block.cachedElement;
    }

    const result = (block as unknown) as MutableType<T>;

    return result;
}

/**
 * Convert a readonly paragraph to mutable paragraph, together with its segments.
 * For each of segments that passed in, return them as mutable segments.
 * Segments that are not belong to the given paragraph will be skipped
 * @param paragraph The readonly paragraph to convert from
 * @param segments The segments to convert from
 */
export function mutateParagraph(
    paragraph: ReadonlyContentModelParagraph,
    segments: ReadonlyContentModelSegment[]
): [ContentModelParagraph, ContentModelSegment[]] {
    const mutablePara = mutateBlock(paragraph);
    const result: [ContentModelParagraph, ContentModelSegment[]] = [mutablePara, []];

    if (segments) {
        segments.forEach(segment => {
            const index = paragraph.segments.indexOf(segment);

            if (index >= 0) {
                result[1].push(mutablePara.segments[index]);
            }
        });
    }

    return result;
}

/**
 * Convert a readonly segment to be mutable, together with its owner paragraph
 * If the segment does not belong to the given paragraph, return null for the segment
 * @param paragraph The readonly paragraph to convert from
 * @param segment The segment to convert from
 */
export function mutateSegment<T extends ReadonlyContentModelSegment>(
    paragraph: ReadonlyContentModelParagraph,
    segment: T
): [ContentModelParagraph, MutableType<T> | null] {
    const [mutablePara, mutableSegments] = mutateParagraph(paragraph, [segment]);

    return [
        mutablePara,
        (mutableSegments[0] as ReadonlyContentModelSegment) == segment
            ? (mutableSegments[0] as MutableType<T>)
            : null,
    ];
}
