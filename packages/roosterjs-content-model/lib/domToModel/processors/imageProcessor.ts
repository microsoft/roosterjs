import { addDecorators } from '../../modelApi/common/addDecorators';
import { addSegment } from '../../modelApi/common/addSegment';
import { ContentModelImageFormat } from '../../publicTypes/format/ContentModelImageFormat';
import { createImage } from '../../modelApi/creators/createImage';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';

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
        if (context.imageSelection?.image == element) {
            image.isSelectedAsImageSelection = true;
            image.isSelected = true;
        }

        addSegment(group, image);
    });
};
