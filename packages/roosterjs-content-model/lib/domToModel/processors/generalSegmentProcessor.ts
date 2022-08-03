import { addSegment } from '../../modelApi/common/addSegment';
import { containerProcessor } from './containerProcessor';
import { createGeneralSegment } from '../../modelApi/creators/createGeneralSegment';
import { ElementProcessor } from './ElementProcessor';

/**
 * @internal
 */
export const generalSegmentProcessor: ElementProcessor = (group, element, context) => {
    const segment = createGeneralSegment(element);

    if (context.isInSelection) {
        segment.isSelected = true;
    }

    addSegment(group, segment);
    containerProcessor(segment, element, context);
};
