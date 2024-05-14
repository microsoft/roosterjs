import type {
    ContentModelDocument,
    ReadonlyContentModelDocument,
    ShallowMutableContentModelDocument,
} from './ContentModelDocument';
import type {
    ContentModelFormatContainer,
    ReadonlyContentModelFormatContainer,
    ShallowMutableContentModelFormatContainer,
} from './ContentModelFormatContainer';
import type {
    ContentModelGeneralBlock,
    ReadonlyContentModelGeneralBlock,
    ShallowMutableContentModelGeneralBlock,
} from './ContentModelGeneralBlock';
import type {
    ContentModelListItem,
    ReadonlyContentModelListItem,
    ShallowMutableContentModelListItem,
} from './ContentModelListItem';
import type {
    ContentModelTableCell,
    ReadonlyContentModelTableCell,
    ShallowMutableContentModelTableCell,
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
 * The union type of Content Model Block Group (Shallow mutable)
 */
export type ShallowMutableContentModelBlockGroup =
    | ShallowMutableContentModelDocument
    | ShallowMutableContentModelFormatContainer
    | ShallowMutableContentModelListItem
    | ShallowMutableContentModelTableCell
    | ShallowMutableContentModelGeneralBlock;
