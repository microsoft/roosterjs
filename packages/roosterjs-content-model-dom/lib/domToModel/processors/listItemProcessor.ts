import { applyWordLikeListStyles } from '../../modelApi/list/applyWordLikeListStyles';
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
    const wordLikeStyles = (context.experimentalFeatures?.indexOf('WordLikeStyles') ?? -1) >= 0;
    const originalListParent = listFormat.listParent;
    let shouldPopListLevel = false;

    try {
        listFormat.listParent = listFormat.listParent ?? group;

        const listParent = listFormat.listParent;

        if (listFormat.levels.length == 0) {
            listFormat.levels.push(
                createListLevel(listFormat.potentialListType || 'UL', context.blockFormat)
            );
            shouldPopListLevel = true;
        }

        stackFormat(
            context,
            {
                segment: 'shallowCloneForBlock',
                paragraph: wordLikeStyles ? 'shallowClone' : undefined,
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

                listParent.blocks.push(listItem);

                parseFormat(
                    element,
                    context.formatParsers.listItemThread,
                    listItem.levels[listItem.levels.length - 1].format,
                    context
                );

                if (wordLikeStyles && listItem.format.direction) {
                    context.blockFormat.direction = listItem.format.direction;
                }

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

                if (wordLikeStyles) {
                    applyWordLikeListStyles(listItem, context.blockFormat.direction);
                }
            }
        );
    } finally {
        if (shouldPopListLevel) {
            listFormat.levels.pop();
        }

        listFormat.listParent = originalListParent;
    }
};
