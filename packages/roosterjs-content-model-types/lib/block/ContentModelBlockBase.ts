import type { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import type { ContentModelBlockType } from '../enum/BlockType';
import type { ContentModelWithFormat } from '../format/ContentModelWithFormat';

/**
 * Base type of a block
 */
export interface ContentModelBlockBase<
    T extends ContentModelBlockType,
    TFormat extends ContentModelBlockFormat = ContentModelBlockFormat
> extends ContentModelWithFormat<TFormat> {
    /**
     * Type of this block
     */
    blockType: T;
}
