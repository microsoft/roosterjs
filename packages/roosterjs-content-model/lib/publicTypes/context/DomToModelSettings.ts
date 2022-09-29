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

/**
 * Represents settings to customize DOM to Content Model conversion
 */
export interface DomToModelSettings {
    /**
     * Map of element processors
     */
    elementProcessors: Record<string, ElementProcessor>;

    /**
     * Map of default styles
     */
    defaultStyles: DefaultStyleMap;

    /**
     * Map of format parsers
     */
    formatParsers: FormatParsers;
}
