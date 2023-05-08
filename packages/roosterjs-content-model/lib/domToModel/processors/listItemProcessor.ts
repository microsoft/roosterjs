import { createListItem } from '../../modelApi/creators/createListItem';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const listItemProcessor: ElementProcessor<HTMLLIElement> = (group, element, context) => {
    const { listFormat } = context;

    if (listFormat.listParent && listFormat.levels.length > 0) {
        stackFormat(
            context,
            {
                segment: 'shallowCloneForBlock',
            },
            () => {
                parseFormat(
                    element,
                    context.formatParsers.segmentOnBlock,
                    context.segmentFormat,
                    context
                );

                const listItem = createListItem(listFormat.levels, context.segmentFormat);
                parseFormat(
                    element,
                    context.formatParsers.listItemElement,
                    listItem.format,
                    context
                );

                listFormat.listParent!.blocks.push(listItem);

                parseFormat(
                    element,
                    context.formatParsers.listItem,
                    listItem.levels[listItem.levels.length - 1],
                    context
                );

                context.elementProcessors.child(listItem, element, context);

                const firstChild = listItem.blocks[0];

                if (
                    listItem.blocks.length == 1 &&
                    firstChild.blockType == 'Paragraph' &&
                    firstChild.isImplicit
                ) {
                    Object.assign(listItem.format, firstChild.format);
                    firstChild.format = {};
                }
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
