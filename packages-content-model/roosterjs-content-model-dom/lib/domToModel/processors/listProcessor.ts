import { ContentModelListLevel, ElementProcessor } from 'roosterjs-content-model-types';
import { createListLevel } from 'roosterjs-content-model/lib';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const listProcessor: ElementProcessor<HTMLOListElement | HTMLUListElement> = (
    group,
    element,
    context
) => {
    stackFormat(
        context,
        {
            segment: 'shallowCloneForBlock',
            paragraph: 'shallowCloneForGroup',
        },
        () => {
            const level: ContentModelListLevel = createListLevel(
                element.tagName as 'OL' | 'UL',
                context.blockFormat
            );
            const { listFormat } = context;

            parseFormat(element, context.formatParsers.dataset, level.dataset, context);
            parseFormat(element, context.formatParsers.listLevel, level.format, context);
            parseFormat(element, context.formatParsers.segment, context.segmentFormat, context);

            const originalListParent = listFormat.listParent;

            listFormat.listParent = listFormat.listParent || group;
            listFormat.levels.push(level);

            try {
                context.elementProcessors.child(group, element, context);
            } finally {
                listFormat.levels.pop();
                listFormat.listParent = originalListParent;
            }
        }
    );
};
