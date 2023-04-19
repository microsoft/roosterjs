import { ContentModelBlockBase } from '../block/ContentModelBlockBase';
import { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import { ContentModelBlockWithCache } from '../block/ContentModelBlockWithCache';
import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';

/**
 * Content Model of Format Container
 */
export interface ContentModelFormatContainer
    extends ContentModelBlockGroupBase<'FormatContainer'>,
        ContentModelBlockBase<'BlockGroup', ContentModelBlockFormat & ContentModelSegmentFormat>,
        ContentModelBlockWithCache {
    /**
     * Tag name of this container
     */
    tagName: 'blockquote' | 'pre';
}
