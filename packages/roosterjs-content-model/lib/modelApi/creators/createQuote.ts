import { ContentModelQuote } from '../../publicTypes/block/group/ContentModelQuote';

/**
 * @internal
 */
export function createQuote(): ContentModelQuote {
    return {
        blockType: 'BlockGroup',
        blockGroupType: 'Quote',
        blocks: [],
        format: {},
    };
}
