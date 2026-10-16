import {
    createBr,
    createContentModelDocument,
    createListItem,
    createListLevel,
    createParagraph,
    createSelectionMarker,
    createText,
    deleteSelection,
    normalizeContentModel,
} from 'roosterjs-content-model-dom';
import { deleteAllSegmentBefore } from '../../../lib/edit/deleteSteps/deleteAllSegmentBefore';

describe('deleteAllSegmentBefore', () => {
    it('keeps an implicit list paragraph focusable after deleting all content', () => {
        const model = createContentModelDocument();
        const listItem = createListItem([createListLevel('UL')]);
        const paragraph = createParagraph(true /*isImplicit*/);
        const marker = createSelectionMarker();

        paragraph.segments.push(createText('text'), marker);
        listItem.blocks.push(paragraph);
        model.blocks.push(listItem);

        const result = deleteSelection(model, [deleteAllSegmentBefore]);
        normalizeContentModel(model);

        expect(result.deleteResult).toBe('range');
        expect(model.blocks).toEqual([listItem]);
        expect(paragraph.segments).toEqual([marker, createBr()]);
    });
});
