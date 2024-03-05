import {
    getClosestAncestorBlockGroupIndex,
    isBlockGroupOfType,
} from 'roosterjs-content-model-core';
import {
    createBr,
    createListItem,
    createListLevel,
    createParagraph,
    createSelectionMarker,
    normalizeContentModel,
    normalizeParagraph,
    setParagraphNotImplicit,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelBlockGroup,
    ContentModelListItem,
    DeleteSelectionStep,
    InsertPoint,
    ValidDeleteSelectionContext,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleEnterOnList: DeleteSelectionStep = context => {
    const { deleteResult } = context;
    if (
        deleteResult == 'nothingToDelete' ||
        deleteResult == 'notDeleted' ||
        deleteResult == 'range'
    ) {
        const { insertPoint, formatContext } = context;
        const { path } = insertPoint;
        const rawEvent = formatContext?.rawEvent;
        const index = getClosestAncestorBlockGroupIndex(path, ['ListItem'], ['TableCell']);

        const listItem = path[index];
        const listParent = path[index + 1];

        if (listItem && listItem.blockGroupType === 'ListItem' && listParent) {
            const listIndex = listParent.blocks.indexOf(listItem);
            const nextBlock = listParent.blocks[listIndex + 1];
            if (deleteResult == 'range' && nextBlock) {
                normalizeContentModel(listParent);
                const nextListItem = listParent.blocks[listIndex + 1];
                if (
                    isBlockGroupOfType<ContentModelListItem>(nextListItem, 'ListItem') &&
                    nextListItem.levels[0]
                ) {
                    nextListItem.levels.forEach((level, index) => {
                        level.format.startNumberOverride = undefined;
                        level.dataset = listItem.levels[index]
                            ? listItem.levels[index].dataset
                            : {};
                    });
                    const lastParagraph = listItem.blocks[listItem.blocks.length - 1];
                    const nextParagraph = nextListItem.blocks[0];
                    if (
                        nextParagraph.blockType === 'Paragraph' &&
                        lastParagraph.blockType === 'Paragraph' &&
                        lastParagraph.segments[lastParagraph.segments.length - 1].segmentType ===
                            'SelectionMarker'
                    ) {
                        lastParagraph.segments.pop();

                        nextParagraph.segments.unshift(
                            createSelectionMarker(insertPoint.marker.format)
                        );
                    }
                    context.lastParagraph = undefined;
                }
            } else if (deleteResult !== 'range') {
                if (isEmptyListItem(listItem)) {
                    listItem.levels.pop();
                } else {
                    createNewListItem(context, listItem, listParent);
                }
            }
            rawEvent?.preventDefault();
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
    const newParagraph = createNewParagraph(insertPoint);

    const levels = createNewListLevel(listItem);
    const newListItem = createListItem(levels, insertPoint.marker.format);
    newListItem.blocks.push(newParagraph);
    insertPoint.paragraph = newParagraph;
    context.lastParagraph = newParagraph;
    listParent.blocks.splice(listIndex + 1, 0, newListItem);
};

const createNewListLevel = (listItem: ContentModelListItem) => {
    return listItem.levels.map(level => {
        return createListLevel(
            level.listType,
            {
                ...level.format,
                startNumberOverride: undefined,
            },
            level.dataset
        );
    });
};

const createNewParagraph = (insertPoint: InsertPoint) => {
    const { paragraph, marker } = insertPoint;
    const newParagraph = createParagraph(
        false /*isImplicit*/,
        paragraph.format,
        paragraph.segmentFormat
    );

    const markerIndex = paragraph.segments.indexOf(marker);
    const segments = paragraph.segments.splice(
        markerIndex,
        paragraph.segments.length - markerIndex
    );

    newParagraph.segments.push(...segments);

    setParagraphNotImplicit(paragraph);

    if (paragraph.segments.every(x => x.segmentType == 'SelectionMarker')) {
        paragraph.segments.push(createBr(marker.format));
    }

    normalizeParagraph(newParagraph);

    return newParagraph;
};
