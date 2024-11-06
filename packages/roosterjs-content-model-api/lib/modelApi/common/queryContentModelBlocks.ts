import type {
    ContentModelBlockType,
    ReadonlyContentModelBlock,
    ReadonlyContentModelBlockGroup,
} from 'roosterjs-content-model-types';

/**
 * Query content model blocks
 * @param group The block group to query
 * @param blockType The type of block to query @default 'Paragraph'
 * @param filter Optional selector to filter the blocks
 * @param findFirstOnly True to return the first block only, false to return all blocks
 */
export function queryContentModelBlocks<T extends ReadonlyContentModelBlock>(
    group: ReadonlyContentModelBlockGroup,
    blockType?: ContentModelBlockType,
    filter?: (element: T) => element is T,
    findFirstOnly?: boolean
): T[] {
    const type = blockType || 'Paragraph';
    const elements: T[] = [];
    for (let i = 0; i < group.blocks.length; i++) {
        if (findFirstOnly && elements.length > 0) {
            return elements;
        }
        const block = group.blocks[i];
        const results = queryContentModelBlocksInternal<T>(block, type, filter, findFirstOnly);
        elements.push(...results);
    }
    return elements;
}

function queryContentModelBlocksInternal<T extends ReadonlyContentModelBlock>(
    block: ReadonlyContentModelBlock,
    type: ContentModelBlockType,
    filter?: (element: T) => element is T,
    findFirstOnly?: boolean
): T[] {
    const elements: T[] = [];
    if (isExpectedBlockType(block, type, filter)) {
        elements.push(block);
    }

    if (block.blockType == 'BlockGroup') {
        for (const childBlock of block.blocks) {
            if (findFirstOnly && elements.length > 0) {
                return elements;
            }
            const results = queryContentModelBlocksInternal<T>(
                childBlock,
                type,
                filter,
                findFirstOnly
            );
            elements.push(...results);
        }
    }

    if (block.blockType == 'Table') {
        const table = block;
        for (const row of table.rows) {
            for (const cell of row.cells) {
                for (const cellBlock of cell.blocks) {
                    const results = queryContentModelBlocksInternal<T>(
                        cellBlock,
                        type,
                        filter,
                        findFirstOnly
                    );
                    elements.push(...results);
                }
            }
        }
    }
    return elements;
}

function isExpectedBlockType<T extends ReadonlyContentModelBlock>(
    block: ReadonlyContentModelBlock,
    type: ContentModelBlockType,
    filter?: (element: T) => element is T
): block is T {
    return isBlockType<T>(block, type) && (!filter || filter(block));
}

function isBlockType<T extends ReadonlyContentModelBlock>(
    block: ReadonlyContentModelBlock,
    type: string
): block is T {
    return block.blockType == type;
}
