import { addDecorators } from '../../modelApi/common/addDecorators';
import { addSegment } from '../../modelApi/common/addSegment';
import { createImage } from '../../modelApi/creators/createImage';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';
import type { ContentModelImageFormat, ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const imageProcessor: ElementProcessor<HTMLImageElement> = (group, element, context) => {
    stackFormat(context, { segment: 'shallowClone' }, () => {
        const imageFormat: ContentModelImageFormat = context.segmentFormat;

        parseFormat(element, context.formatParsers.segment, imageFormat, context);
        parseFormat(element, context.formatParsers.image, imageFormat, context);
        parseFormat(element, context.formatParsers.block, context.blockFormat, context);

        const image = createImage(element.src, imageFormat);
        const alt = element.alt;
        const title = element.title;

        parseFormat(element, context.formatParsers.dataset, image.dataset, context);
        addDecorators(image, context);

        if (alt) {
            image.alt = alt;
        }
        if (title) {
            image.title = title;
        }
        if (context.isInSelection) {
            image.isSelected = true;
        }
        if (context.selection?.type == 'image' && context.selection.image == element) {
            image.isSelectedAsImageSelection = true;
            image.isSelected = true;
        }

        const paragraph = addSegment(group, image);
        context.domIndexer?.onSegment(element, paragraph, [image]);
    });
};
