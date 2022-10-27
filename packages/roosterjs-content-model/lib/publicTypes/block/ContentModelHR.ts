import { ContentModelBlockBase } from './ContentModelBlockBase';

/**
 * Content Model of Paragraph
 */
export interface ContentModelHR extends ContentModelBlockBase<'HR'> {
    /**
     * Whether this element is selected
     */
    isSelected?: boolean;
}
