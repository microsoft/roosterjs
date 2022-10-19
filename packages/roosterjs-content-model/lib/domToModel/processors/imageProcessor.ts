import { addSegment } from '../../modelApi/common/addSegment';
import { createImage } from '../../modelApi/creators/createImage';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const imageProcessor: ElementProcessor<HTMLImageElement> = (group, element, context) => {
    stackFormat(context, { segment: 'shallowClone' }, () => {
        parseFormat(element, context.formatParsers.segment, context.segmentFormat, context);

        const image = createImage(element.src, context.segmentFormat);
        const alt = element.alt || element.title;

        if (alt) {
            image.alt = alt;
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
