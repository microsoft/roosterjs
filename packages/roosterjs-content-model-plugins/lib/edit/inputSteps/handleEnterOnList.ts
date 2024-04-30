import { getListAnnounceData } from 'roosterjs-content-model-api';
import { splitParagraph } from '../utils/splitParagraph';
import {
    createListItem,
    createListLevel,
    getClosestAncestorBlockGroupIndex,
    isBlockGroupOfType,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelBlockGroup,
    ContentModelListItem,
    DeleteSelectionStep,
    ValidDeleteSelectionContext,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleEnterOnList: DeleteSelectionStep = context => {
    const { deleteResult, insertPoint } = context;

    if (deleteResult == 'notDeleted' || deleteResult == 'nothingToDelete') {
        const { path } = insertPoint;
        const index = getClosestAncestorBlockGroupIndex(path, ['ListItem'], ['TableCell']);

        const listParent = path[index + 1];
        const parentBlock = path[index];

        if (parentBlock?.blockGroupType === 'ListItem' && listParent) {
            let listItem: ContentModelListItem = parentBlock;

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
                const nextListItem = listParent.blocks[listIndex + 1];

                if (
                    isBlockGroupOfType<ContentModelListItem>(nextListItem, 'ListItem') &&
                    nextListItem.levels[0]
                ) {
                    nextListItem.levels.forEach(level => {
                        level.format.startNumberOverride = undefined;
                    });
                }
            }

            context.deleteResult = 'range';
        }
    }
};

const isEmptyListItem = (listItem: ContentModelListItem) => {
    return (
        listItem.blocks.length === 1 &&
        listItem.blocks[0].blockType === 'Paragraph' &&
        listItem.blocks[0].segments.length === 2 &&
        listItem.blocks[0].segments[0].segmentType === 'SelectionMarker' &&
        listItem.blocks[0].segments[1].segmentType === 'Br'
    );
};

const createNewListItem = (
    context: ValidDeleteSelectionContext,
    listItem: ContentModelListItem,
    listParent: ContentModelBlockGroup
) => {
    const { insertPoint } = context;
    const listIndex = listParent.blocks.indexOf(listItem);
    const currentPara = insertPoint.paragraph;
    const newParagraph = splitParagraph(insertPoint);

    const levels = createNewListLevel(listItem);
    const newListItem = createListItem(levels, insertPoint.marker.format);
    newListItem.blocks.push(newParagraph);
    insertPoint.paragraph = newParagraph;
    listParent.blocks.splice(listIndex + 1, 0, newListItem);

    if (context.lastParagraph == currentPara) {
        context.lastParagraph = newParagraph;
    }

    return newListItem;
};

const createNewListLevel = (listItem: ContentModelListItem) => {
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
