import { addDecorators } from '../../modelApi/common/addDecorators';
import { addSegment } from '../../modelApi/common/addSegment';
import { createGeneralSegment } from '../../modelApi/creators/createGeneralSegment';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';
import type { ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 * Preserve an inline bidi scope across its editable, independently formatted children.
 */
export const inlineDirectionProcessor: ElementProcessor<HTMLElement> = (
    group,
    element,
    context
) => {
    stackFormat(context, { segment: 'shallowClone', paragraph: 'shallowClone' }, () => {
        parseFormat(element, context.formatParsers.segment, context.segmentFormat, context);

        // Keep only the semantic scope on the wrapper; its visual formatting belongs to the model.
        const wrapper = element.ownerDocument.createElement('span');
        wrapper.dir = element.dir;
        const segment = createGeneralSegment(wrapper, context.segmentFormat);
        const isSelectedBefore = context.isInSelection;

        addDecorators(segment, context);
        const paragraph = addSegment(group, segment);
        context.domIndexer?.onSegment(element, paragraph, [segment]);

        stackFormat(
            context,
            {
                segment: 'empty',
                paragraph: 'empty',
                blockDecorator: 'empty',
                link: 'empty',
                code: 'empty',
            },
            () => {
                context.elementProcessors.child(segment, element, context);
            }
        );

        if (isSelectedBefore && context.isInSelection) {
            segment.isSelected = true;
        }
    });
};
