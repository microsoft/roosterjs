import type {
    MutableType,
    ReadonlyContentModelBlock,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelListItem,
    ReadonlyContentModelParagraph,
    ReadonlyContentModelSegment,
    ReadonlyContentModelTable,
    ShallowMutableContentModelParagraph,
    ShallowMutableContentModelSegment,
} from 'roosterjs-content-model-types';

/**
 * Convert a readonly block to mutable block, clear cached element if exist
 * @param block The block to convert from
 * @returns The same block object of its related mutable type
 */
export function mutateBlock<T extends ReadonlyContentModelBlockGroup | ReadonlyContentModelBlock>(
    block: T
): MutableType<T> {
    if (block.cachedElement) {
        delete block.cachedElement;
    }

    if (isTable(block)) {
        block.rows.forEach(row => {
            delete row.cachedElement;
        });
    } else if (isListItem(block)) {
        block.levels.forEach(level => delete level.cachedElement);
    }

    const result = (block as unknown) as MutableType<T>;

    return result;
}

/**
 * Convert segments of a readonly paragraph to be mutable.
 * Segments that are not belong to the given paragraph will be skipped
 * @param paragraph The readonly paragraph to convert from
 * @param segments The segments to convert from
 */
export function mutateSegments(
    paragraph: ReadonlyContentModelParagraph,
    segments: ReadonlyContentModelSegment[]
): [ShallowMutableContentModelParagraph, ShallowMutableContentModelSegment[], number[]] {
    const mutablePara = mutateBlock(paragraph);
    const result: [
        ShallowMutableContentModelParagraph,
        ShallowMutableContentModelSegment[],
        number[]
    ] = [mutablePara, [], []];

    if (segments) {
        segments.forEach(segment => {
            const index = paragraph.segments.indexOf(segment);

            if (index >= 0) {
                result[1].push(mutablePara.segments[index]);
                result[2].push(index);
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
    segment: T,
    callback?: (
        segment: MutableType<T>,
        paragraph: ShallowMutableContentModelParagraph,
        index: number
    ) => void
): [ShallowMutableContentModelParagraph, MutableType<T> | null, number] {
    const [mutablePara, mutableSegments, indexes] = mutateSegments(paragraph, [segment]);
    const mutableSegment =
        (mutableSegments[0] as ReadonlyContentModelSegment) == segment
            ? (mutableSegments[0] as MutableType<T>)
            : null;

    if (callback && mutableSegment) {
        callback(mutableSegments[0] as MutableType<T>, mutablePara, indexes[0]);
    }

    return [mutablePara, mutableSegment, indexes[0] ?? -1];
}

function isTable(
    obj: ReadonlyContentModelBlockGroup | ReadonlyContentModelBlock
): obj is ReadonlyContentModelTable {
    return (obj as ReadonlyContentModelTable).blockType == 'Table';
}

function isListItem(
    obj: ReadonlyContentModelBlockGroup | ReadonlyContentModelBlock
): obj is ReadonlyContentModelListItem {
    return (obj as ReadonlyContentModelListItem).blockGroupType == 'ListItem';
}
