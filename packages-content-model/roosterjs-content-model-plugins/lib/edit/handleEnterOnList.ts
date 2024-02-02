import { getClosestAncestorBlockGroupIndex } from 'roosterjs-content-model-core';
import {
    createListItem,
    createListLevel,
    createParagraph,
    normalizeParagraph,
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
    if (context.deleteResult == 'notDeleted') {
        const { insertPoint } = context;
        const { path } = insertPoint;
        const index = getClosestAncestorBlockGroupIndex(
            path,
            ['FormatContainer', 'ListItem'],
            ['TableCell']
        );

        const listItem = path[index];
        if (listItem && listItem.blockGroupType === 'ListItem') {
            const listParent = path[index + 1];
            if (isEmptyListItem(listItem)) {
                listItem.levels = [];
            } else {
                createNewListItem(context, listItem, listParent);
            }
            context.formatContext?.rawEvent?.preventDefault();
            context.deleteResult = 'range';
        }
    }
};

const isEmptyListItem = (listItem: ContentModelListItem) => {
    return (
        listItem.blocks.length === 1 &&
        listItem.blocks[0].blockType === 'Paragraph' &&
        listItem.blocks[0].segments.length === 1 &&
        listItem.blocks[0].segments[0].segmentType === 'SelectionMarker'
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
    const newListItem = createListItem(levels, listItem.format);
    newListItem.blocks.push(newParagraph);
    listParent.blocks.splice(listIndex + 1, 0, newListItem);
};

const createNewListLevel = (listItem: ContentModelListItem) => {
    return listItem.levels.map(level => {
        return createListLevel(
            level.listType,
            {
                ...level.format,
                startNumberOverride: level.format.startNumberOverride
                    ? level.format.startNumberOverride + 1
                    : undefined,
            },
            level.dataset
        );
    });
};

const createNewParagraph = (insertPoint: InsertPoint) => {
    const { paragraph, marker } = insertPoint;
    const newParagraph = createParagraph(true, paragraph.format, paragraph.segmentFormat);
    const markerIndex = paragraph.segments.indexOf(marker);
    const segments = paragraph.segments.splice(
        markerIndex,
        paragraph.segments.length - markerIndex
    );

    newParagraph.segments.push(...segments);

    normalizeParagraph(newParagraph);
    return newParagraph;
};
