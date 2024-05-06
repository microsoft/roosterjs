import type { ContentModelDocument, ReadonlyContentModelDocument } from './ContentModelDocument';
import type {
    ContentModelFormatContainer,
    ReadonlyContentModelFormatContainer,
} from './ContentModelFormatContainer';
import type {
    ContentModelGeneralBlock,
    ReadonlyContentModelGeneralBlock,
} from './ContentModelGeneralBlock';
import type { ContentModelListItem, ReadonlyContentModelListItem } from './ContentModelListItem';
import type { ContentModelTableCell, ReadonlyContentModelTableCell } from './ContentModelTableCell';

/**
 * The union type of Content Model Block Group
 */
export type ContentModelBlockGroup =
    | ContentModelDocument
    | ContentModelFormatContainer
    | ContentModelListItem
    | ContentModelTableCell
    | ContentModelGeneralBlock;

/**
 * The union type of Content Model Block Group (Readonly)
 */
export type ReadonlyContentModelBlockGroup =
    | ReadonlyContentModelDocument
    | ReadonlyContentModelFormatContainer
    | ReadonlyContentModelListItem
    | ReadonlyContentModelTableCell
    | ReadonlyContentModelGeneralBlock;
