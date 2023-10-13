import type { ContentModelBlock } from '../block/ContentModelBlock';
import type { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import type { ContentModelBlockGroup } from '../group/ContentModelBlockGroup';
import type { ContentModelBr } from '../segment/ContentModelBr';
import type { ContentModelDecorator } from '../decorator/ContentModelDecorator';
import type { ContentModelDivider } from '../block/ContentModelDivider';
import type { ContentModelEntity } from '../entity/ContentModelEntity';
import type { ContentModelFormatBase } from '../format/ContentModelFormatBase';
import type { ContentModelFormatContainer } from '../group/ContentModelFormatContainer';
import type { ContentModelFormatMap } from '../format/ContentModelFormatMap';
import type { ContentModelGeneralBlock } from '../group/ContentModelGeneralBlock';
import type { ContentModelGeneralSegment } from '../segment/ContentModelGeneralSegment';
import type { ContentModelImage } from '../segment/ContentModelImage';
import type { ContentModelListItem } from '../group/ContentModelListItem';
import type { ContentModelParagraph } from '../block/ContentModelParagraph';
import type { ContentModelSegment } from '../segment/ContentModelSegment';
import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import type { ContentModelTable } from '../block/ContentModelTable';
import type { ContentModelTableRow } from '../block/ContentModelTableRow';
import type { ContentModelText } from '../segment/ContentModelText';
import type { FormatHandlerTypeMap, FormatKey } from '../format/FormatHandlerTypeMap';
import type { ModelToDomContext } from './ModelToDomContext';
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
    Readonly<ContentModelSegmentFormat & ContentModelBlockFormat>
>;

/**
 * Apply format to the given HTML element
 * @param format The format object to apply
 * @param element The HTML element to apply format to
 * @param context The context object that provide related context information
 */
export type FormatApplier<TFormat extends ContentModelFormatBase> = (
    format: TFormat,
    element: HTMLElement,
    context: ModelToDomContext
) => void;

/**
 * All format appliers
 */
export type FormatAppliers = {
    [Key in FormatKey]: FormatApplier<FormatHandlerTypeMap[Key]> | null;
};

/**
 * A map from format parser category name to an array of parsers
 */
export type FormatAppliersPerCategory = {
    [Key in keyof ContentModelFormatMap]: (FormatApplier<ContentModelFormatMap[Key]> | null)[];
};

/**
 * Represents a map from content model handler name to its handle type
 */
export type ContentModelHandlerMap = {
    /**
     * Content Model type for ContentModelBlock
     */
    block: ContentModelBlockHandler<ContentModelBlock>;

    /**
     * Content Model type for child models of ContentModelBlockGroup
     */
    blockGroupChildren: ContentModelHandler<ContentModelBlockGroup>;

    /**
     * Content Model type for ContentModelBr
     */
    br: ContentModelSegmentHandler<ContentModelBr>;

    /**
     * Content Model type for child models of ContentModelEntity
     */
    entityBlock: ContentModelBlockHandler<ContentModelEntity>;

    /**
     * Content Model type for child models of ContentModelEntity
     */
    entitySegment: ContentModelSegmentHandler<ContentModelEntity>;

    /**
     * Content Model type for ContentModelGeneralBlock
     */
    generalBlock: ContentModelBlockHandler<ContentModelGeneralBlock>;

    /**
     * Content Model type for ContentModelGeneralBlock
     */
    generalSegment: ContentModelSegmentHandler<ContentModelGeneralSegment>;

    /**
     * Content Model type for ContentModelHR
     */
    divider: ContentModelBlockHandler<ContentModelDivider>;

    /**
     * Content Model type for ContentModelImage
     */
    image: ContentModelSegmentHandler<ContentModelImage>;

    /**
     * Content Model type for list group of ContentModelListItem
     */
    list: ContentModelBlockHandler<ContentModelListItem>;

    /**
     * Content Model type for list item of ContentModelListItem
     */
    listItem: ContentModelBlockHandler<ContentModelListItem>;

    /**
     * Content Model type for ContentModelParagraph
     */
    paragraph: ContentModelBlockHandler<ContentModelParagraph>;

    /**
     * Content Model type for ContentModelFormatContainer
     */
    formatContainer: ContentModelBlockHandler<ContentModelFormatContainer>;

    /**
     * Content Model type for ContentModelSegment
     */
    segment: ContentModelSegmentHandler<ContentModelSegment>;

    /**
     * Content Model type for ContentModelCode
     */
    segmentDecorator: ContentModelSegmentHandler<ContentModelSegment>;

    /**
     * Content Model type for ContentModelTable
     */
    table: ContentModelBlockHandler<ContentModelTable>;

    /**
     * Content Model type for ContentModelText
     */
    text: ContentModelSegmentHandler<ContentModelText>;
};

/**
 * An optional callback that will be called when a DOM node is created
 * @param modelElement The related Content Model element
 * @param node The node created for this model element
 */
export type OnNodeCreated = (
    modelElement:
        | ContentModelBlock
        | ContentModelBlockGroup
        | ContentModelSegment
        | ContentModelDecorator
        | ContentModelTableRow,
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
