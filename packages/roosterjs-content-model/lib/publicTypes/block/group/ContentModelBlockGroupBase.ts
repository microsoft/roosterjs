import { ContentModelBlock } from '../ContentModelBlock';
import { ContentModelBlockBase } from '../ContentModelBlockBase';
import { ContentModelBlockGroupType } from '../../enum/BlockGroupType';

/**
 * Base type of Content Model Block Group
 */
export interface ContentModelBlockGroupBase<T extends ContentModelBlockGroupType>
    extends ContentModelBlockBase<'BlockGroup'> {
    /**
     * Type of this block group
     */
    blockGroupType: T;

    /**
     * Blocks under this group
     */
    blocks: ContentModelBlock[];
}
