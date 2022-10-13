import { ContentModelFormatBase } from '../format/ContentModelFormatBase';
import { DomToModelContext } from './DomToModelContext';
import { ElementProcessor } from './ElementProcessor';
import { FormatHandlerTypeMap, FormatKey } from '../format/FormatHandlerTypeMap';

/**
 * A type of Default style map, from tag name string (in upper case) to a static style object
 */
export type DefaultStyleMap = Record<string, Partial<CSSStyleDeclaration>>;

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
        child: ElementProcessor<HTMLElement>;

        /**
         * Workaround for typescript 4.4.4 that doesn't have element "strike" in its element type
         */
        strike?: ElementProcessor<HTMLElement>;
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
    formatParsers: FormatParsers;

    /**
     * Original map of element processors
     */
    readonly originalElementProcessors: Readonly<ElementProcessorMap>;

    /**
     * Original map of default styles
     */
    readonly originalDefaultStyles: Readonly<DefaultStyleMap>;

    /**
     * Original map of format parsers
     */
    readonly originalFormatParsers: Readonly<FormatParsers>;
}
