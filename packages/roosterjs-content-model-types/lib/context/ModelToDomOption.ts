import type { ContentModelBlockFormat } from '../contentModel/format/ContentModelBlockFormat';
import type { ContentModelSegmentFormat } from '../contentModel/format/ContentModelSegmentFormat';
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

    /**
     * Overrides the default content model formats for specific HTML tags.
     * 
     * This property allows you to specify custom formats for both segment and block-level
     * content models for specific tags. The key is the tag name (e.g., 'div', 'span'),
     * and the value is an object containing both segment and block format overrides.
     * 
     * Example:
     * ```
     * defaultContentModelFormatOverride: {
     *     div: {
     *         fontSize: '16px',
     *         textAlign: 'center',
     *         backgroundColor: 'lightblue',
     *     },
     *     span: {
     *         fontWeight: 'bold',
     *         color: 'red',
     *     },
     * }
     * ```
     */
    defaultContentModelFormatOverride?: {
        [tagName: string]: ContentModelSegmentFormat & ContentModelBlockFormat;
    };
}
