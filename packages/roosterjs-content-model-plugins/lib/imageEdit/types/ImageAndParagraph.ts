import type {
    ReadonlyContentModelImage,
    ReadonlyContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export interface ImageAndParagraph {
    image: ReadonlyContentModelImage;
    paragraph: ReadonlyContentModelParagraph;
}
