import { addSegment } from '../../modelApi/common/addSegment';
import { containerProcessor } from './containerProcessor';
import { createGeneralSegment } from '../../modelApi/creators/createGeneralSegment';
import { ElementProcessor } from './ElementProcessor';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const generalSegmentProcessor: ElementProcessor = (group, element, context) => {
    const segment = createGeneralSegment(element, context.segmentFormat);

    if (context.isInSelection) {
        segment.isSelected = true;
    }

    stackFormat(
        context,
        {
            segment:
                'clear' /*clearFormat, General segment will include all properties and styles when generate back to HTML, so no need to carry over existing segment format*/,
        },
        () => {
            addSegment(group, segment);
            containerProcessor(segment, element, context);
        }
    );
};
