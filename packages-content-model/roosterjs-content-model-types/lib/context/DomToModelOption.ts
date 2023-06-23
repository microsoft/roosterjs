import {
    DefaultStyleMap,
    ElementProcessorMap,
    FormatParsers,
    FormatParsersPerCategory,
} from './DomToModelSettings';
import { SelectionRangeEx } from 'roosterjs-editor-types';

/**
 * Options for creating DomToModelContext
 */
export interface DomToModelOption {
    /**
     * True to create content model from the root element itself, false to create from all child nodes of root. @default false
     */
    includeRoot?: boolean;

    /**
     * Selection range to be included in Content Model
     */
    selectionRange?: SelectionRangeEx;

    /**
     * Overrides default element processors
     */
    processorOverride?: Partial<ElementProcessorMap>;

    /**
     * Overrides default element styles
     */
    defaultStyleOverride?: DefaultStyleMap;

    /**
     * Overrides default format handlers
     */
    formatParserOverride?: Partial<FormatParsers>;

    /**
     * Provide additional format parsers for each format type
     */
    additionalFormatParsers?: Partial<FormatParsersPerCategory>;

    /**
     * Whether put the source element into Content Model when possible.
     * When pass true, this cached element will be used to create DOM tree back when convert Content Model to DOM
     */
    disableCacheElement?: boolean;
}
