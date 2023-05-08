import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { knownElementProcessor } from './knownElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const codeProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    stackFormat(context, { code: 'codeDefault' }, () => {
        parseFormat(element, context.formatParsers.code, context.code.format, context);

        knownElementProcessor(group, element, context);
    });
};
