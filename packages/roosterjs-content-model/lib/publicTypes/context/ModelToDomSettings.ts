import { ContentModelBlock } from '../block/ContentModelBlock';
import { ContentModelBlockGroup } from '../block/group/ContentModelBlockGroup';
import { ContentModelEntity } from '../entity/ContentModelEntity';
import { ContentModelFormatBase } from '../format/ContentModelFormatBase';
import { ContentModelFormatMap } from '../format/ContentModelFormatMap';
import { ContentModelHandler } from './ContentModelHandler';
import { ContentModelListItem } from '../block/group/ContentModelListItem';
import { ContentModelParagraph } from '../block/ContentModelParagraph';
import { ContentModelQuote } from '../block/group/ContentModelQuote';
import { ContentModelSegment } from '../segment/ContentModelSegment';
import { ContentModelTable } from '../block/ContentModelTable';
import { FormatHandlerTypeMap, FormatKey } from '../format/FormatHandlerTypeMap';
import { ModelToDomContext } from './ModelToDomContext';

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
 * Represents a map from content model handler name to its model type
 */
export interface ContentModelHandlerTypeMap {
    /**
     * Content Model type for ContentModelBlock
     */
    block: ContentModelBlock;

    /**
     * Content Model type for ContentModelBlockGroup
     */
    blockGroup: ContentModelBlockGroup;

    /**
     * Content Model type for child models of ContentModelBlockGroup
     */
    blockGroupChildren: ContentModelBlockGroup;

    /**
     * Content Model type for child models of ContentModelEntity
     */
    entity: ContentModelEntity;

    /**
     * Content Model type for list group of ContentModelListItem
     */
    list: ContentModelListItem;

    /**
     * Content Model type for list item of ContentModelListItem
     */
    listItem: ContentModelListItem;

    /**
     * Content Model type for ContentModelParagraph
     */
    paragraph: ContentModelParagraph;

    /**
     * Content Model type for ContentModelQuote
     */
    quote: ContentModelQuote;

    /**
     * Content Model type for ContentModelSegment
     */
    segment: ContentModelSegment;

    /**
     * Content Model type for ContentModelTable
     */
    table: ContentModelTable;
}

/**
 * Represents a map from content model handler name to its handle type
 */
export type ContentModelHandlerMap = {
    [key in keyof ContentModelHandlerTypeMap]: ContentModelHandler<ContentModelHandlerTypeMap[key]>;
};

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
}
