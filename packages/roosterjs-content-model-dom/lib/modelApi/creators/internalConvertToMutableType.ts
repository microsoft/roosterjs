import type {
    ContentModelBr,
    ContentModelCode,
    ContentModelDivider,
    ContentModelDocument,
    ContentModelEntity,
    ContentModelFormatContainer,
    ContentModelGeneralBlock,
    ContentModelGeneralSegment,
    ContentModelImage,
    ContentModelLink,
    ContentModelListItem,
    ContentModelListLevel,
    ContentModelParagraph,
    ContentModelParagraphDecorator,
    ContentModelSelectionMarker,
    ContentModelTable,
    ContentModelTableCell,
    ContentModelTableRow,
    ContentModelText,
    ReadonlyContentModelBr,
    ReadonlyContentModelCode,
    ReadonlyContentModelDivider,
    ReadonlyContentModelDocument,
    ReadonlyContentModelEntity,
    ReadonlyContentModelFormatContainer,
    ReadonlyContentModelGeneralBlock,
    ReadonlyContentModelGeneralSegment,
    ReadonlyContentModelImage,
    ReadonlyContentModelLink,
    ReadonlyContentModelListItem,
    ReadonlyContentModelListLevel,
    ReadonlyContentModelParagraph,
    ReadonlyContentModelParagraphDecorator,
    ReadonlyContentModelSelectionMarker,
    ReadonlyContentModelTable,
    ReadonlyContentModelTableCell,
    ReadonlyContentModelTableRow,
    ReadonlyContentModelText,
} from 'roosterjs-content-model-types';

/**
 * @internal
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
    : T extends ReadonlyContentModelTableRow
    ? ContentModelTableRow
    : T extends ReadonlyContentModelParagraphDecorator
    ? ContentModelParagraphDecorator
    : T extends ReadonlyContentModelLink
    ? ContentModelLink
    : T extends ReadonlyContentModelCode
    ? ContentModelCode
    : never;

/**
 * @internal Convert readonly type to mutable type
 * !!! IMPORTANT PLEASE READ !!!
 * DO NOT USE THIS FUNCTION UNLESS YOU ARE CREATING A NEW INSTANCE OF MODEL
 * DO NOT EXPORT THIS FUNCTION TO PUBLIC
 * @param source The source readonly model
 * @returns Related mutable model
 */
export function internalConvertToMutableType<T>(source: T): MutableType<T> {
    return (source as unknown) as MutableType<T>;
}
