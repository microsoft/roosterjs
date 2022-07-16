import { addSegment } from '../utils/addSegment';
import { containerProcessor } from './containerProcessor';
import { createGeneralSegment } from '../creators/createGeneralSegment';
import { ElementProcessor } from './ElementProcessor';

/**
 * @internal
 */
export const generalSegmentProcessor: ElementProcessor = (group, element) => {
    const segment = createGeneralSegment(element);

    addSegment(group, segment);
    containerProcessor(segment, element);
};
