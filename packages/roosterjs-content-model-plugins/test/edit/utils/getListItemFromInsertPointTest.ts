import { getListItemFromInsertPoint } from '../../../lib/edit/utils/getListItemFromInsertPoint';
import {
    createContentModelDocument,
    createFormatContainer,
    createListItem,
    createListLevel,
    createParagraph,
    createSelectionMarker,
    createText,
} from 'roosterjs-content-model-dom';
import type { InsertPoint } from 'roosterjs-content-model-types';

describe('getListItemFromInsertPoint', () => {
    it('returns the list item and its parent when marker is at the beginning', () => {
        const document = createContentModelDocument();
        const listItem = createListItem([createListLevel('UL')]);
        const paragraph = createParagraph();
        const marker = createSelectionMarker();
        const insertPoint: InsertPoint = {
            marker,
            paragraph,
            path: [listItem, document],
        };

        paragraph.segments.push(marker, createText('test'));
        listItem.blocks.push(paragraph);
        document.blocks.push(listItem);

        expect(getListItemFromInsertPoint(insertPoint)).toEqual([listItem, document]);
    });

    it('returns null when marker is not at the beginning', () => {
        const document = createContentModelDocument();
        const listItem = createListItem([createListLevel('UL')]);
        const paragraph = createParagraph();
        const marker = createSelectionMarker();
        const insertPoint: InsertPoint = {
            marker,
            paragraph,
            path: [listItem, document],
        };

        paragraph.segments.push(createText('test'), marker);
        listItem.blocks.push(paragraph);
        document.blocks.push(listItem);

        expect(getListItemFromInsertPoint(insertPoint)).toBeNull();
    });

    it('returns null when list item has no levels', () => {
        const document = createContentModelDocument();
        const listItem = createListItem([]);
        const paragraph = createParagraph();
        const marker = createSelectionMarker();
        const insertPoint: InsertPoint = {
            marker,
            paragraph,
            path: [listItem, document],
        };

        paragraph.segments.push(marker);
        listItem.blocks.push(paragraph);
        document.blocks.push(listItem);

        expect(getListItemFromInsertPoint(insertPoint)).toBeNull();
    });

    it('does not find a list item across a format container boundary', () => {
        const document = createContentModelDocument();
        const listItem = createListItem([createListLevel('UL')]);
        const container = createFormatContainer('blockquote');
        const paragraph = createParagraph();
        const marker = createSelectionMarker();
        const insertPoint: InsertPoint = {
            marker,
            paragraph,
            path: [container, listItem, document],
        };

        paragraph.segments.push(marker);
        container.blocks.push(paragraph);
        listItem.blocks.push(container);
        document.blocks.push(listItem);

        expect(getListItemFromInsertPoint(insertPoint)).toBeNull();
    });
});
