import { ContentModelListItemLevelFormat } from '../../publicTypes/format/ContentModelListItemLevelFormat';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
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
    const level: ContentModelListItemLevelFormat = {};
    const { listFormat } = context;

    stackFormat(
        context,
        {
            segment: 'shallowClone',
        },
        () => {
            parseFormat(element, context.formatParsers.listLevel, level, context);
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
