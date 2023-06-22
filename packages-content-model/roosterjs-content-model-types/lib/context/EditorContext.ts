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
}
