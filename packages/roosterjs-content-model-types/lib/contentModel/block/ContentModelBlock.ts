import type { ContentModelDivider, ReadonlyContentModelDivider } from './ContentModelDivider';
import type { ContentModelEntity } from '../entity/ContentModelEntity';
import type {
    ContentModelFormatContainer,
    ReadonlyContentModelFormatContainer,
} from '../blockGroup/ContentModelFormatContainer';
import type {
    ContentModelGeneralBlock,
    ReadonlyContentModelGeneralBlock,
} from '../blockGroup/ContentModelGeneralBlock';
import type {
    ContentModelListItem,
    ReadonlyContentModelListItem,
} from '../blockGroup/ContentModelListItem';
import type { ContentModelParagraph, ReadonlyContentModelParagraph } from './ContentModelParagraph';
import type { ContentModelTable, ReadonlyContentModelTable } from './ContentModelTable';

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
