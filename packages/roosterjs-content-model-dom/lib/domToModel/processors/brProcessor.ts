import { addSegment } from '../../modelApi/common/addSegment';
import { createBr } from '../../modelApi/creators/createBr';
import { getRegularSelectionOffsets } from '../utils/getRegularSelectionOffsets';
import type { ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const brProcessor: ElementProcessor<HTMLBRElement> = (group, element, context) => {
    const br = createBr(context.segmentFormat);
    const [start, end] = getRegularSelectionOffsets(context, element);

    if (start >= 0) {
        context.isInSelection = true;
    }

    if (context.isInSelection) {
        br.isSelected = true;
    }

    const paragraph = addSegment(group, br, context.blockFormat);

    if (end >= 0) {
        context.isInSelection = false;
    }

    context.domIndexer?.onSegment(element, paragraph, [br]);
};
