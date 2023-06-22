import { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import { ContentModelBlockType } from '../enum/BlockType';
import { ContentModelWithFormat } from '../format/ContentModelWithFormat';

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
