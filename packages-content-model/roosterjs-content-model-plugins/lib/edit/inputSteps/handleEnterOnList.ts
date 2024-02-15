import { getClosestAncestorBlockGroupIndex } from 'roosterjs-content-model-core';
import {
    createBr,
    createListItem,
    createListLevel,
    createParagraph,
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
    if (
        context.deleteResult == 'nothingToDelete' ||
        context.deleteResult == 'notDeleted' ||
        context.deleteResult == 'range'
    ) {
        const { insertPoint, formatContext } = context;
        const { path } = insertPoint;
        const rawEvent = formatContext?.rawEvent;
        const index = getClosestAncestorBlockGroupIndex(path, ['ListItem'], ['TableCell']);

        const listItem = path[index];

        if (listItem && listItem.blockGroupType === 'ListItem') {
            const listParent = path[index + 1];
            if (isEmptyListItem(listItem)) {
                listItem.levels.pop();
            } else {
                createNewListItem(context, listItem, listParent);
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
