import { ContentModelBlock } from '../block/ContentModelBlock';
import { ContentModelBlockGroupType } from '../enum/BlockGroupType';

/**
 * Base type of Content Model Block Group
 */
export interface ContentModelBlockGroupBase<T extends ContentModelBlockGroupType> {
    /**
     * Type of this block group
     */
    blockGroupType: T;

    /**
     * Blocks under this group
     */
    blocks: ContentModelBlock[];
}
