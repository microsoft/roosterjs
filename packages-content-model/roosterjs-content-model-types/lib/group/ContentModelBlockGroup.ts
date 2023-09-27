import type { ContentModelDocument } from './ContentModelDocument';
import type { ContentModelFormatContainer } from './ContentModelFormatContainer';
import type { ContentModelGeneralBlock } from './ContentModelGeneralBlock';
import type { ContentModelListItem } from './ContentModelListItem';
import type { ContentModelTableCell } from './ContentModelTableCell';

/**
 * The union type of Content Model Block Group
 */
export type ContentModelBlockGroup =
    | ContentModelDocument
    | ContentModelFormatContainer
    | ContentModelListItem
    | ContentModelTableCell
    | ContentModelGeneralBlock;
