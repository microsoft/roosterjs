import { ContentModelBlockGroup } from './group/ContentModelBlockGroup';
import { ContentModelParagraph } from './ContentModelParagraph';
import { ContentModelTable } from './ContentModelTable';

/**
 * A union type of Content Model Block
 */
export type ContentModelBlock = ContentModelBlockGroup | ContentModelTable | ContentModelParagraph;
