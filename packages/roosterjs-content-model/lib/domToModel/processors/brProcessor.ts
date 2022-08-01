import { addSegment } from '../utils/addSegment';
import { createBr } from '../creators/createBr';
import { ElementProcessor } from './ElementProcessor';

/**
 * @internal
 */
export const brProcessor: ElementProcessor = (group, element, context) => {
    addSegment(group, createBr(context));
};
