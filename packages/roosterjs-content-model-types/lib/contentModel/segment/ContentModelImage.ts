import type {
    ContentModelImageFormat,
    ReadonlyContentModelImageFormat,
} from '../format/ContentModelImageFormat';
import type {
    ContentModelSegmentBase,
    ReadonlyContentModelSegmentBase,
} from './ContentModelSegmentBase';
import type {
    ContentModelWithDataset,
    ReadonlyContentModelWithDataset,
} from '../format/ContentModelWithDataset';
import type { ImageMetadataFormat } from '../format/metadata/ImageMetadataFormat';

/**
 * Common part of Content Model of IMG
 */
export interface ContentModelImageCommon {
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

/**
 * Content Model of IMG
 */
export interface ContentModelImage
    extends ContentModelImageCommon,
        ContentModelSegmentBase<'Image', ContentModelImageFormat>,
        ContentModelWithDataset<ImageMetadataFormat> {}

/**
 * Content Model of IMG (Readonly)
 */
export interface ReadonlyContentModelImage
    extends ReadonlyContentModelSegmentBase<'Image', ReadonlyContentModelImageFormat>,
        ReadonlyContentModelWithDataset<ImageMetadataFormat>,
        Readonly<ContentModelImageCommon> {}
