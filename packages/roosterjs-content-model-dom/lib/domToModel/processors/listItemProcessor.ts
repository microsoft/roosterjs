import { createListItem } from '../../modelApi/creators/createListItem';
import { createListLevel } from '../../modelApi/creators/createListLevel';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';
import type { ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const listItemProcessor: ElementProcessor<HTMLLIElement> = (group, element, context) => {
    const { listFormat } = context;
    const listParent = listFormat.listParent ?? group;

    if (listFormat.levels.length == 0) {
        listFormat.levels.push(createListLevel('UL', context.blockFormat));
    }

    listFormat.listParent = listParent;

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
            parseFormat(element, context.formatParsers.listItemElement, listItem.format, context);

            listParent.blocks.push(listItem);

            parseFormat(
                element,
                context.formatParsers.listItemThread,
                listItem.levels[listItem.levels.length - 1].format,
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
};
