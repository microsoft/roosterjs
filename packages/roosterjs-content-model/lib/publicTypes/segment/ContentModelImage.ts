import { ContentModelImageFormat } from '../format/ContentModelImageFormat';
import { ContentModelSegmentBase } from './ContentModelSegmentBase';

/**
 * Content Model of IMG
 */
export interface ContentModelImage
    extends ContentModelSegmentBase<'Image', ContentModelImageFormat> {
    /**
     * Image source of this IMG element
     */
    src: string;

    /**
     * Alt text of image
     */
    alt?: string;

    /**
     * Title text of image
     */
    title?: string;

    /**
     * Whether this image is selected as image selection (show a border around the image)
     */
    isSelectedAsImageSelection?: boolean;
}
