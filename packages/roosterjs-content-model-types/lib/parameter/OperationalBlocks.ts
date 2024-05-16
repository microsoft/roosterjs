import type {
    ContentModelBlock,
    ReadonlyContentModelBlock,
} from '../contentModel/block/ContentModelBlock';
import type {
    ContentModelBlockGroup,
    ReadonlyContentModelBlockGroup,
} from '../contentModel/blockGroup/ContentModelBlockGroup';

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

/**
 * Represent a pair of parent block group and child block (Readonly)
 */
export type ReadonlyOperationalBlocks<T extends ReadonlyContentModelBlockGroup> = {
    /**
     * The parent block group
     */
    parent: ReadonlyContentModelBlockGroup;

    /**
     * The child block
     */
    block: ReadonlyContentModelBlock | T;

    /**
     * Selection path of this block
     */
    path: ReadonlyContentModelBlockGroup[];
};
