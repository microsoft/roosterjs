import type { ContentModelDivider } from './ContentModelDivider';
import type { ContentModelEntity } from '../entity/ContentModelEntity';
import type { ContentModelFormatContainer } from '../group/ContentModelFormatContainer';
import type { ContentModelGeneralBlock } from '../group/ContentModelGeneralBlock';
import type { ContentModelListItem } from '../group/ContentModelListItem';
import type { ContentModelParagraph } from './ContentModelParagraph';
import type { ContentModelTable } from './ContentModelTable';

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
