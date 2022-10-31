import { applyFormat } from '../utils/applyFormat';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

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

    let segmentElement: HTMLElement;

    if (imageModel.link) {
        segmentElement = doc.createElement('a');

        parent.appendChild(segmentElement);
        segmentElement.appendChild(img);

        applyFormat(segmentElement, context.formatAppliers.hyperLink, imageModel.link, context);
    } else {
        segmentElement = img;
        parent.appendChild(img);
    }

    applyFormat(img, context.formatAppliers.image, imageModel.format, context);
    applyFormat(segmentElement, context.formatAppliers.segment, imageModel.format, context);

    context.regularSelection.current.segment = img;

    if (imageModel.isSelectedAsImageSelection) {
        context.imageSelection = {
            image: img,
        };
    }
};
