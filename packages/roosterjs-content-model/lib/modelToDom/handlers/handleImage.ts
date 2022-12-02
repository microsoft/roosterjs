import { applyFormat } from '../utils/applyFormat';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
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
    });

    context.regularSelection.current.segment = img;

    if (imageModel.isSelectedAsImageSelection) {
        context.imageSelection = {
            image: img,
        };
    }
};
