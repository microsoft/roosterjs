import { findListItemsInSameThread } from '../../../lib/modelApi/list/findListItemsInSameThread';
import {
    createContentModelDocument,
    createFormatContainer,
    createListItem,
    createListLevel,
    createParagraph,
} from 'roosterjs-content-model-dom';

describe('findListItemsInSameThread', () => {
    it('Empty group', () => {
        const group = createContentModelDocument();
        const currentItem = createListItem([]);

        const result = findListItemsInSameThread(group, currentItem);

        expect(result).toEqual([]);
    });

    it('Single list item', () => {
        const group = createContentModelDocument();
        const currentItem = createListItem([]);

        group.blocks.push(currentItem);

        const result = findListItemsInSameThread(group, currentItem);

        expect(result).toEqual([currentItem]);
    });

    it('Multiple list items, in the same thread', () => {
        const group = createContentModelDocument();
        const item1 = createListItem([createListLevel('OL')]);
        const item2 = createListItem([createListLevel('OL')]);
        const item3 = createListItem([createListLevel('OL')]);

        group.blocks.push(item1);
        group.blocks.push(item2);
        group.blocks.push(item3);

        const result = findListItemsInSameThread(group, item2);

        expect(result).toEqual([item1, item2, item3]);
    });

    it('Multiple list items, not in the same thread by start number - 1', () => {
        const group = createContentModelDocument();
        const item1 = createListItem([createListLevel('OL')]);
        const item2 = createListItem([createListLevel('OL', { startNumberOverride: 1 })]);
        const item3 = createListItem([createListLevel('OL', { startNumberOverride: 2 })]);

        group.blocks.push(item1);
        group.blocks.push(item2);
        group.blocks.push(item3);

        const result = findListItemsInSameThread(group, item2);

        expect(result).toEqual([item2]);
    });

    it('Multiple list items, not in the same thread by start number - 2', () => {
        const group = createContentModelDocument();
        const item1 = createListItem([createListLevel('OL', { startNumberOverride: 1 })]);
        const item2 = createListItem([createListLevel('OL')]);
        const item3 = createListItem([createListLevel('OL', { startNumberOverride: 2 })]);

        group.blocks.push(item1);
        group.blocks.push(item2);
        group.blocks.push(item3);

        const result = findListItemsInSameThread(group, item2);

        expect(result).toEqual([item1, item2]);
    });

    it('Multiple list items, not in the same thread by list type', () => {
        const group = createContentModelDocument();
        const item1 = createListItem([createListLevel('OL')]);
        const item2 = createListItem([createListLevel('UL')]);
        const item3 = createListItem([createListLevel('OL')]);

        group.blocks.push(item1);
        group.blocks.push(item2);
        group.blocks.push(item3);

        const result = findListItemsInSameThread(group, item2);

        expect(result).toEqual([item2]);
    });

    it('Multiple list items in the same thread, with interrupting UL', () => {
        const group = createContentModelDocument();
        const item1 = createListItem([createListLevel('OL')]);
        const item2 = createListItem([createListLevel('UL')]);
        const item3 = createListItem([createListLevel('OL')]);
        const currentItem4 = createListItem([createListLevel('UL')]);
        const currentItem5 = createListItem([createListLevel('OL')]);

        group.blocks.push(item1);
        group.blocks.push(item2);
        group.blocks.push(item3);
        group.blocks.push(currentItem4);
        group.blocks.push(currentItem5);

        const result = findListItemsInSameThread(group, item3);

        expect(result).toEqual([item1, item3, currentItem5]);
    });

    it('Multiple list items in the same thread, with interrupting paragraph', () => {
        const group = createContentModelDocument();
        const item1 = createListItem([createListLevel('OL')]);
        const item2 = createListItem([createListLevel('OL')]);
        const item3 = createListItem([createListLevel('OL')]);
        const para1 = createParagraph();
        const para2 = createParagraph();

        group.blocks.push(item1);
        group.blocks.push(para1);
        group.blocks.push(item2);
        group.blocks.push(para2);
        group.blocks.push(item3);

        const result = findListItemsInSameThread(group, item2);

        expect(result).toEqual([item1, item2, item3]);
    });

    it('Single UL', () => {
        const group = createContentModelDocument();
        const item1 = createListItem([createListLevel('UL')]);

        group.blocks.push(item1);

        const result = findListItemsInSameThread(group, item1);

        expect(result).toEqual([item1]);
    });

    it('Multiple UL', () => {
        const group = createContentModelDocument();
        const item1 = createListItem([createListLevel('UL')]);
        const item2 = createListItem([createListLevel('UL')]);
        const item3 = createListItem([createListLevel('UL')]);

        group.blocks.push(item1);
        group.blocks.push(item2);
        group.blocks.push(item3);

        const result = findListItemsInSameThread(group, item2);

        expect(result).toEqual([item1, item2, item3]);
    });

    it('Multiple UL interrupted by Para', () => {
        const group = createContentModelDocument();
        const item1 = createListItem([createListLevel('UL')]);
        const item2 = createListItem([createListLevel('OL')]);
        const item3 = createListItem([createListLevel('UL')]);
        const currentItem4 = createListItem([createListLevel('OL')]);
        const currentItem5 = createListItem([createListLevel('UL')]);

        group.blocks.push(item1);
        group.blocks.push(item2);
        group.blocks.push(item3);
        group.blocks.push(currentItem4);
        group.blocks.push(currentItem5);

        const result = findListItemsInSameThread(group, item3);

        expect(result).toEqual([item3]);
    });

    it('Multiple UL interrupted by OL', () => {
        const group = createContentModelDocument();
        const item1 = createListItem([createListLevel('UL')]);
        const item2 = createListItem([createListLevel('UL')]);
        const item3 = createListItem([createListLevel('UL')]);
        const para1 = createParagraph();
        const para2 = createParagraph();

        group.blocks.push(item1);
        group.blocks.push(para1);
        group.blocks.push(item2);
        group.blocks.push(para2);
        group.blocks.push(item3);

        const result = findListItemsInSameThread(group, item2);

        expect(result).toEqual([item2]);
    });

    it('Multiple UL under different group', () => {
        const group = createContentModelDocument();
        const item1 = createListItem([createListLevel('UL')]);
        const item2 = createListItem([createListLevel('UL')]);
        const item3 = createListItem([createListLevel('UL')]);
        const quote1 = createFormatContainer('blockquote');
        const quote3 = createFormatContainer('blockquote');

        quote1.blocks.push(item1);
        quote3.blocks.push(item3);

        group.blocks.push(quote1);
        group.blocks.push(item2);
        group.blocks.push(quote3);

        const result = findListItemsInSameThread(group, item2);

        expect(result).toEqual([item2]);
    });

    it('Multiple OL under different group', () => {
        const group = createContentModelDocument();
        const item1 = createListItem([createListLevel('OL')]);
        const item2 = createListItem([createListLevel('OL')]);
        const item3 = createListItem([createListLevel('OL')]);
        const quote1 = createFormatContainer('blockquote');
        const quote3 = createFormatContainer('blockquote');

        quote1.blocks.push(item1);
        quote3.blocks.push(item3);

        group.blocks.push(quote1);
        group.blocks.push(item2);
        group.blocks.push(quote3);

        const result = findListItemsInSameThread(group, item2);

        expect(result).toEqual([item1, item2, item3]);
    });

    it('Multiple OL with different levels - 1', () => {
        const group = createContentModelDocument();
        const item1 = createListItem([createListLevel('OL')]);
        const item2 = createListItem([createListLevel('OL'), createListLevel('OL')]);
        const item3 = createListItem([
            createListLevel('OL'),
            createListLevel('OL'),
            createListLevel('OL'),
        ]);
        const quote1 = createFormatContainer('blockquote');
        const quote3 = createFormatContainer('blockquote');

        quote1.blocks.push(item1);
        quote3.blocks.push(item3);

        group.blocks.push(quote1);
        group.blocks.push(item2);
        group.blocks.push(quote3);

        const result = findListItemsInSameThread(group, item2);

        expect(result).toEqual([item2, item3]);
    });

    it('Multiple OL with different levels - 1', () => {
        const group = createContentModelDocument();
        const item3 = createListItem([createListLevel('OL')]);
        const item2 = createListItem([createListLevel('OL'), createListLevel('OL')]);
        const item1 = createListItem([
            createListLevel('OL'),
            createListLevel('OL'),
            createListLevel('OL'),
        ]);
        const quote1 = createFormatContainer('blockquote');
        const quote3 = createFormatContainer('blockquote');

        quote1.blocks.push(item1);
        quote3.blocks.push(item3);

        group.blocks.push(quote1);
        group.blocks.push(item2);
        group.blocks.push(quote3);

        const result = findListItemsInSameThread(group, item2);

        expect(result).toEqual([item1, item2]);
    });
});
