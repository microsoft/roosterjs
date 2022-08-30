import { ContentModelBlockType } from '../enum/BlockType';

/**
 * Base type of a block
 */
export interface ContentModelBlockBase<T extends ContentModelBlockType> {
    /**
     * Type of this block
     */
    blockType: T;
}
