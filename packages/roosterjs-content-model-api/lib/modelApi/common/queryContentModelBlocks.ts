import type {
    ContentModelBlockType,
    ReadonlyContentModelBlock,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelTable,
} from 'roosterjs-content-model-types';

/**
 * Options for queryContentModel
 */
export interface QueryContentModelOptions<T extends ReadonlyContentModelBlock> {
    /**
     * The type of block to query @default 'Paragraph'
     */
    blockType?: ContentModelBlockType;

    /**
     * Optional selector to filter the blocks
     */
    filter?: (element: T) => element is T;

    /**
     * True to return the first block only, false to return all blocks
     */
    findFirstOnly?: boolean;
}

/**
 * Query content model blocks
 * @param group The block group to query
 * @param options The query option
 */
export function queryContentModelBlocks<T extends ReadonlyContentModelBlock>(
    group: ReadonlyContentModelBlockGroup,
    options: QueryContentModelOptions<T>
): T[] {
    const { blockType, filter, findFirstOnly } = options;
    const type = blockType || 'Paragraph';

    return queryContentModelBlocksInternal<T>(group, type, filter, findFirstOnly);
}

function queryContentModelBlocksInternal<T extends ReadonlyContentModelBlock>(
    group: ReadonlyContentModelBlockGroup,
    type: ContentModelBlockType,
    filter?: (element: T) => element is T,
    findFirstOnly?: boolean
): T[] {
    const elements: T[] = [];
    for (let i = 0; i < group.blocks.length; i++) {
        if (findFirstOnly && elements.length > 0) {
            return elements;
        }
        const block = group.blocks[i];
        switch (block.blockType) {
            case 'BlockGroup':
                if (isBlockType<T>(block, type) && (!filter || filter(block))) {
                    elements.push(block);
                }
                const blockGroupsResults = queryContentModelBlocksInternal<T>(
                    block,
                    type,
                    filter,
                    findFirstOnly
                );
                elements.push(...blockGroupsResults);
                break;
            case 'Table':
                if (isBlockType<T>(block, type) && (!filter || filter(block))) {
                    elements.push(block);
                }
                const tableResults = searchInTables(block, type, filter, findFirstOnly);
                elements.push(...tableResults);
                break;
            case 'Divider':
            case 'Entity':
            case 'Paragraph':
                if (isBlockType<T>(block, type) && (!filter || filter(block))) {
                    elements.push(block);
                }
                break;
        }
    }
    return elements;
}

function isBlockType<T extends ReadonlyContentModelBlock>(
    block: ReadonlyContentModelBlock,
    type: string
): block is T {
    return block.blockType == type;
}

function searchInTables<T extends ReadonlyContentModelBlock>(
    table: ReadonlyContentModelTable,
    type: ContentModelBlockType,
    filter?: (element: T) => element is T,
    findFirstOnly?: boolean
): T[] {
    const blocks: T[] = [];
    for (const row of table.rows) {
        for (const cell of row.cells) {
            const items = queryContentModelBlocksInternal<T>(cell, type, filter, findFirstOnly);
            blocks.push(...items);
        }
    }
    return blocks;
}
