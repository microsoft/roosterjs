import { ContentModelBlockType } from '../enum/BlockType';
import type { CompatibleContentModelBlockType } from '../compatibleEnum/BlockType';

/**
 * Base type of a block
 */
export interface ContentModelBlockBase<
    T extends ContentModelBlockType | CompatibleContentModelBlockType
> {
    /**
     * Type of this block
     */
    blockType: T;
}
