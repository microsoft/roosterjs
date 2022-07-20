import { ContentModelBlockGroup } from './group/ContentModelBlockGroup';
import { ContentModelParagraph } from './ContentModelParagraph';

/**
 * A union type of Content Model Block
 */
export type ContentModelBlock = ContentModelBlockGroup | ContentModelParagraph;
