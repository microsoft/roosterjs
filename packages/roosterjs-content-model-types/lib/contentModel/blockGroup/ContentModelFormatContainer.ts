import type { ReadonlyContentModel } from '../common/Mutable';
import type { ContentModelBlockBase } from '../block/ContentModelBlockBase';
import type { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import type { ContentModelBlockWithCache } from '../common/ContentModelBlockWithCache';
import type { ContentModelFormatContainerFormat } from '../format/ContentModelFormatContainerFormat';

/**
 * Content Model of Format Container
 */
export interface ContentModelFormatContainer
    extends ContentModelBlockWithCache,
        ContentModelBlockGroupBase<'FormatContainer'>,
        ContentModelBlockBase<'BlockGroup', ContentModelFormatContainerFormat> {
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

/**
 * Content Model of Format Container (Readonly)
 */
export type ReadonlyContentModelFormatContainer = ReadonlyContentModel<ContentModelFormatContainer>;
