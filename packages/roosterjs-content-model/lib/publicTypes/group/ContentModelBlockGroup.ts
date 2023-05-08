import { ContentModelDocument } from './ContentModelDocument';
import { ContentModelFormatContainer } from './ContentModelFormatContainer';
import { ContentModelGeneralBlock } from './ContentModelGeneralBlock';
import { ContentModelListItem } from './ContentModelListItem';
import { ContentModelTableCell } from './ContentModelTableCell';

/**
 * The union type of Content Model Block Group
 */
export type ContentModelBlockGroup =
    | ContentModelDocument
    | ContentModelFormatContainer
    | ContentModelListItem
    | ContentModelTableCell
    | ContentModelGeneralBlock;
