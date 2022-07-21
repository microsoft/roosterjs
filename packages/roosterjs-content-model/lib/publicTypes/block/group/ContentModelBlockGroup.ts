import { ContentModelDocument } from './ContentModelDocument';
import { ContentModelGeneralBlock } from './ContentModelGeneralBlock';
import { ContentModelTableCell } from './ContentModelTableCell';

/**
 * The union type of Content Model Block Group
 */
export type ContentModelBlockGroup =
    | ContentModelDocument
    | ContentModelTableCell
    | ContentModelGeneralBlock;
