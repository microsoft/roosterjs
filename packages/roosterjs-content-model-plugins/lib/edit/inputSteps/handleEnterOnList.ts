import { getListAnnounceData } from 'roosterjs-content-model-api';
import { splitParagraph } from '../utils/splitParagraph';
import {
    createListItem,
    createListLevel,
    getClosestAncestorBlockGroupIndex,
    isBlockGroupOfType,
    mutateBlock,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelListItem,
    DeleteSelectionStep,
    ReadonlyContentModelBlock,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelListItem,
    ShallowMutableContentModelListItem,
    ValidDeleteSelectionContext,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleEnterOnList: DeleteSelectionStep = context => {
    const { deleteResult, insertPoint } = context;

    if (deleteResult == 'notDeleted' || deleteResult == 'nothingToDelete') {
        const { path } = insertPoint;
        const index = getClosestAncestorBlockGroupIndex(
            path,
            ['ListItem'],
            ['TableCell', 'FormatContainer']
        );

        const readonlyListItem = path[index];
        const listParent = path[index + 1];

        if (readonlyListItem?.blockGroupType === 'ListItem' && listParent) {
            let listItem = mutateBlock(readonlyListItem);

            if (isEmptyListItem(listItem)) {
                listItem.levels.pop();
            } else {
                listItem = createNewListItem(context, listItem, listParent);

                if (context.formatContext) {
                    context.formatContext.announceData = getListAnnounceData([
                        listItem,
                        ...path.slice(index + 1),
                    ]);
                }
            }

            const listIndex = listParent.blocks.indexOf(listItem);
            const nextBlock = listParent.blocks[listIndex + 1];

            if (nextBlock) {
                if (
                    isBlockGroupOfType<ContentModelListItem>(nextBlock, 'ListItem') &&
                    nextBlock.levels[0]
                ) {
                    nextBlock.levels.forEach(level => {
                        // Remove startNumberOverride so that next list item can join current list, unless it is 1.
                        // List start with 1 means it should be an explicit new list and should never join another list before it
                        if (level.format.startNumberOverride !== 1) {
                            level.format.startNumberOverride = undefined;
                        }
                    });

                    if (listItem.levels.length == 0) {
                        const index = findIndex(
                            listParent.blocks,
                            nextBlock.levels.length,
                            listIndex
                        );
                        nextBlock.levels[
                            nextBlock.levels.length - 1
                        ].format.startNumberOverride = index;
                    }
                }
            }

            context.deleteResult = 'range';
        }
    }
};

const isEmptyListItem = (listItem: ReadonlyContentModelListItem) => {
    return listItem.blocks.length === 1 && isEmptyParagraph(listItem.blocks[0]);
};

const isEmptyParagraph = (block: ReadonlyContentModelBlock) => {
    return (
        block.blockType === 'Paragraph' &&
        block.segments.length === 2 &&
        block.segments[0].segmentType === 'SelectionMarker' &&
        block.segments[1].segmentType === 'Br'
    );
};

const createNewListItem = (
    context: ValidDeleteSelectionContext,
    listItem: ReadonlyContentModelListItem,
    listParent: ReadonlyContentModelBlockGroup
) => {
    const { insertPoint } = context;
    const listIndex = listParent.blocks.indexOf(listItem);
    const currentPara = insertPoint.paragraph;
    const paraIndex = listItem.blocks.indexOf(currentPara);
    const newParagraph = splitParagraph(insertPoint);

    const levels = createNewListLevel(listItem);
    const newListItem: ShallowMutableContentModelListItem = createListItem(
        levels,
        listItem.formatHolder.format
    );

    newListItem.blocks.push(newParagraph);

    const remainingBlockCount = listItem.blocks.length - paraIndex - 1;

    if (paraIndex >= 0 && remainingBlockCount > 0) {
        newListItem.blocks.push(
            ...mutateBlock(listItem).blocks.splice(paraIndex + 1, remainingBlockCount)
        );
    }

    insertPoint.paragraph = newParagraph;
    mutateBlock(listParent).blocks.splice(listIndex + 1, 0, newListItem);

    if (context.lastParagraph == currentPara) {
        context.lastParagraph = newParagraph;
    }

    return newListItem;
};

const createNewListLevel = (listItem: ReadonlyContentModelListItem) => {
    return listItem.levels.map(level => {
        return createListLevel(
            level.listType,
            {
                ...level.format,
                startNumberOverride: undefined,
                displayForDummyItem: undefined, // When ENTER, we should create a new regular list item, so force its dummy item display to undefined
            },
            level.dataset
        );
    });
};

const findIndex = (
    blocks: readonly ReadonlyContentModelBlock[],
    levelLength: number,
    index: number
) => {
    let counter = 1;
    for (let i = index; i > -1; i--) {
        const listItem = blocks[i];
        if (
            isBlockGroupOfType<ContentModelListItem>(listItem, 'ListItem') &&
            listItem.levels.length === levelLength
        ) {
            counter++;
        } else if (
            !(
                isBlockGroupOfType<ContentModelListItem>(listItem, 'ListItem') &&
                listItem.levels.length == 0
            )
        ) {
            return counter;
        }
    }

    return counter;
};
