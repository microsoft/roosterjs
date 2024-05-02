import type { ContentModelBlock } from '../contentModel/block/ContentModelBlock';
import type { ContentModelBlockGroup } from '../contentModel/blockGroup/ContentModelBlockGroup';

/**
 * Represent a pair of parent block group and child block
 */
export type OperationalBlocks<T extends ContentModelBlockGroup> = {
    /**
     * The parent block group
     */
    parent: ContentModelBlockGroup;

    /**
     * The child block
     */
    block: ContentModelBlock | T;

    /**
     * Selection path of this block
     */
    path: ContentModelBlockGroup[];
};
