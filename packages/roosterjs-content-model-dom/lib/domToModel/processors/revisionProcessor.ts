import { generalProcessor } from './generalProcessor';
import { stackFormat } from '../utils/stackFormat';
import type { ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const revisionProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    // Keep semantic revision attributes without materializing inherited paragraph wrappers.
    stackFormat(context, { paragraph: 'empty' }, () => {
        generalProcessor(group, element, context);
    });
};
