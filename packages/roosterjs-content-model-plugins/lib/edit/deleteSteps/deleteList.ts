import {
    createListItem,
    getClosestAncestorBlockGroupIndex,
    mutateBlock,
} from 'roosterjs-content-model-dom';
import type {
    DeleteSelectionStep,
    ContentModelListItem,
    ContentModelBlock,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const deleteList: DeleteSelectionStep = context => {
    if (context.deleteResult != 'notDeleted') {
        return;
    }

    const { paragraph, marker, path } = context.insertPoint;
    const index = getClosestAncestorBlockGroupIndex<ContentModelListItem>(
        path,
        ['ListItem'],
        ['TableCell', 'FormatContainer']
    );
    const item = path[index];
    const parent = path[index + 1];

    if (
        item?.blockGroupType == 'ListItem' &&
        item.levels.length > 0 &&
        paragraph.segments[0] == marker &&
        parent
    ) {
        const mutableList = mutateBlock(item);
        const lastLevel = mutableList.levels[mutableList.levels.length - 1];
        const listItemIndex = parent.blocks.indexOf(item);
        const previousItem = parent.blocks[listItemIndex - 1];

        // 1. If the last level is dummy, just remove it (legacy behavior)
        // 2. If focus is at the beginning of list item and previous block is a list item with the same level count,
        //    merge current list item into previous one
        // 3. Otherwise, split the list item. Keep the blocks before the paragraph in the current list item,
        //    move the rest to a new list item (if there are multiple levels) or directly to parent (if only one level)
        if (lastLevel.format.displayForDummyItem == 'block') {
            mutableList.levels.pop();

            context.deleteResult = 'range';
        } else if (
            item.blocks[0] == paragraph &&
            previousItem?.blockType == 'BlockGroup' &&
            previousItem.blockGroupType == 'ListItem' &&
            previousItem.levels.length == mutableList.levels.length
        ) {
            const mutablePreviousItem = mutateBlock(previousItem);

            mutablePreviousItem.blocks.push(...mutableList.blocks);
            mutateBlock(parent).blocks.splice(listItemIndex, 1);

            context.deleteResult = 'range';
        } else {
            const removedBlocks = mutableList.blocks.splice(
                mutableList.blocks.indexOf(paragraph),
                mutableList.blocks.length
            );

            if (mutableList.levels.length > 1) {
                const newListItem = createListItem(
                    mutableList.levels.slice(0, -1),
                    mutableList.formatHolder.format
                );

                newListItem.blocks = removedBlocks.map(
                    block => mutateBlock(block) as ContentModelBlock
                );

                mutateBlock(parent).blocks.splice(listItemIndex + 1, 0, newListItem);
            } else {
                mutateBlock(parent).blocks.splice(listItemIndex + 1, 0, ...removedBlocks);
            }

            context.deleteResult = 'range';
        }
    }
};
