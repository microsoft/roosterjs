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
     * Zoom scale of the content
     */
    zoomScale: number;

    /**
     * Whether current content is from right to left
     */
    isRightToLeft: boolean;

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
}
