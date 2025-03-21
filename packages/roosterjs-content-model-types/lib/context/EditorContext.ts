import type { IdGenerator } from '../parameter/IdGenerator';
import type { DarkColorHandler } from './DarkColorHandler';
import type { DomIndexer } from './DomIndexer';
import type { ContentModelSegmentFormat } from '../contentModel/format/ContentModelSegmentFormat';
import type { PendingFormat } from '../pluginState/FormatPluginState';

/**
 * An editor context interface used by ContentModel PAI
 */
export interface EditorContext {
    /**
     * Whether current content is in dark mode
     */
    isDarkMode?: boolean;

    /**
     * Default format of editor
     */
    defaultFormat?: ContentModelSegmentFormat;

    /**
     * Pending format if any
     */
    pendingFormat?: PendingFormat;

    /**
     * Color manager, to help manager color in dark mode
     */
    darkColorHandler?: DarkColorHandler;

    /**
     * Whether to handle delimiters in Content Model
     */
    addDelimiterForEntity?: boolean;

    /**
     * Zoom scale number
     */
    zoomScale?: number;

    /**
     * Whether the content is in Right-to-left from root level
     */
    isRootRtl?: boolean;

    /**
     * Whether put the source element into Content Model when possible.
     * When pass true, this cached element will be used to create DOM tree back when convert Content Model to DOM
     */
    allowCacheElement?: boolean;

    /**
     * @optional Indexer for content model, to help build backward relationship from DOM node to Content Model
     */
    domIndexer?: DomIndexer;

    /**
     * Root Font size in Px.
     */
    rootFontSize?: number;

    /**
     * Enabled experimental features
     */
    experimentalFeatures?: ReadonlyArray<string>;

    /**
     * Id generator for paragraph
     */
    paragraphIdGenerator?: IdGenerator;
}
