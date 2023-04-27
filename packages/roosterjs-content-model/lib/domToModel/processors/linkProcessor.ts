import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { knownElementProcessor } from './knownElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const linkProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    if (element.hasAttribute('href')) {
        stackFormat(context, { link: 'linkDefault' }, () => {
            parseFormat(element, context.formatParsers.link, context.link.format, context);
            parseFormat(element, context.formatParsers.dataset, context.link.dataset, context);

            knownElementProcessor(group, element, context);
        });
    } else {
        // A tag without href, can be treated as normal SPAN tag
        knownElementProcessor(group, element, context);
    }
};
