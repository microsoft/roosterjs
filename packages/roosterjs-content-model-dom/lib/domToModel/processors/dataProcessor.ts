import { addDecorators } from '../../modelApi/common/addDecorators';
import { addSegment } from '../../modelApi/common/addSegment';
import { createText } from '../../modelApi/creators/createText';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';
import type { ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const dataProcessor: ElementProcessor<HTMLDataElement> = (group, element, context) => {
    const hasOnlyTextChildren =
        element.hasChildNodes() &&
        Array.from(element.childNodes).every(child => isNodeOfType(child, 'TEXT_NODE'));

    if (element.hasAttribute('value') && hasOnlyTextChildren) {
        stackFormat(context, { segment: 'shallowClone' }, () => {
            parseFormat(element, context.formatParsers.segment, context.segmentFormat, context);

            const segment = createText(element.textContent || '', {
                ...context.segmentFormat,
                dataValue: element.value,
            });

            if (context.isInSelection) {
                segment.isSelected = true;
            }

            addDecorators(segment, context);

            const paragraph = addSegment(group, segment, context.blockFormat);

            context.domIndexer?.onSegment(element, paragraph, [segment]);
        });
    } else {
        context.elementProcessors['*'](group, element, context);
    }
};
