import type {
    ContentModelHandlerMap,
    FormatAppliers,
    FormatAppliersPerCategory,
    MetadataAppliers,
} from './ModelToDomSettings';

/**
 * Options for creating ModelToDomContext
 */
export interface ModelToDomOption {
    /**
     * Overrides default format appliers
     */
    formatApplierOverride?: Partial<FormatAppliers>;

    /**
     * Provide additional format appliers for each format type
     */
    additionalFormatAppliers?: Partial<FormatAppliersPerCategory>;

    /**
     * Overrides default model handlers
     */
    modelHandlerOverride?: Partial<ContentModelHandlerMap>;

    /**
     * Overrides default metadata appliers
     */
    metadataAppliers?: Partial<MetadataAppliers>;

    /**
     * When set to true, selection from content model will not be applied
     */
    ignoreSelection?: boolean;
}
