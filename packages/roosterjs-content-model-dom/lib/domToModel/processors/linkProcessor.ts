import { addSegment } from '../../modelApi/common/addSegment';
import { createEmptyAnchor } from 'roosterjs-content-model-dom/lib/modelApi/creators/createEmptyAnchor';
import { knownElementProcessor } from './knownElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';
import type { ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const linkProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const name = element.getAttribute('name');
    const href = element.getAttribute('href');

    if (name || href) {
        stackFormat(context, { link: name && !href ? 'empty' : 'linkDefault' }, () => {
            parseFormat(element, context.formatParsers.link, context.link.format, context);
            parseFormat(element, context.formatParsers.dataset, context.link.dataset, context);

            if (name && !href && !element.firstChild) {
                // Empty anchor, need to make sure it has some child in model
                addSegment(group, createEmptyAnchor(name, context.segmentFormat));
            } else {
                knownElementProcessor(group, element, context);
            }
        });
    } else {
        // A tag without name or href, can be treated as normal SPAN tag
        knownElementProcessor(group, element, context);
    }
};
