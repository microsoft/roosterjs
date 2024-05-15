import type { ContentModelDivider, ReadonlyContentModelDivider } from './ContentModelDivider';
import type { ContentModelEntity } from '../entity/ContentModelEntity';
import type {
    ContentModelFormatContainer,
    ReadonlyContentModelFormatContainer,
    ShallowMutableContentModelFormatContainer,
} from '../blockGroup/ContentModelFormatContainer';
import type {
    ContentModelGeneralBlock,
    ReadonlyContentModelGeneralBlock,
    ShallowMutableContentModelGeneralBlock,
} from '../blockGroup/ContentModelGeneralBlock';
import type {
    ContentModelListItem,
    ReadonlyContentModelListItem,
    ShallowMutableContentModelListItem,
} from '../blockGroup/ContentModelListItem';
import type { ContentModelParagraph, ReadonlyContentModelParagraph } from './ContentModelParagraph';
import type {
    ContentModelTable,
    ReadonlyContentModelTable,
    ShallowMutableContentModelTable,
} from './ContentModelTable';

/**
 * A union type of Content Model Block
 */
export type ContentModelBlock =
    | ContentModelFormatContainer
    | ContentModelListItem
    | ContentModelGeneralBlock
    | ContentModelTable
    | ContentModelParagraph
    | ContentModelEntity
    | ContentModelDivider;

/**
 * A union type of Content Model Block (Readonly)
 */
export type ReadonlyContentModelBlock =
    | ReadonlyContentModelFormatContainer
    | ReadonlyContentModelListItem
    | ReadonlyContentModelGeneralBlock
    | ReadonlyContentModelTable
    | ReadonlyContentModelParagraph
    | ContentModelEntity
    | ReadonlyContentModelDivider;

/**
 * A union type of Content Model Block (Shallow mutable)
 */
export type ShallowMutableContentModelBlock =
    | ShallowMutableContentModelFormatContainer
    | ShallowMutableContentModelListItem
    | ShallowMutableContentModelGeneralBlock
    | ShallowMutableContentModelTable
    | ContentModelParagraph
    | ContentModelEntity
    | ContentModelDivider;
