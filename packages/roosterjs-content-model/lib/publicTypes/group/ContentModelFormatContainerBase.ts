import { ContentModelBlockBase } from '../block/ContentModelBlockBase';
import { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import { ContentModelBlockWithCache } from '../block/ContentModelBlockWithCache';

/**
 * Content Model of Format Container
 */
export interface ContentModelFormatContainerBase<
    TTagName extends keyof HTMLElementTagNameMap,
    TFormat extends ContentModelBlockFormat = ContentModelBlockFormat
>
    extends ContentModelBlockGroupBase<'FormatContainer'>,
        ContentModelBlockBase<'BlockGroup', TFormat>,
        ContentModelBlockWithCache<HTMLElementTagNameMap[TTagName]> {
    /**
     * Tag name of this container
     */
    tagName: TTagName;
}
