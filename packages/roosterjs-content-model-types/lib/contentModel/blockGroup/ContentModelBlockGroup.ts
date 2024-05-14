import type {
    ContentModelDocument,
    MutableContentModelDocument,
    ReadonlyContentModelDocument,
} from './ContentModelDocument';
import type {
    ContentModelFormatContainer,
    MutableContentModelFormatContainer,
    ReadonlyContentModelFormatContainer,
} from './ContentModelFormatContainer';
import type {
    ContentModelGeneralBlock,
    MutableContentModelGeneralBlock,
    ReadonlyContentModelGeneralBlock,
} from './ContentModelGeneralBlock';
import type {
    ContentModelListItem,
    MutableContentModelListItem,
    ReadonlyContentModelListItem,
} from './ContentModelListItem';
import type {
    ContentModelTableCell,
    MutableContentModelTableCell,
    ReadonlyContentModelTableCell,
} from './ContentModelTableCell';

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

/**
 * The union type of Content Model Block Group (Single level mutable)
 */
export type MutableContentModelBlockGroup =
    | MutableContentModelDocument
    | MutableContentModelFormatContainer
    | MutableContentModelListItem
    | MutableContentModelTableCell
    | MutableContentModelGeneralBlock;
