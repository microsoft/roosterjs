import { ContentModelSegmentBase } from './ContentModelSegmentBase';

/**
 * Content Model of IMG
 */
export interface ContentModelImage extends ContentModelSegmentBase<'Image'> {
    /**
     * Image source of this IMG element
     */
    src: string;

    /**
     * Alt text of image
     */
    alt?: string;

    /**
     * Whether this image is selected as image selection (show a border around the image)
     */
    isSelectedAsImageSelection?: boolean;
}
