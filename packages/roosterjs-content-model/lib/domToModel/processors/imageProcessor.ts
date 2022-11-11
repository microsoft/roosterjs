import { addBlock } from '../../modelApi/common/addBlock';
import { addLink } from '../../modelApi/common/addLink';
import { addSegment } from '../../modelApi/common/addSegment';
import { ContentModelImageFormat } from '../../publicTypes/format/ContentModelImageFormat';
import { createImage } from '../../modelApi/creators/createImage';
import { createParagraph } from '../../modelApi/creators/createParagraph';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { isBlockElement } from '../utils/isBlockElement';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const imageProcessor: ElementProcessor<HTMLImageElement> = (group, element, context) => {
    const isBlock = isBlockElement(element, context);

    stackFormat(
        context,
        {
            segment: 'shallowClone',
            paragraph: isBlock ? 'empty' : 'shallowClone',
        },
        () => {
            const imageFormat: ContentModelImageFormat = context.segmentFormat;

            parseFormat(element, context.formatParsers.segment, imageFormat, context);
            parseFormat(element, context.formatParsers.image, imageFormat, context);
            parseFormat(element, context.formatParsers.block, context.blockFormat, context);

            const image = createImage(element.src, imageFormat);
            const alt = element.alt;
            const title = element.title;

            parseFormat(element, context.formatParsers.dataset, image.dataset, context);
            addLink(image, context.link);

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

            if (isBlock) {
                addBlock(group, createParagraph(false /*isImplicit*/, context.blockFormat));
            }

            addSegment(group, image);
        }
    );

    if (isBlock) {
        addBlock(group, createParagraph(true /*isImplicit*/, context.blockFormat));
    }
};
