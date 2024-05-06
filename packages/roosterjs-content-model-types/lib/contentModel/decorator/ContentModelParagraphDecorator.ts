import type { Mutable } from '../common/Mutable';
import type {
    ContentModelSegmentFormat,
    ReadonlyContentModelSegmentFormat,
} from '../format/ContentModelSegmentFormat';
import type {
    ContentModelWithFormat,
    ReadonlyContentModelWithFormat,
} from '../format/ContentModelWithFormat';

/**
 * Common part of decorator for a paragraph in Content Model
 */
export interface ContentModelParagraphDecoratorCommon {
    /**
     * Tag name of this paragraph
     */
    tagName: string;
}

/**
 * Represent decorator for a paragraph in Content Model
 * A decorator of paragraph can represent a heading, or a P tag that act likes a paragraph but with some extra format info
 * since heading is also a kind of paragraph, with some extra information
 */
export interface ContentModelParagraphDecorator
    extends Mutable,
        ContentModelParagraphDecoratorCommon,
        ContentModelWithFormat<ContentModelSegmentFormat> {}

/**
 * Represent decorator for a paragraph in Content Model (Readonly)
 * A decorator of paragraph can represent a heading, or a P tag that act likes a paragraph but with some extra format info
 * since heading is also a kind of paragraph, with some extra information
 */
export interface ReadonlyContentModelParagraphDecorator
    extends ReadonlyContentModelWithFormat<ReadonlyContentModelSegmentFormat>,
        Readonly<ContentModelParagraphDecoratorCommon> {}
