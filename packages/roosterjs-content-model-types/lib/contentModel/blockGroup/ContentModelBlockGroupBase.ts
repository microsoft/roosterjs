import type { ContentModelBlockWithCache } from '../common/ContentModelBlockWithCache';
import type { ReadonlyMark } from '../common/ReadonlyMark';
import type { MutableMark } from '../common/MutableMark';
import type { ContentModelBlock, ReadonlyContentModelBlock } from '../block/ContentModelBlock';
import type { ContentModelBlockGroupType } from './BlockGroupType';

/**
 * Common part of base type of Content Model Block Group
 */
export interface ContentModelBlockGroupBaseCommon<
    T extends ContentModelBlockGroupType,
    TElement extends HTMLElement = HTMLElement
> extends ContentModelBlockWithCache<TElement> {
    /**
     * Type of this block group
     */
    readonly blockGroupType: T;
}

/**
 * Base type of Content Model Block Group
 */
export interface ContentModelBlockGroupBase<
    T extends ContentModelBlockGroupType,
    TElement extends HTMLElement = HTMLElement
> extends MutableMark, ContentModelBlockGroupBaseCommon<T, TElement> {
    /**
     * Blocks under this group
     */
    blocks: ContentModelBlock[];
}

/**
 * Base type of Content Model Block Group (Readonly)
 */
export interface ReadonlyContentModelBlockGroupBase<
    T extends ContentModelBlockGroupType,
    TElement extends HTMLElement = HTMLElement
> extends ReadonlyMark, ContentModelBlockGroupBaseCommon<T, TElement> {
    /**
     * Blocks under this group
     */
    readonly blocks: ReadonlyArray<ReadonlyContentModelBlock>;
}

/**
 * Base type of Content Model Block Group (Readonly)
 */
export interface MutableContentModelBlockGroupBase<
    T extends ContentModelBlockGroupType,
    TElement extends HTMLElement = HTMLElement
> extends MutableMark, ContentModelBlockGroupBaseCommon<T, TElement> {
    /**
     * Blocks under this group
     */
    blocks: ReadonlyContentModelBlock[];
}
