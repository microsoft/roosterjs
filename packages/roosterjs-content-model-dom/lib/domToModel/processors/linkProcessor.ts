import { addSegment } from '../../modelApi/common/addSegment';
import { createText } from '../../modelApi/creators/createText';
import { knownElementProcessor } from './knownElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';
import type { StackFormatOptions } from '../utils/stackFormat';
import type { ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const linkProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const name = element.getAttribute('name');
    const href = element.getAttribute('href');

    if (name || href) {
        const isAnchor = !!name && !href;
        const option: StackFormatOptions = {
            // For anchor (name without ref), no need to add other styles
            // For link (href exists), add default link styles
            link: isAnchor ? 'empty' : 'linkDefault',
        };

        stackFormat(context, option, () => {
            parseFormat(element, context.formatParsers.link, context.link.format, context);
            parseFormat(element, context.formatParsers.dataset, context.link.dataset, context);

            if (isAnchor && !element.firstChild) {
                // Empty anchor, need to make sure it has some child in model
                addSegment(
                    group,
                    createText('', context.segmentFormat, {
                        dataset: context.link.dataset,
                        format: context.link.format,
                    })
                );
            } else {
                knownElementProcessor(group, element, context);
            }
        });
    } else {
        // A tag without name or href, can be treated as normal SPAN tag
        knownElementProcessor(group, element, context);
    }
};
