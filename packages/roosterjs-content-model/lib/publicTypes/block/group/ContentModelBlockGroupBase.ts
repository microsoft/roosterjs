import { ContentModelBlock } from '../ContentModelBlock';
import { ContentModelBlockBase } from '../ContentModelBlockBase';
import { ContentModelBlockGroupType } from '../../enum/BlockGroupType';
import { ContentModelBlockType } from '../../enum/BlockType';
import type { CompatibleContentModelBlockGroupType } from '../../compatibleEnum/BlockGroupType';

/**
 * Base type of Content Model Block Group
 */
export interface ContentModelBlockGroupBase<
    T extends ContentModelBlockGroupType | CompatibleContentModelBlockGroupType
> extends ContentModelBlockBase<ContentModelBlockType.BlockGroup> {
    /**
     * Type of this block group
     */
    blockGroupType: T;

    /**
     * Blocks under this group
     */
    blocks: ContentModelBlock[];
}
