import { reorderList } from '../../../lib/dragAndDrop/utils/reorderList';
import {
    createContentModelDocument,
    createListItem,
    createListLevel,
    createParagraph,
    createSelectionMarker,
    createText,
} from 'roosterjs-content-model-dom';
import type { ValidDeleteSelectionContext } from 'roosterjs-content-model-types';

describe('reorderList', () => {
    it('removes the selected paragraph and following blocks from the list item', () => {
        const document = createContentModelDocument();
        const listItem = createListItem([createListLevel('UL')]);
        const paragraphBefore = createParagraph();
        const selectedParagraph = createParagraph();
        const paragraphAfter = createParagraph();
        const marker = createSelectionMarker();
        const context: ValidDeleteSelectionContext = {
            deleteResult: 'range',
            insertPoint: {
                marker,
                paragraph: selectedParagraph,
                path: [listItem, document],
            },
        };

        paragraphBefore.segments.push(createText('before'));
        selectedParagraph.segments.push(marker, createText('selected'));
        paragraphAfter.segments.push(createText('after'));
        listItem.blocks.push(paragraphBefore, selectedParagraph, paragraphAfter);
        document.blocks.push(listItem);

        reorderList(context);

        expect(listItem.blocks).toEqual([paragraphBefore]);
        expect(context.deleteResult).toBe('range');
    });

    it('does nothing when delete result is not range', () => {
        const document = createContentModelDocument();
        const listItem = createListItem([createListLevel('UL')]);
        const paragraph = createParagraph();
        const marker = createSelectionMarker();
        const context: ValidDeleteSelectionContext = {
            deleteResult: 'notDeleted',
            insertPoint: {
                marker,
                paragraph,
                path: [listItem, document],
            },
        };

        paragraph.segments.push(marker, createText('test'));
        listItem.blocks.push(paragraph);
        document.blocks.push(listItem);

        reorderList(context);

        expect(listItem.blocks).toEqual([paragraph]);
        expect(context.deleteResult).toBe('notDeleted');
    });

    it('does nothing when marker is not at the beginning of the paragraph', () => {
        const document = createContentModelDocument();
        const listItem = createListItem([createListLevel('UL')]);
        const paragraph = createParagraph();
        const marker = createSelectionMarker();
        const context: ValidDeleteSelectionContext = {
            deleteResult: 'range',
            insertPoint: {
                marker,
                paragraph,
                path: [listItem, document],
            },
        };

        paragraph.segments.push(createText('test'), marker);
        listItem.blocks.push(paragraph);
        document.blocks.push(listItem);

        reorderList(context);

        expect(listItem.blocks).toEqual([paragraph]);
        expect(context.deleteResult).toBe('range');
    });
});
