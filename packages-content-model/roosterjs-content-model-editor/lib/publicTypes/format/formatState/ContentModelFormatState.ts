import type { FormatState } from 'roosterjs-editor-types';
import type { ImageFormatState } from './ImageFormatState';

/**
 * The format object state in Content Model
 */
export interface ContentModelFormatState extends FormatState {
    /**
     * Format of image, if there is table at cursor position
     */
    imageFormat?: ImageFormatState;

    /**
     * Letter spacing
     */
    letterSpacing?: string;
}
