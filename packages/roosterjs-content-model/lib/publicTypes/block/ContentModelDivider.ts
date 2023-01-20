import { ContentModelBlockBase } from './ContentModelBlockBase';
import { ContentModelDividerFormat } from '../format/ContentModelDividerFormat';
import { Selectable } from '../selection/Selectable';

/**
 * Content Model of horizontal divider
 */
export interface ContentModelDivider
    extends ContentModelBlockBase<'Divider', ContentModelDividerFormat>,
        Selectable {
    /**
     * Tag name of this element, either HR or DIV
     */
    tagName: 'hr' | 'div';

    /**
     * Whether this element is selected
     */
    isSelected?: boolean;
}
