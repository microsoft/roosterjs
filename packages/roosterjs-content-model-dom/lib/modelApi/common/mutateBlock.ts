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
 * If an array of segments are passed in, for each of them check if it belongs this paragraph, then return the mutable segment
 * If segments are not passed, just return all segments instead
 * @param paragraph The readonly paragraph to convert from
 * @param segments The segments to convert from
 */
export function mutateParagraph(
    paragraph: ReadonlyContentModelParagraph,
    segments?: ReadonlyContentModelSegment[]
): [ContentModelParagraph, ContentModelSegment[]] {
    const mutablePara = mutateBlock(paragraph);

    if (segments) {
        const result: [ContentModelParagraph, ContentModelSegment[]] = [mutablePara, []];
        segments.forEach(segment => {
            const index = paragraph.segments.indexOf(segment);

            if (index >= 0) {
                result[1].push(mutablePara.segments[index]);
            }
        });

        return result;
    } else {
        return [mutablePara, mutablePara.segments];
    }
}
