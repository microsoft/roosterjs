import { ContentModelBlockBase } from '../block/ContentModelBlockBase';
import { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import { ContentModelEntityFormat } from '../format/ContentModelEntityFormat';
import { ContentModelSegmentBase } from '../segment/ContentModelSegmentBase';
import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';

/**
 * Content Model of Entity
 */
export interface ContentModelEntity
    extends ContentModelBlockBase<'Entity', ContentModelBlockFormat & ContentModelSegmentFormat>,
        ContentModelSegmentBase<'Entity', ContentModelBlockFormat & ContentModelSegmentFormat> {
    /**
     * The wrapper DOM node of this entity which holds the info CSS classes of this entity
     */
    wrapper: HTMLElement;

    /**
     * Format of this entity
     */
    entityFormat: ContentModelEntityFormat;
}
