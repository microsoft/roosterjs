import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createText } from '../../../lib/modelApi/creators/createText';
import { getFirstFocusedListItem } from '../../../lib/modelApi/list/getFirstFocusedListItem';

describe('getFirstFocusedListItem', () => {
    it('Empty group', () => {
        const group = createContentModelDocument(document);

        const result = getFirstFocusedListItem(group);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [],
            document: document,
        });
        expect(result).toBeNull();
    });

    it('Group without selection', () => {
        const group = createContentModelDocument(document);
        const para = createParagraph();

        group.blocks.push(para);

        const result = getFirstFocusedListItem(group);

        expect(result).toBeNull();
    });

    it('Group with list selection', () => {
        const group = createContentModelDocument(document);
        const para = createParagraph();
        const text = createText('test');

        para.segments.push(text);
        group.blocks.push(para);

        text.isSelected = true;

        const result = getFirstFocusedListItem(group);

        expect(result).toBeNull();
    });

    it('Group with list selection', () => {
        const group = createContentModelDocument(document);
        const listItem = createListItem([{ listType: 'OL' }]);
        const para = createParagraph();
        const text = createText('test');

        para.segments.push(text);
        listItem.blocks.push(para);
        group.blocks.push(listItem);

        text.isSelected = true;

        const result = getFirstFocusedListItem(group);

        expect(result).toBe(listItem);
    });

    it('Group with multiple list selection', () => {
        const group = createContentModelDocument(document);
        const listItem1 = createListItem([{ listType: 'OL' }]);
        const listItem2 = createListItem([{ listType: 'OL' }]);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');

        para1.segments.push(text1);
        para2.segments.push(text2);
        listItem1.blocks.push(para1);
        listItem2.blocks.push(para2);
        group.blocks.push(listItem1);
        group.blocks.push(listItem2);

        text2.isSelected = true;

        const result = getFirstFocusedListItem(group);

        expect(result).toBe(listItem2);
    });

    it('Group with selection that is not start from list', () => {
        const group = createContentModelDocument(document);
        const listItem2 = createListItem([{ listType: 'OL' }]);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');

        para1.segments.push(text1);
        para2.segments.push(text2);
        listItem2.blocks.push(para2);
        group.blocks.push(para1);
        group.blocks.push(listItem2);

        text1.isSelected = true;
        text2.isSelected = true;

        const result = getFirstFocusedListItem(group);

        expect(result).toBeNull();
    });
});
