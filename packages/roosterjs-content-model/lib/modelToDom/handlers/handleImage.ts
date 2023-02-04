import { applyFormat } from '../utils/applyFormat';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { parseValueWithUnit } from 'roosterjs-content-model/lib/formatHandlers/utils/parseValueWithUnit';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const handleImage: ContentModelHandler<ContentModelImage> = (
    doc: Document,
    parent: Node,
    imageModel: ContentModelImage,
    context: ModelToDomContext
) => {
    const img = doc.createElement('img');
    img.src = imageModel.src;

    if (imageModel.alt) {
        img.alt = imageModel.alt;
    }

    if (imageModel.title) {
        img.title = imageModel.title;
    }

    stackFormat(context, imageModel.link ? 'a' : null, () => {
        let segmentElement: HTMLElement;

        if (imageModel.link) {
            segmentElement = doc.createElement('a');

            parent.appendChild(segmentElement);
            segmentElement.appendChild(img);

            applyFormat(
                segmentElement,
                context.formatAppliers.link,
                imageModel.link.format,
                context
            );
            applyFormat(
                segmentElement,
                context.formatAppliers.dataset,
                imageModel.link.dataset,
                context
            );
        } else {
            segmentElement = img;
            parent.appendChild(img);
        }

        applyFormat(img, context.formatAppliers.image, imageModel.format, context);
        applyFormat(segmentElement, context.formatAppliers.segment, imageModel.format, context);
        applyFormat(img, context.formatAppliers.dataset, imageModel.dataset, context);

        const { width, height } = imageModel.format;
        const widthNum = width ? parseValueWithUnit(width) : 0;
        const heightNum = height ? parseFloat(height) : 0;

        if (widthNum > 0) {
            img.width = widthNum;
        }

        if (heightNum > 0) {
            img.height = heightNum;
        }
    });

    context.regularSelection.current.segment = img;

    if (imageModel.isSelectedAsImageSelection) {
        context.imageSelection = {
            image: img,
        };
    }
};
