import type { ContentModelBr, ReadonlyContentModelBr } from '../segment/ContentModelBr';
import type { ContentModelCode, ReadonlyContentModelCode } from '../decorator/ContentModelCode';
import type {
    ContentModelDivider,
    ReadonlyContentModelDivider,
} from '../block/ContentModelDivider';
import type {
    ShallowMutableContentModelDocument,
    ReadonlyContentModelDocument,
} from '../blockGroup/ContentModelDocument';
import type { ContentModelEntity } from '../entity/ContentModelEntity';
import type {
    ShallowMutableContentModelFormatContainer,
    ReadonlyContentModelFormatContainer,
} from '../blockGroup/ContentModelFormatContainer';
import type {
    ShallowMutableContentModelGeneralBlock,
    ReadonlyContentModelGeneralBlock,
} from '../blockGroup/ContentModelGeneralBlock';
import type {
    ShallowMutableContentModelGeneralSegment,
    ReadonlyContentModelGeneralSegment,
} from '../segment/ContentModelGeneralSegment';
import type { ContentModelImage, ReadonlyContentModelImage } from '../segment/ContentModelImage';
import type { ContentModelLink, ReadonlyContentModelLink } from '../decorator/ContentModelLink';
import type {
    ShallowMutableContentModelListItem,
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
import type {
    ReadonlyContentModelTable,
    ShallowMutableContentModelTable,
} from '../block/ContentModelTable';
import type {
    ShallowMutableContentModelTableCell,
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
    ? ShallowMutableContentModelGeneralSegment
    : T extends ReadonlyContentModelSelectionMarker
    ? ContentModelSelectionMarker
    : T extends ReadonlyContentModelImage
    ? ContentModelImage
    : T extends ContentModelEntity
    ? ContentModelEntity
    : T extends ReadonlyContentModelText
    ? ContentModelText
    : T extends ReadonlyContentModelBr
    ? ContentModelBr
    : T extends ReadonlyContentModelParagraph
    ? ContentModelParagraph
    : T extends ReadonlyContentModelTable
    ? ShallowMutableContentModelTable
    : T extends ReadonlyContentModelTableRow
    ? ContentModelTableRow
    : T extends ReadonlyContentModelTableCell
    ? ShallowMutableContentModelTableCell
    : T extends ReadonlyContentModelFormatContainer
    ? ShallowMutableContentModelFormatContainer
    : T extends ReadonlyContentModelListItem
    ? ShallowMutableContentModelListItem
    : T extends ReadonlyContentModelListLevel
    ? ContentModelListLevel
    : T extends ReadonlyContentModelDivider
    ? ContentModelDivider
    : T extends ReadonlyContentModelDocument
    ? ShallowMutableContentModelDocument
    : T extends ReadonlyContentModelGeneralBlock
    ? ShallowMutableContentModelGeneralBlock
    : T extends ReadonlyContentModelParagraphDecorator
    ? ContentModelParagraphDecorator
    : T extends ReadonlyContentModelLink
    ? ContentModelLink
    : T extends ReadonlyContentModelCode
    ? ContentModelCode
    : never;
