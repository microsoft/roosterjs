import { ContentModelDocument } from './ContentModelDocument';
import { ContentModelGeneralBlock } from './ContentModelGeneralBlock';

/**
 * The union type of Content Model Block Group
 */
export type ContentModelBlockGroup = ContentModelDocument | ContentModelGeneralBlock;
