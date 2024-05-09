import type { ContentModelBr, ReadonlyContentModelBr } from '../segment/ContentModelBr';
import type { ContentModelCode, ReadonlyContentModelCode } from '../decorator/ContentModelCode';
import type {
    ContentModelDivider,
    ReadonlyContentModelDivider,
} from '../block/ContentModelDivider';
import type {
    ContentModelDocument,
    ReadonlyContentModelDocument,
} from '../blockGroup/ContentModelDocument';
import type { ContentModelEntity, ReadonlyContentModelEntity } from '../entity/ContentModelEntity';
import type {
    ContentModelFormatContainer,
    ReadonlyContentModelFormatContainer,
} from '../blockGroup/ContentModelFormatContainer';
import type {
    ContentModelGeneralBlock,
    ReadonlyContentModelGeneralBlock,
} from '../blockGroup/ContentModelGeneralBlock';
import type {
    ContentModelGeneralSegment,
    ReadonlyContentModelGeneralSegment,
} from '../segment/ContentModelGeneralSegment';
import type { ContentModelImage, ReadonlyContentModelImage } from '../segment/ContentModelImage';
import type { ContentModelLink, ReadonlyContentModelLink } from '../decorator/ContentModelLink';
import type {
    ContentModelListItem,
    ReadonlyContentModelListItem,
} from '../blockGroup/ContentModelListItem';
import type {
    ContentModelListLevel,
    ReadonlyContentModelListLevel,
} from '../decorator/ContentModelListLevel';
import type {
    ContentModelParagraph,
    ReadonlyContentModelParagraph,
} from '../block/ContentModelParagraph';
import type {
    ContentModelParagraphDecorator,
    ReadonlyContentModelParagraphDecorator,
} from '../decorator/ContentModelParagraphDecorator';
import type {
    ContentModelSelectionMarker,
    ReadonlyContentModelSelectionMarker,
} from '../segment/ContentModelSelectionMarker';
import type { ContentModelTable, ReadonlyContentModelTable } from '../block/ContentModelTable';
import type {
    ContentModelTableCell,
    ReadonlyContentModelTableCell,
} from '../blockGroup/ContentModelTableCell';
import type {
    ContentModelTableRow,
    ReadonlyContentModelTableRow,
} from '../block/ContentModelTableRow';
import type { ContentModelText, ReadonlyContentModelText } from '../segment/ContentModelText';

/**
 * Get mutable type from its related readonly type
 */
export type MutableType<T> = T extends ReadonlyContentModelGeneralSegment
    ? ContentModelGeneralSegment
    : T extends ReadonlyContentModelSelectionMarker
    ? ContentModelSelectionMarker
    : T extends ReadonlyContentModelImage
    ? ContentModelImage
    : T extends ReadonlyContentModelEntity
    ? ContentModelEntity
    : T extends ReadonlyContentModelText
    ? ContentModelText
    : T extends ReadonlyContentModelBr
    ? ContentModelBr
    : T extends ReadonlyContentModelParagraph
    ? ContentModelParagraph
    : T extends ReadonlyContentModelTable
    ? ContentModelTable
    : T extends ReadonlyContentModelTableRow
    ? ContentModelTableRow
    : T extends ReadonlyContentModelTableCell
    ? ContentModelTableCell
    : T extends ReadonlyContentModelFormatContainer
    ? ContentModelFormatContainer
    : T extends ReadonlyContentModelListItem
    ? ContentModelListItem
    : T extends ReadonlyContentModelListLevel
    ? ContentModelListLevel
    : T extends ReadonlyContentModelDivider
    ? ContentModelDivider
    : T extends ReadonlyContentModelDocument
    ? ContentModelDocument
    : T extends ReadonlyContentModelGeneralBlock
    ? ContentModelGeneralBlock
    : T extends ReadonlyContentModelParagraphDecorator
    ? ContentModelParagraphDecorator
    : T extends ReadonlyContentModelLink
    ? ContentModelLink
    : T extends ReadonlyContentModelCode
    ? ContentModelCode
    : never;
