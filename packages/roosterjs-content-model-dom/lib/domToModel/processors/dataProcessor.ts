import { knownElementProcessor } from './knownElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';
import type { ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const dataProcessor: ElementProcessor<HTMLDataElement> = (group, element, context) => {
    stackFormat(context, { data: 'empty' }, () => {
        parseFormat(element, context.formatParsers.data, context.data.format, context);

        knownElementProcessor(group, element, context);
    });
};
