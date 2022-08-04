import { addSegment } from '../../modelApi/common/addSegment';
import { createBr } from '../../modelApi/creators/createBr';
import { ElementProcessor } from './ElementProcessor';

/**
 * @internal
 */
export const brProcessor: ElementProcessor = (group, element, context) => {
    const br = createBr();

    if (context.isInSelection) {
        br.isSelected = true;
    }

    addSegment(group, br);
};
