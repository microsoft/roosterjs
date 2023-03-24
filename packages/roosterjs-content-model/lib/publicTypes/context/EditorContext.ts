import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import { DarkColorHandler } from 'roosterjs-editor-types';

/**
 * An editor context interface used by ContentModel PAI
 */
export interface EditorContext {
    /**
     * Whether current content is in dark mode
     */
    isDarkMode: boolean;

    /**
     * Default format of editor
     */
    defaultFormat?: ContentModelSegmentFormat;

    /**
     * Calculate color for dark mode
     * @param lightColor Light mode color
     * @returns Dark mode color calculated from lightColor
     */
    getDarkColor?: (lightColor: string) => string;

    /**
     * Dark model color handler
     */
    darkColorHandler?: DarkColorHandler | null;

    /**
     * Whether to handle delimiters in Content Model
     */
    addDelimiterForEntity?: boolean;
}
