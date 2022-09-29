import { containerProcessor } from './containerProcessor';
import { ContentModelListItemLevelFormat } from '../../publicTypes/format/ContentModelListItemLevelFormat';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { ListLevelFormatHandlers } from '../../formatHandlers/ListLevelFormatHandlers';
import { parseFormat } from '../utils/parseFormat';
import { SegmentFormatHandlers } from '../../formatHandlers/SegmentFormatHandlers';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const listProcessor: ElementProcessor = (group, element, context) => {
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

            listFormat.listParent = listFormat.listParent || group;
            listFormat.levels.push(level);

            try {
                containerProcessor(group, element, context);
            } finally {
                listFormat.levels.pop();
            }
        }
    );
};
