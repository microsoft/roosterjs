import type { ContentModelBlockWithCache } from '../common/ContentModelBlockWithCache';
import type { MutableMark, ReadonlyMark, ShallowMutableMark } from '../common/MutableMark';
import type { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import type { ContentModelBlockType } from './BlockType';
import type {
    ContentModelWithFormat,
    ReadonlyContentModelWithFormat,
} from '../format/ContentModelWithFormat';

/**
 * Common part of base type of a block
 */
export interface ContentModelBlockBaseCommon<T extends ContentModelBlockType> {
    /**
     * Type of this block
     */
    readonly blockType: T;
}

/**
 * Base type of a block
 */
export interface ContentModelBlockBase<
    T extends ContentModelBlockType,
    TFormat extends ContentModelBlockFormat = ContentModelBlockFormat,
    TCacheElement extends HTMLElement = HTMLElement
>
    extends MutableMark,
        ContentModelBlockBaseCommon<T>,
        ContentModelWithFormat<TFormat>,
        ContentModelBlockWithCache<TCacheElement> {}

/**
 * Base type of a block (Readonly)
 */
export interface ReadonlyContentModelBlockBase<
    T extends ContentModelBlockType,
    TFormat extends ContentModelBlockFormat = ContentModelBlockFormat,
    TCacheElement extends HTMLElement = HTMLElement
>
    extends ReadonlyMark,
        ContentModelBlockBaseCommon<T>,
        ReadonlyContentModelWithFormat<TFormat>,
        ContentModelBlockWithCache<TCacheElement> {}

/**
 * Base type of a block (Shallow mutable)
 */
export interface ShallowMutableContentModelBlockBase<
    T extends ContentModelBlockType,
    TFormat extends ContentModelBlockFormat = ContentModelBlockFormat,
    TCacheElement extends HTMLElement = HTMLElement
>
    extends ShallowMutableMark,
        ContentModelBlockBaseCommon<T>,
        ContentModelWithFormat<TFormat>,
        ContentModelBlockWithCache<TCacheElement> {}
