import type { ContentModelBlockBase, ReadonlyContentModelBlockBase } from './ContentModelBlockBase';
import type { ContentModelBlockWithCache } from '../common/ContentModelBlockWithCache';
import type { ContentModelDividerFormat } from '../format/ContentModelDividerFormat';
import type { ReadonlySelectable, Selectable } from '../common/Selectable';

/**
 * Common part of Content Model of horizontal divider
 */
export interface ContentModelDividerCommon {
    /**
     * Tag name of this element, either HR or DIV
     */
    tagName: 'hr' | 'div';

    /**
     * Size property for HR
     */
    size?: string;
}

/**
 * Content Model of horizontal divider
 */
export interface ContentModelDivider
    extends Selectable,
        ContentModelBlockWithCache,
        ContentModelDividerCommon,
        ContentModelBlockBase<'Divider', ContentModelDividerFormat> {}

/**
 * Content Model of horizontal divider (Readonly)
 */
export interface ReadonlyContentModelDivider
    extends ReadonlySelectable,
        ContentModelBlockWithCache,
        ReadonlyContentModelBlockBase<'Divider', ContentModelDividerFormat>,
        Readonly<ContentModelDividerCommon> {}
