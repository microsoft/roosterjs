import { containerProcessor } from './containerProcessor';
import { createListItem } from '../../modelApi/creators/createListItem';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { generalProcessor } from './generalProcessor';
import { getTagOfNode } from 'roosterjs-editor-dom';
import { ListItemFormatHandlers } from '../../formatHandlers/ListItemFormatHandlers';
import { parseFormat } from '../utils/parseFormat';
import { SegmentFormatHandlers } from '../../formatHandlers/SegmentFormatHandlers';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const listItemProcessor: ElementProcessor = (group, element, context) => {
    const { listFormat } = context;

    if (
        listFormat.listParent &&
        listFormat.levels.length > 0 &&
        (element.style.display || context.defaultStyles[getTagOfNode(element)]?.display) ==
            'list-item'
    ) {
        stackFormat(
            context,
            {
                segment: 'shallowClone',
            },
            () => {
                parseFormat(element, SegmentFormatHandlers, context.segmentFormat, context);

                const listItem = createListItem(context.segmentFormat, listFormat.levels);
                listFormat.listParent!.blocks.push(listItem);

                parseFormat(
                    element,
                    ListItemFormatHandlers,
                    listItem.levels[listItem.levels.length - 1],
                    context
                );

                containerProcessor(listItem, element, context);
            }
        );
    } else {
        const currentBlocks = listFormat.listParent?.blocks;
        const lastItem = currentBlocks?.[currentBlocks?.length - 1];

        generalProcessor(lastItem?.blockType == 'BlockGroup' ? lastItem : group, element, context);
    }
};
