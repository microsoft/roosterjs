import { ElementProcessor } from './ElementProcessor';

/**
 * A type of Default style map, from tag name string (in upper case) to a static style object
 */
export type DefaultStyleMap = Record<string, Partial<CSSStyleDeclaration>>;

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
}
