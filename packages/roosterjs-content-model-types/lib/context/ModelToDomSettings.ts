import type { Definition } from '../metadata/Definition';
import type { ReadonlyContentModelBlock } from '../contentModel/block/ContentModelBlock';
import type { ReadonlyContentModelBlockFormat } from '../contentModel/format/ContentModelBlockFormat';
import type { ReadonlyContentModelBlockGroup } from '../contentModel/blockGroup/ContentModelBlockGroup';
import type { ReadonlyContentModelBr } from '../contentModel/segment/ContentModelBr';
import type { ReadonlyContentModelDecorator } from '../contentModel/decorator/ContentModelDecorator';
import type { ReadonlyContentModelDivider } from '../contentModel/block/ContentModelDivider';
import type { ReadonlyContentModelEntity } from '../contentModel/entity/ContentModelEntity';
import type { ReadonlyContentModelFormatContainer } from '../contentModel/blockGroup/ContentModelFormatContainer';
import type { ContentModelFormatMap } from '../contentModel/format/ContentModelFormatMap';
import type { ReadonlyContentModelGeneralBlock } from '../contentModel/blockGroup/ContentModelGeneralBlock';
import type { ReadonlyContentModelGeneralSegment } from '../contentModel/segment/ContentModelGeneralSegment';
import type { ReadonlyContentModelImage } from '../contentModel/segment/ContentModelImage';
import type { ReadonlyContentModelListItem } from '../contentModel/blockGroup/ContentModelListItem';
import type { ContentModelListItemFormat } from '../contentModel/format/ContentModelListItemFormat';
import type { ContentModelListItemLevelFormat } from '../contentModel/format/ContentModelListItemLevelFormat';
import type { ReadonlyContentModelParagraph } from '../contentModel/block/ContentModelParagraph';
import type { ReadonlyContentModelSegment } from '../contentModel/segment/ContentModelSegment';
import type { ReadonlyContentModelSegmentFormat } from '../contentModel/format/ContentModelSegmentFormat';
import type { ReadonlyContentModelTable } from '../contentModel/block/ContentModelTable';
import type { ReadonlyContentModelTableRow } from '../contentModel/block/ContentModelTableRow';
import type { ReadonlyContentModelText } from '../contentModel/segment/ContentModelText';
import type { FormatHandlerTypeMap, FormatKey } from '../contentModel/format/FormatHandlerTypeMap';
import type { ModelToDomContext } from './ModelToDomContext';
import type { ListMetadataFormat } from '../contentModel/format/metadata/ListMetadataFormat';
import type {
    ContentModelFormatBase,
    ReadonlyContentModelFormatBase,
} from '../contentModel/format/ContentModelFormatBase';
import type {
    ContentModelHandler,
    ContentModelBlockHandler,
    ContentModelSegmentHandler,
} from './ContentModelHandler';

/**
 * Default implicit format map from tag name (lower case) to segment format
 */
export type DefaultImplicitFormatMap = Record<
    string,
    ReadonlyContentModelSegmentFormat & ReadonlyContentModelBlockFormat
>;

/**
 * Apply format to the given HTML element
 * @param format The format object to apply
 * @param element The HTML element to apply format to
 * @param context The context object that provide related context information
 */
export type FormatApplier<TFormat extends ReadonlyContentModelFormatBase> = (
    format: TFormat,
    element: HTMLElement,
    context: ModelToDomContext
) => void;

/**
 * Apply format to the given text node
 * @param format The format object to apply
 * @param textNode The text node to apply format to
 * @param context The context object that provide related context information
 */
export type TextFormatApplier<
    TFormat extends ReadonlyContentModelSegmentFormat = ReadonlyContentModelSegmentFormat
> = (format: TFormat, textNode: Text, context: ModelToDomContext) => void;

/**
 * All format appliers
 */
export type FormatAppliers = {
    [Key in FormatKey]: FormatApplier<FormatHandlerTypeMap[Key]> | null;
};

/**
 * A map from format parser category name to an array of parsers. This is for HTMLElement only
 */
export type ElementFormatAppliersPerCategory = {
    [Key in keyof ContentModelFormatMap]: (FormatApplier<ContentModelFormatMap[Key]> | null)[];
};

/**
 * A map from format parser category name to an array of parsers
 */
export type FormatAppliersPerCategory = ElementFormatAppliersPerCategory & {
    text: TextFormatApplier[];
};

/**
 * Represents a map from content model handler name to its handle type
 */
