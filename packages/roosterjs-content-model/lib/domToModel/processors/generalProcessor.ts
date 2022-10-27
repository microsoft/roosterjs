import { addBlock } from '../../modelApi/common/addBlock';
import { addSegment } from '../../modelApi/common/addSegment';
import { createGeneralBlock } from '../../modelApi/creators/createGeneralBlock';
import { createGeneralSegment } from '../../modelApi/creators/createGeneralSegment';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { isBlockElement } from '../utils/isBlockElement';
import { stackFormat } from '../utils/stackFormat';

const generalBlockProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const block = createGeneralBlock(element);

    stackFormat(
        context,
        {
            segment: 'empty',
            paragraph: 'empty',
        },
        () => {
            addBlock(group, block);
            context.elementProcessors.child(block, element, context);
        }
    );
};

const generalSegmentProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const segment = createGeneralSegment(element, context.segmentFormat);

    if (context.isInSelection && !element.firstChild) {
        segment.isSelected = true;
    }

    stackFormat(
        context,
        {
            segment:
                'empty' /*clearFormat, General segment will include all properties and styles when generate back to HTML, so no need to carry over existing segment format*/,
        },
        () => {
            addSegment(group, segment);
            context.elementProcessors.child(segment, element, context);
        }
    );
};

/**
 * @internal
 */
export const generalProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const processor = isBlockElement(element, context)
        ? generalBlockProcessor
        : generalSegmentProcessor;

    processor(group, element, context);
};
