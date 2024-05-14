import type { ContentModelBr, ReadonlyContentModelBr } from '../segment/ContentModelBr';
import type { ContentModelCode, ReadonlyContentModelCode } from '../decorator/ContentModelCode';
import type {
    ContentModelDivider,
    ReadonlyContentModelDivider,
} from '../block/ContentModelDivider';
import type {
    MutableContentModelDocument,
    ReadonlyContentModelDocument,
} from '../blockGroup/ContentModelDocument';
import type { ContentModelEntity, ReadonlyContentModelEntity } from '../entity/ContentModelEntity';
import type {
    MutableContentModelFormatContainer,
    ReadonlyContentModelFormatContainer,
} from '../blockGroup/ContentModelFormatContainer';
import type {
    MutableContentModelGeneralBlock,
    ReadonlyContentModelGeneralBlock,
} from '../blockGroup/ContentModelGeneralBlock';
import type {
    MutableContentModelGeneralSegment,
    ReadonlyContentModelGeneralSegment,
} from '../segment/ContentModelGeneralSegment';
import type { ContentModelImage, ReadonlyContentModelImage } from '../segment/ContentModelImage';
import type { ContentModelLink, ReadonlyContentModelLink } from '../decorator/ContentModelLink';
import type {
    MutableContentModelListItem,
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
    MutableContentModelTableCell,
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
    ? MutableContentModelGeneralSegment
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
    ? MutableContentModelTableCell
    : T extends ReadonlyContentModelFormatContainer
    ? MutableContentModelFormatContainer
    : T extends ReadonlyContentModelListItem
    ? MutableContentModelListItem
    : T extends ReadonlyContentModelListLevel
    ? ContentModelListLevel
    : T extends ReadonlyContentModelDivider
    ? ContentModelDivider
    : T extends ReadonlyContentModelDocument
    ? MutableContentModelDocument
    : T extends ReadonlyContentModelGeneralBlock
    ? MutableContentModelGeneralBlock
    : T extends ReadonlyContentModelParagraphDecorator
    ? ContentModelParagraphDecorator
    : T extends ReadonlyContentModelLink
    ? ContentModelLink
    : T extends ReadonlyContentModelCode
    ? ContentModelCode
    : never;
