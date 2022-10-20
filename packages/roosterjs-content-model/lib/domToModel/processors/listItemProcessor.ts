import { createListItem } from '../../modelApi/creators/createListItem';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { getTagOfNode } from 'roosterjs-editor-dom';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const listItemProcessor: ElementProcessor<HTMLLIElement> = (group, element, context) => {
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
                parseFormat(
                    element,
                    context.formatParsers.segmentOnBlock,
                    context.segmentFormat,
                    context
                );

                const listItem = createListItem(listFormat.levels, context.segmentFormat);
                listFormat.listParent!.blocks.push(listItem);

                parseFormat(
                    element,
                    context.formatParsers.listItem,
                    listItem.levels[listItem.levels.length - 1],
                    context
                );

                context.elementProcessors.child(listItem, element, context);
            }
        );
    } else {
        const currentBlocks = listFormat.listParent?.blocks;
        const lastItem = currentBlocks?.[currentBlocks?.length - 1];

        context.elementProcessors['*'](
            lastItem?.blockType == 'BlockGroup' ? lastItem : group,
            element,
            context
        );
    }
};
