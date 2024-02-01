import { DeleteSelectionStep, InsertPoint } from 'roosterjs-content-model-types';
import { getClosestAncestorBlockGroupIndex } from 'roosterjs-content-model-core';

import {
    createListItem,
    createParagraph,
    setParagraphNotImplicit,
    normalizeParagraph,
    createBr,
} from 'roosterjs-content-model-dom';

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
            const listIndex = listParent.blocks.indexOf(listItem);
            const newParagraph = createNewParagraph(insertPoint);
            const newListItem = createListItem(listItem.levels, listItem.format);
            newListItem.blocks.push(newParagraph);
            listParent.blocks.splice(listIndex + 1, 0, newListItem);
            context.deleteResult = 'range';
            context.formatContext?.rawEvent?.preventDefault();
        }
    }
};

const createNewParagraph = (insertPoint: InsertPoint) => {
    const { paragraph, marker } = insertPoint;
    const newParagraph = createParagraph(false, paragraph.format, paragraph.segmentFormat);
    const markerIndex = paragraph.segments.indexOf(marker);
    const segments = paragraph.segments.splice(
        markerIndex,
        paragraph.segments.length - markerIndex
    );

    setParagraphNotImplicit(paragraph);
    newParagraph.segments.push(...segments);
    if (paragraph.segments.every(x => x.segmentType == 'SelectionMarker')) {
        paragraph.segments.push(createBr(marker.format));
    }

    normalizeParagraph(newParagraph);
    return newParagraph;
};
