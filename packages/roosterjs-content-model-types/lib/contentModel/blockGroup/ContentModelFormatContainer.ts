import type {
    ContentModelBlockBase,
    ReadonlyContentModelBlockBase,
} from '../block/ContentModelBlockBase';
import type {
    ContentModelBlockGroupBase,
    MutableContentModelBlockGroupBase,
    ReadonlyContentModelBlockGroupBase,
} from './ContentModelBlockGroupBase';
import type { ContentModelFormatContainerFormat } from '../format/ContentModelFormatContainerFormat';

/**
 * Common part of Content Model of Format Container
 */
export interface ContentModelFormatContainerCommon {
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
 * Content Model of Format Container
 */
export interface ContentModelFormatContainer
    extends ContentModelFormatContainerCommon,
        ContentModelBlockGroupBase<'FormatContainer'>,
        ContentModelBlockBase<'BlockGroup', ContentModelFormatContainerFormat, HTMLElement> {}

/**
 * Content Model of Format Container (Readonly)
 */
export interface ReadonlyContentModelFormatContainer
    extends Readonly<ContentModelFormatContainerCommon>,
        ReadonlyContentModelBlockGroupBase<'FormatContainer'>,
        ReadonlyContentModelBlockBase<
            'BlockGroup',
            ContentModelFormatContainerFormat,
            HTMLElement
        > {}

/**
 * Content Model of Format Container (Single level mutable)
 */
export interface MutableContentModelFormatContainer
    extends ContentModelFormatContainerCommon,
        MutableContentModelBlockGroupBase<'FormatContainer'>,
        ContentModelBlockBase<'BlockGroup', ContentModelFormatContainerFormat, HTMLElement> {}
