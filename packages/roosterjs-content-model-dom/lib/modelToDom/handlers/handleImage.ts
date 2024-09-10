import { applyFormat } from '../utils/applyFormat';
import { handleSegmentCommon } from '../utils/handleSegmentCommon';
import type { ContentModelImage, ContentModelSegmentHandler } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleImage: ContentModelSegmentHandler<ContentModelImage> = (
    doc,
    parent,
    imageModel,
    context,
    segmentNodes
) => {
    const img = doc.createElement('img');
    const element = document.createElement('span');

    parent.appendChild(element);
    element.appendChild(img);

    img.src = imageModel.src;

    if (imageModel.alt) {
        img.alt = imageModel.alt;
    }

    if (imageModel.title) {
        img.title = imageModel.title;
    }

    applyFormat(img, context.formatAppliers.image, imageModel.format, context);
    applyFormat(img, context.formatAppliers.dataset, imageModel.dataset, context);

    const { width, height, widthAttr, heightAttr } = imageModel.format;

    if (width) {
        img.style.width = width;
    }

    if (height) {
        img.style.height = height;
    }

    if (widthAttr) {
        img.width = parseInt(widthAttr);
    }

    if (heightAttr) {
        img.height = parseInt(heightAttr);
    }

    if (imageModel.isSelectedAsImageSelection) {
        context.imageSelection = {
            type: 'image',
            image: img,
        };
    }

    handleSegmentCommon(doc, img, element, imageModel, context, segmentNodes);
};
