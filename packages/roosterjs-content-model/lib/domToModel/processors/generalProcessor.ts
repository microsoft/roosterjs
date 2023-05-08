import { addBlock } from '../../modelApi/common/addBlock';
import { addDecorators } from '../../modelApi/common/addDecorators';
import { addSegment } from '../../modelApi/common/addSegment';
import { createGeneralBlock } from '../../modelApi/creators/createGeneralBlock';
import { createGeneralSegment } from '../../modelApi/creators/createGeneralSegment';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { isBlockElement } from '../utils/isBlockElement';
import { stackFormat } from '../utils/stackFormat';

const generalBlockProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const block = createGeneralBlock(element);
    const isSelectedBefore = context.isInSelection;

    stackFormat(
        context,
        {
            segment: 'empty',
            paragraph: 'empty',
            link: 'empty',
        },
        () => {
            addBlock(group, block);

            context.elementProcessors.child(block, element, context);
        }
    );

    if (isSelectedBefore && context.isInSelection) {
        block.isSelected = true;
    }
};

const generalSegmentProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const segment = createGeneralSegment(element, context.segmentFormat);
    const isSelectedBefore = context.isInSelection;

    addDecorators(segment, context);
    addSegment(group, segment);

    stackFormat(
        context,
        {
            segment:
                'empty' /*clearFormat, General segment will include all properties and styles when generate back to HTML, so no need to carry over existing segment format*/,
        },
        () => {
            context.elementProcessors.child(segment, element, context);
        }
    );

    if (isSelectedBefore && context.isInSelection) {
        segment.isSelected = true;
    }
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
