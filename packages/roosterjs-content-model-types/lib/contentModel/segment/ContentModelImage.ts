import type { ContentModelImageFormat } from '../format/ContentModelImageFormat';
import type { ContentModelSegmentBase } from './ContentModelSegmentBase';
import type { ContentModelWithDataset } from '../format/ContentModelWithDataset';
import type { ImageMetadataFormat } from '../format/metadata/ImageMetadataFormat';

/**
 * Content Model of IMG
 */
export interface ContentModelImage
    extends ContentModelSegmentBase<'Image', ContentModelImageFormat>,
        ContentModelWithDataset<ImageMetadataFormat> {
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
