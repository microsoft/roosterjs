import { ContentModelBlockBase } from './ContentModelBlockBase';
import { Selectable } from '../selection/Selectable';

/**
 * Content Model of horizontal divider
 */
export interface ContentModelDivider extends ContentModelBlockBase<'Divider'>, Selectable {
    /**
     * Tag name of this element, either HR or DIV
     */
    tagName: 'hr' | 'div';
}
