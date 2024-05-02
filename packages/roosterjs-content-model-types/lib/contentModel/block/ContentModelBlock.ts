import type { ContentModelDivider } from './ContentModelDivider';
import type { ContentModelEntity } from '../entity/ContentModelEntity';
import type { ContentModelFormatContainer } from '../blockGroup/ContentModelFormatContainer';
import type { ContentModelGeneralBlock } from '../blockGroup/ContentModelGeneralBlock';
import type { ContentModelListItem } from '../blockGroup/ContentModelListItem';
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
