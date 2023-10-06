import { addSegment } from '../../modelApi/common/addSegment';
import { createBr } from '../../modelApi/creators/createBr';
import type { ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const brProcessor: ElementProcessor<HTMLBRElement> = (group, element, context) => {
    const br = createBr(context.segmentFormat);

    if (context.isInSelection) {
        br.isSelected = true;
    }

    const paragraph = addSegment(group, br, context.blockFormat);
    context.domIndexer?.onSegment(element, paragraph, [br]);
};
