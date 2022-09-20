import { ContentModelGeneralBlock } from './group/ContentModelGeneralBlock';
import { ContentModelParagraph } from './ContentModelParagraph';
import { ContentModelTable } from './ContentModelTable';

/**
 * A union type of Content Model Block
 */
export type ContentModelBlock =
    | ContentModelGeneralBlock
    | ContentModelTable
    | ContentModelParagraph;
