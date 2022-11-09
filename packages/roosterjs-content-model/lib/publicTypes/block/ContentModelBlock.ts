import { ContentModelEntity } from '../entity/ContentModelEntity';
import { ContentModelGeneralBlock } from './group/ContentModelGeneralBlock';
import { ContentModelHR } from './ContentModelHR';
import { ContentModelListItem } from './group/ContentModelListItem';
import { ContentModelParagraph } from './ContentModelParagraph';
import { ContentModelQuote } from './group/ContentModelQuote';
import { ContentModelTable } from './ContentModelTable';

/**
 * A union type of Content Model Block
 */
export type ContentModelBlock =
    | ContentModelQuote
    | ContentModelListItem
    | ContentModelGeneralBlock
    | ContentModelTable
    | ContentModelParagraph
    | ContentModelEntity
    | ContentModelHR;
