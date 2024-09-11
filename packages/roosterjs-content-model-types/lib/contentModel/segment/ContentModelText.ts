import type {
    ContentModelSegmentBase,
    ReadonlyContentModelSegmentBase,
} from './ContentModelSegmentBase';

/**
 * Common port of Content Model for Text
 */
export interface ContentModelTextCommon {
    /**
     * Text content of this segment
     */
    text: string;
}

/**
 * Content Model for Text
 */
export interface ContentModelText extends ContentModelTextCommon, ContentModelSegmentBase<'Text'> {}

/**
 * Content Model for Text (Readonly)
 */
export interface ReadonlyContentModelText
    extends ReadonlyContentModelSegmentBase<'Text'>,
        Readonly<ContentModelTextCommon> {}
