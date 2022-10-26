import { ContentModelHandlerMap, FormatAppliers } from './ModelToDomSettings';
import { ElementProcessorMap, FormatParsers } from './DomToModelSettings';

/**
 * Default settings for content model
 */
export interface ContentModelDefaultSettings {
    /**
     * Default DOM to Content Model processors
     */
    domToContentModelProcessors: Readonly<ElementProcessorMap>;

    /**
     * Default Content Model to DOM handlers
     */
    contentModelToDomHandlers: Readonly<ContentModelHandlerMap>;

    /**
     * Default format parsers
     */
    formatParsers: Readonly<FormatParsers>;

    /**
     * Default format appliers
     */
    formatAppliers: Readonly<FormatAppliers>;
}

/**
 * An editor context interface used by ContentModel PAI
 */
export interface EditorContext {
    /**
     * Whether current content is in dark mode
     */
    isDarkMode: boolean;

    /**
     * Zoom scale of the content
     */
    zoomScale: number;

    /**
     * Whether current content is from right to left
     */
    isRightToLeft: boolean;

    /**
     * Default settings for content model
     */
    defaultSettings: Readonly<ContentModelDefaultSettings>;

    /**
     * Calculate color for dark mode
     * @param lightColor Light mode color
     * @returns Dark mode color calculated from lightColor
     */
    getDarkColor?: (lightColor: string) => string;
}
