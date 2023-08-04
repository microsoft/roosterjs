import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import { DarkColorHandler } from 'roosterjs-editor-types';

/**
 * An editor context interface used by ContentModel PAI
 */
export interface EditorContext {
    /**
     * Default format of editor
     */
    defaultFormat?: ContentModelSegmentFormat;

    /**
     * Dark model color handler
     */
    darkColorHandler?: DarkColorHandler | null;

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
}
