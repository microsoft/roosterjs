import { createListLevel } from '../../modelApi/creators/createListLevel';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';
import type { ContentModelListLevel, ElementProcessor } from 'roosterjs-content-model-types';

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
            const tagName = element.tagName as 'OL' | 'UL';
            const level: ContentModelListLevel = createListLevel(tagName, context.blockFormat);
            const { listFormat } = context;

            parseFormat(element, context.formatParsers.dataset, level.dataset, context);
            parseFormat(element, context.formatParsers.listLevelThread, level.format, context);
            parseFormat(element, context.formatParsers.listLevel, level.format, context);
            parseFormat(element, context.formatParsers.segment, context.segmentFormat, context);

            const originalListParent = listFormat.listParent;

            listFormat.potentialListType = tagName;
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
