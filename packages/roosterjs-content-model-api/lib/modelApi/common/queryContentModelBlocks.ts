import { createDomToModelContext, domToContentModel } from 'roosterjs-content-model-dom';
import type {
    ContentModelBlockType,
    ContentModelEntity,
    EditorContext,
    ReadonlyContentModelBlock,
    ReadonlyContentModelBlockBase,
    ReadonlyContentModelBlockGroup,
} from 'roosterjs-content-model-types';

/**
 * Query content model blocks
 * @param group The block group to query
 * @param type The type of block to query
 * @param filter Optional selector to filter the blocks
 * @param findFirstOnly True to return the first block only, false to return all blocks
 * @param shouldExpandEntity Optional function to determine if an entity's children should be recursively queried, should return a EditorContext if the entity should be expanded, or null if not
 */
export function queryContentModelBlocks<T extends ReadonlyContentModelBlock>(
    group: ReadonlyContentModelBlockGroup,
    type: T extends ReadonlyContentModelBlockBase<infer U> ? U : never,
    filter?: (element: T) => element is T,
    findFirstOnly?: boolean,
    shouldExpandEntity?: (entity: ContentModelEntity) => EditorContext | null
): T[] {
    const elements: T[] = [];
    for (let i = 0; i < group.blocks.length; i++) {
        if (findFirstOnly && elements.length > 0) {
            return elements;
        }
        const block = group.blocks[i];

        switch (block.blockType) {
            case 'Paragraph':
            case 'Divider':
            case 'Entity':
                if (isExpectedBlockType(block, type, filter)) {
                    elements.push(block);
                }
                if (block.blockType == 'Entity' && shouldExpandEntity) {
                    const editorContext = shouldExpandEntity(block);
                    if (editorContext) {
                        const context = createDomToModelContext(editorContext);
                        const model = domToContentModel(block.wrapper, context);
                        const results = queryContentModelBlocks<T>(
                            model,
                            type,
                            filter,
                            findFirstOnly,
                            shouldExpandEntity
                        );
                        elements.push(...results);
                    }
                }
                break;
            case 'BlockGroup':
                if (isExpectedBlockType(block, type, filter)) {
                    elements.push(block);
                }
                const results = queryContentModelBlocks<T>(
                    block,
                    type,
                    filter,
                    findFirstOnly,
                    shouldExpandEntity
                );
                elements.push(...results);
                break;
            case 'Table':
                if (isExpectedBlockType(block, type, filter)) {
                    elements.push(block);
                }
                for (const row of block.rows) {
                    for (const cell of row.cells) {
                        const results = queryContentModelBlocks<T>(
                            cell,
                            type,
                            filter,
                            findFirstOnly,
                            shouldExpandEntity
                        );
                        elements.push(...results);
                    }
                }
                break;
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
    type: ContentModelBlockType
): block is T {
    return block.blockType == type;
}
