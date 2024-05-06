import type { Mutable } from '../common/Mutable';
import type {
    ContentModelBlockBase,
    ReadonlyContentModelBlockBase,
} from '../block/ContentModelBlockBase';
import type {
    ContentModelBlockFormat,
    ReadonlyContentModelBlockFormat,
} from '../format/ContentModelBlockFormat';
import type {
    ContentModelEntityFormat,
    ReadonlyContentModelEntityFormat,
} from '../format/ContentModelEntityFormat';
import type {
    ContentModelSegmentBase,
    ReadonlyContentModelSegmentBase,
} from '../segment/ContentModelSegmentBase';
import type {
    ContentModelSegmentFormat,
    ReadonlyContentModelSegmentFormat,
} from '../format/ContentModelSegmentFormat';

/**
 * Common part of Content Model of Entity
 */
export interface ContentModelEntityCommon {
    /**
     * The wrapper DOM node of this entity which holds the info CSS classes of this entity
     */
    wrapper: HTMLElement;
}

/**
 * Content Model of Entity
 */
export interface ContentModelEntity
    extends Mutable,
        ContentModelEntityCommon,
        ContentModelBlockBase<'Entity', ContentModelBlockFormat & ContentModelSegmentFormat>,
        ContentModelSegmentBase<'Entity', ContentModelBlockFormat & ContentModelSegmentFormat> {
    /**
     * Format of this entity
     */
    entityFormat: ContentModelEntityFormat;
}

/**
 * Content Model of Entity (Readonly)
 */
export interface ReadonlyContentModelEntity
    extends Readonly<ContentModelEntityCommon>,
        ReadonlyContentModelBlockBase<
            'Entity',
            ReadonlyContentModelBlockFormat & ReadonlyContentModelSegmentFormat
        >,
        ReadonlyContentModelSegmentBase<
            'Entity',
            ReadonlyContentModelBlockFormat & ReadonlyContentModelSegmentFormat
        > {
    /**
     * Format of this entity
     */
    readonly entityFormat: ReadonlyContentModelEntityFormat;
}
