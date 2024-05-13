import type { ReadonlyMark } from '../common/ReadonlyMark';
import type { MutableMark } from '../common/MutableMark';
import type { ContentModelBlock, ReadonlyContentModelBlock } from '../block/ContentModelBlock';
import type { ContentModelBlockGroupType } from './BlockGroupType';

/**
 * Common part of base type of Content Model Block Group
 */
export interface ContentModelBlockGroupBaseCommon<T extends ContentModelBlockGroupType> {
    /**
     * Type of this block group
     */
    readonly blockGroupType: T;
}

/**
 * Base type of Content Model Block Group
 */
export interface ContentModelBlockGroupBase<T extends ContentModelBlockGroupType>
    extends MutableMark,
        ContentModelBlockGroupBaseCommon<T> {
    /**
     * Blocks under this group
     */
    blocks: ContentModelBlock[];
}

/**
 * Base type of Content Model Block Group (Readonly)
 */
export interface ReadonlyContentModelBlockGroupBase<T extends ContentModelBlockGroupType>
    extends ReadonlyMark,
        ContentModelBlockGroupBaseCommon<T> {
    /**
     * Blocks under this group
     */
    readonly blocks: ReadonlyArray<ReadonlyContentModelBlock>;
}
