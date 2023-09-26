import { applyFormat } from '../utils/applyFormat';
import { ContentModelImage, ContentModelSegmentHandler } from 'roosterjs-content-model-types';
import { handleSegmentCommon } from '../utils/handleSegmentCommon';
import { parseValueWithUnit } from '../../formatHandlers/utils/parseValueWithUnit';

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

    const { width, height } = imageModel.format;
    const widthNum = width ? parseValueWithUnit(width) : 0;
    const heightNum = height ? parseValueWithUnit(height) : 0;

    if (widthNum > 0) {
        img.width = widthNum;
    }

    if (heightNum > 0) {
        img.height = heightNum;
    }

    if (imageModel.isSelectedAsImageSelection) {
        context.imageSelection = {
            type: 'image',
            image: img,
        };
    }

    handleSegmentCommon(doc, img, element, imageModel, context, segmentNodes);
};
