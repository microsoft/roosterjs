import { ContentModelDocument } from './ContentModelDocument';
import { ContentModelGeneralBlock } from './ContentModelGeneralBlock';
import { ContentModelListItem } from './ContentModelListItem';
import { ContentModelQuote } from './ContentModelQuote';
import { ContentModelTableCell } from './ContentModelTableCell';

/**
 * The union type of Content Model Block Group
 */
export type ContentModelBlockGroup =
    | ContentModelDocument
    | ContentModelQuote
    | ContentModelListItem
    | ContentModelTableCell
    | ContentModelGeneralBlock;
