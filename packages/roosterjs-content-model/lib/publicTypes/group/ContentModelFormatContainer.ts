import { ContentModelBlockBase } from '../block/ContentModelBlockBase';
import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import { ContentModelBlockWithCache } from '../block/ContentModelBlockWithCache';
import { ContentModelFormatContainerFormat } from '../format/ContentModelFormatContainerFormat';

/**
 * Content Model of Format Container
 */
export interface ContentModelFormatContainer
    extends ContentModelBlockGroupBase<'FormatContainer'>,
        ContentModelBlockBase<'BlockGroup', ContentModelFormatContainerFormat>,
        ContentModelBlockWithCache {
    /**
     * Tag name of this container
     */
    tagName: Lowercase<string>;

    /**
     * Whether we can apply "font-size: 0" to this paragraph. When set to true, we will check if there is no text segment inside,
     * and apply "font-size: 0" to the container element
     */
    zeroFontSize?: boolean;
}
