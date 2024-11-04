import type {
    ContentModelBlockType,
    ContentModelSegmentType,
    ReadonlyContentModelBlock,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelParagraph,
    ReadonlyContentModelSegment,
    ReadonlyContentModelTable,
} from 'roosterjs-content-model-types';

/**
 * Options for queryContentModel
 */
export interface QueryContentModelOptions<T> {
    /**
     * The type of block to query @default 'Paragraph'
     */
    type?: ContentModelBlockType;

    /**
     * The type of segment to query
     */
    segmentType?: ContentModelSegmentType;

    /**
     * Optional selector to filter the blocks/segments
     */
    selector?: (element: T) => boolean;

    /**
     * True to return the first block only, false to return all blocks
     */
    findFirstOnly?: boolean;
}

/**
 * Query content model blocks or segments
 * @param group The block group to query
 * @param options The query option
 */
export function queryContentModel<
    T extends ReadonlyContentModelBlock | ReadonlyContentModelSegment
>(group: ReadonlyContentModelBlockGroup, options: QueryContentModelOptions<T>): T[] {
    const elements: T[] = [];
    const searchOptions = options.type ? options : { ...options, type: 'Paragraph' };
    const { type, segmentType, selector, findFirstOnly } = searchOptions;

    for (let i = 0; i < group.blocks.length; i++) {
        if (findFirstOnly && elements.length > 0) {
            return elements;
        }
        const block = group.blocks[i];
        switch (block.blockType) {
            case 'BlockGroup':
                if (type == block.blockType && (!selector || selector(block as T))) {
                    elements.push(block as T);
                }
                const blockGroupsResults = queryContentModel<T>(block, options);
                elements.push(...(blockGroupsResults as T[]));
                break;
            case 'Table':
                if (type == block.blockType && (!selector || selector(block as T))) {
                    elements.push(block as T);
                }
                const tableResults = searchInTables(block, options);
                elements.push(...(tableResults as T[]));
                break;
            case 'Divider':
            case 'Entity':
                if (type == block.blockType && (!selector || selector(block as T))) {
                    elements.push(block as T);
                }
                break;
            case 'Paragraph':
                if (type == block.blockType) {
                    if (!segmentType && (!selector || selector(block as T))) {
                        elements.push(block as T);
                    } else if (segmentType) {
                        const segments = searchInParagraphs(block, segmentType, selector);
                        elements.push(...(segments as T[]));
                    }
                }
                break;
        }
    }

    return elements;
}

function searchInTables<T extends ReadonlyContentModelBlock | ReadonlyContentModelSegment>(
    table: ReadonlyContentModelTable,
    options: QueryContentModelOptions<T>
): T[] {
    const blocks: T[] = [];
    for (const row of table.rows) {
        for (const cell of row.cells) {
            const items = queryContentModel<T>(cell, options);
            blocks.push(...items);
        }
    }
    return blocks;
}

function searchInParagraphs<P extends ReadonlyContentModelBlock | ReadonlyContentModelSegment>(
    block: ReadonlyContentModelParagraph,
    segmentType: ContentModelSegmentType,
    selector?: (element: P) => boolean
): P[] {
    const segments: P[] = [];
    for (const segment of block.segments) {
        if (segment.segmentType == segmentType && (!selector || selector(segment as P))) {
            segments.push(segment as P);
        }
    }
    return segments;
}
