import type { ContentModelBlockBase } from '../block/ContentModelBlockBase';
import type { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import type { ContentModelSegmentBase } from '../segment/ContentModelSegmentBase';
import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';

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
     * Whether this is a readonly entity
     */
    isReadonly: boolean;

    /**
     * Type of this entity. Specified when insert an entity, can be an valid CSS class-like string.
     */
    type?: string;

    /**
     * Id of this entity, generated by editor code and will be unique within an editor
     */
    id?: string;
}
