import ImageFormat from './ImageFormat';
import { FormatState } from 'roosterjs-editor-types';

/**
 * The format object state in Content Model
 */
export interface ContentModelFormatState extends FormatState {
    /**
     * Format of image, if there is table at cursor position
     */
    imageFormat?: ImageFormat;
}