export type ContentModelHandlerMap = {
    /**
     * Content Model type for ContentModelBlock
     */
    block: ContentModelBlockHandler<ReadonlyContentModelBlock>;

    /**
     * Content Model type for child models of ContentModelBlockGroup
     */
    blockGroupChildren: ContentModelHandler<ReadonlyContentModelBlockGroup>;

    /**
     * Content Model type for ContentModelBr
     */
    br: ContentModelSegmentHandler<ReadonlyContentModelBr>;

    /**
     * Content Model type for child models of ContentModelEntity
     */
    entityBlock: ContentModelBlockHandler<ReadonlyContentModelEntity>;

    /**
     * Content Model type for child models of ContentModelEntity
     */
    entitySegment: ContentModelSegmentHandler<ReadonlyContentModelEntity>;

    /**
     * Content Model type for ContentModelGeneralBlock
     */
    generalBlock: ContentModelBlockHandler<ReadonlyContentModelGeneralBlock>;

    /**
     * Content Model type for ContentModelGeneralBlock
     */
    generalSegment: ContentModelSegmentHandler<ReadonlyContentModelGeneralSegment>;

    /**
     * Content Model type for ContentModelHR
     */
    divider: ContentModelBlockHandler<ReadonlyContentModelDivider>;

    /**
     * Content Model type for ContentModelImage
     */
    image: ContentModelSegmentHandler<ReadonlyContentModelImage>;

    /**
     * Content Model type for list group of ContentModelListItem
     */
    list: ContentModelBlockHandler<ReadonlyContentModelListItem>;

    /**
     * Content Model type for list item of ContentModelListItem
     */
    listItem: ContentModelBlockHandler<ReadonlyContentModelListItem>;

    /**
     * Content Model type for ContentModelParagraph
     */
    paragraph: ContentModelBlockHandler<ReadonlyContentModelParagraph>;

    /**
     * Content Model type for ContentModelFormatContainer
     */
    formatContainer: ContentModelBlockHandler<ReadonlyContentModelFormatContainer>;

    /**
     * Content Model type for ContentModelSegment
     */
    segment: ContentModelSegmentHandler<ReadonlyContentModelSegment>;

    /**
     * Content Model type for ContentModelCode
     */
    segmentDecorator: ContentModelSegmentHandler<ReadonlyContentModelSegment>;

    /**
     * Content Model type for ContentModelTable
     */
    table: ContentModelBlockHandler<ReadonlyContentModelTable>;

    /**
     * Content Model type for ContentModelText
     */
    text: ContentModelSegmentHandler<ReadonlyContentModelText>;
};

/**
 * Function type to apply metadata value into format
 * @param metadata The metadata object to apply
 * @param format The format object to apply metadata to
 * @param context Content Model to DOM context
 */
export type ApplyMetadata<TMetadata, TFormat extends ContentModelFormatBase> = (
    metadata: TMetadata | null,
    format: TFormat,
    context: ModelToDomContext
) => void;

/**
 * Metadata applier interface
 */
export interface MetadataApplier<TMetadata, TFormat extends ContentModelFormatBase> {
    /**
     * The metadata applier function
     */
    applierFunction: ApplyMetadata<TMetadata, TFormat>;

    /**
     * @optional Metadata definition, used for validate the metadata object
     */
    metadataDefinition?: Definition<TMetadata>;
}

/**
 * Map of metadata handlers
 */
export type MetadataAppliers = {
    /**
     * Metadata handler for list item
     */
    listItem?: MetadataApplier<ListMetadataFormat, ContentModelListItemFormat>;

    /**
     * Metadata handler for list level
     */
    listLevel?: MetadataApplier<ListMetadataFormat, ContentModelListItemLevelFormat>;
};

/**
 * An optional callback that will be called when a DOM node is created
 * @param modelElement The related Content Model element
 * @param node The node created for this model element
 */
export type OnNodeCreated = (
    modelElement:
        | ReadonlyContentModelBlock
        | ReadonlyContentModelBlockGroup
        | ReadonlyContentModelSegment
        | ReadonlyContentModelDecorator
        | ReadonlyContentModelTableRow,
    node: Node
) => void;

/**
 * Represents settings to customize DOM to Content Model conversion
 */
export interface ModelToDomSettings {
    /**
     * Map of Content Model handlers
     */
    modelHandlers: ContentModelHandlerMap;

    /**
     * Map of format appliers
     */
    formatAppliers: FormatAppliersPerCategory;

    /**
     * Map of metadata appliers
     */
    metadataAppliers: MetadataAppliers;

    /**
     * Default Content Model to DOM handlers before overriding.
     * This provides a way to call original handler from an overridden handler function
     */
    defaultModelHandlers: Readonly<ContentModelHandlerMap>;

    /**
     * Default format parsers before overriding.
     * This provides a way to call original format applier from an overridden applier function
     */
    defaultFormatAppliers: Readonly<FormatAppliers>;

    /**
     * An optional callback that will be called when a DOM node is created
     * @param modelElement The related Content Model element
     * @param node The node created for this model element
     */
    onNodeCreated?: OnNodeCreated;
}
