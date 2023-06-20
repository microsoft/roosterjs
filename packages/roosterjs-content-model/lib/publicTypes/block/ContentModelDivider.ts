import { ContentModelBlockBase } from './ContentModelBlockBase';
import { ContentModelBlockWithCache } from './ContentModelBlockWithCache';
import { ContentModelDividerFormat } from '../format/ContentModelDividerFormat';
import { Selectable } from '../selection/Selectable';

/**
 * Content Model of horizontal divider
 */
export interface ContentModelDivider
    extends Selectable,
        ContentModelBlockWithCache,
        ContentModelBlockBase<'Divider', ContentModelDividerFormat> {
    /**
     * Tag name of this element, either HR or DIV
     */
    tagName: 'hr' | 'div';

    /**
     * Size property for HR
     */
    size?: string;
}
