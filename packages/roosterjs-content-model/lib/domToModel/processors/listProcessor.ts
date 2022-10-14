import { ContentModelListItemLevelFormat } from '../../publicTypes/format/ContentModelListItemLevelFormat';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { ListLevelFormatHandlers } from '../../formatHandlers/ListLevelFormatHandlers';
import { parseFormat } from '../utils/parseFormat';
import { SegmentFormatHandlers } from '../../formatHandlers/SegmentFormatHandlers';
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
            parseFormat(element, ListLevelFormatHandlers, level, context);
            parseFormat(element, SegmentFormatHandlers, context.segmentFormat, context);

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
