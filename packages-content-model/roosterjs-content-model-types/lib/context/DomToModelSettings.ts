import { ContentModelFormatBase } from '../format/ContentModelFormatBase';
import { ContentModelFormatMap } from '../format/ContentModelFormatMap';
import { DomToModelContext } from './DomToModelContext';
import { ElementProcessor } from './ElementProcessor';
import { FormatHandlerTypeMap, FormatKey } from '../format/FormatHandlerTypeMap';

/**
 * A type of Default style map, from tag name string (in upper case) to a static style object
 */
export type DefaultStyleMap = {
    [key in keyof HTMLElementDeprecatedTagNameMap]?: Readonly<Partial<CSSStyleDeclaration>>;
} &
    {
        [key in keyof HTMLElementTagNameMap]?: Readonly<Partial<CSSStyleDeclaration>>;
    } & {
        // Workaround typescript 4.4.4 which does not have these elements in its declaration file
        center?: Partial<CSSStyleDeclaration>;
        strike?: Partial<CSSStyleDeclaration>;
    };

/**
 * Parse format from the given HTML element and default style
 * @param format The format object to parse into
 * @param element The HTML element to parse format from
 * @param context The context object that provide related context information
 * @param defaultStyle Default CSS style of the given HTML element
 */
export type FormatParser<TFormat extends ContentModelFormatBase> = (
    format: TFormat,
    element: HTMLElement,
    context: DomToModelContext,
    defaultStyle: Readonly<Partial<CSSStyleDeclaration>>
) => void;

/**
 * All format parsers
 */
export type FormatParsers = {
    [Key in FormatKey]: FormatParser<FormatHandlerTypeMap[Key]> | null;
};

/**
 * A map from format parser category name to an array of parsers
 */
export type FormatParsersPerCategory = {
    [Key in keyof ContentModelFormatMap]: (FormatParser<ContentModelFormatMap[Key]> | null)[];
};

/**
 * A map from element processor name to its processor type
 */
export type ElementProcessorMap = {
    [key in keyof HTMLElementDeprecatedTagNameMap]?: ElementProcessor<
        HTMLElementDeprecatedTagNameMap[key]
    >;
} &
    {
        [key in keyof HTMLElementTagNameMap]?: ElementProcessor<HTMLElementTagNameMap[key]>;
    } & {
        /**
         * Processors for all other HTML elements
         */
        '*': ElementProcessor<HTMLElement>;

        /**
         * Processor for text node
         */
        '#text': ElementProcessor<Text>;

        /**
         * Processor for entity
         */
        entity: ElementProcessor<HTMLElement>;

        /**
         * Common processor dispatch for all elements
         */
        element: ElementProcessor<HTMLElement>;

        /**
         * Common processor for child nodes of a given element
         */
        child: ElementProcessor<ParentNode>;

        /**
         * Workaround for typescript 4.4.4 that doesn't have element "strike" in its element type
         */
        strike?: ElementProcessor<HTMLElement>;

        /**
         * Workaround for typescript 4.4.4 that doesn't have element "center" in its element type
         */
        center?: ElementProcessor<HTMLElement>;

        /**
         * Processor for Inline Readonly Delimiters
         */
        delimiter?: ElementProcessor<HTMLSpanElement>;
    };

/**
 * Represents settings to customize DOM to Content Model conversion
 */
export interface DomToModelSettings {
    /**
     * Map of element processors
     */
    elementProcessors: ElementProcessorMap;

    /**
     * Map of default styles
     */
    defaultStyles: DefaultStyleMap;

    /**
     * Map of format parsers
     */
    formatParsers: FormatParsersPerCategory;

    /**
     * Default DOM to Content Model processors before overriding.
     * This provides a way to call original processor from an overridden processor function
     */
    defaultElementProcessors: Readonly<ElementProcessorMap>;

    /**
     * Default format parsers before overriding.
     * This provides a way to call original format parser from an overridden parser function
     */
    defaultFormatParsers: Readonly<FormatParsers>;
}
