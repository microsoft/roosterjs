import * as getAutoListStyleType from 'roosterjs-content-model-dom/lib/modelApi/list/getAutoListStyleType';
import { getListAnnounceData } from '../../../lib/modelApi/list/getListAnnounceData';
import {
    NumberingListType,
    createContentModelDocument,
    createListItem,
    createListLevel,
} from 'roosterjs-content-model-dom';

describe('getListAnnounceData', () => {
    let getAutoListStyleTypeSpy: jasmine.Spy;

    beforeEach(() => {
        getAutoListStyleTypeSpy = spyOn(getAutoListStyleType, 'getAutoListStyleType');
    });
    it('empty path', () => {
        const result = getListAnnounceData([]);

        expect(result).toEqual(null);
        expect(getAutoListStyleTypeSpy).not.toHaveBeenCalled();
    });

    it('no list item', () => {
        const doc = createContentModelDocument();
        const result = getListAnnounceData([doc]);

        expect(result).toEqual(null);
        expect(getAutoListStyleTypeSpy).not.toHaveBeenCalled();
    });

    it('path has single list item, no list style', () => {
        const doc = createContentModelDocument();
        const listItem = createListItem([createListLevel('OL')]);

        doc.blocks.push(listItem);

        getAutoListStyleTypeSpy.and.returnValue(undefined);

        const result = getListAnnounceData([listItem, doc]);

        expect(result).toEqual(null);
        expect(getAutoListStyleTypeSpy).toHaveBeenCalledWith('OL', {}, 0, undefined);
    });

    it('path has single list item, has list style in format', () => {
        const doc = createContentModelDocument();
        const listItem = createListItem([createListLevel('OL', { listStyleType: 'decimal' })]);

        doc.blocks.push(listItem);

        getAutoListStyleTypeSpy.and.returnValue(NumberingListType.Decimal);

        const result = getListAnnounceData([listItem, doc]);

        expect(result).toEqual({
            defaultStrings: 'announceListItemNumbering',
            formatStrings: ['1'],
        });
        expect(getAutoListStyleTypeSpy).toHaveBeenCalledWith('OL', {}, 0, 'decimal');
    });

    it('path has dummy list item', () => {
        const doc = createContentModelDocument();
        const listItem = createListItem([createListLevel('OL', { displayForDummyItem: 'block' })]);

        doc.blocks.push(listItem);

        const result = getListAnnounceData([listItem, doc]);

        expect(result).toEqual(null);
        expect(getAutoListStyleTypeSpy).not.toHaveBeenCalled();
    });

    it('path with bullet list', () => {
        const doc = createContentModelDocument();
        const listItem = createListItem([createListLevel('UL')]);

        doc.blocks.push(listItem);

        const result = getListAnnounceData([listItem, doc]);

        expect(result).toEqual({
            defaultStrings: 'announceListItemBullet',
        });
        expect(getAutoListStyleTypeSpy).not.toHaveBeenCalled();
    });

    it('path has deeper list', () => {
        const doc = createContentModelDocument();
        const listItem = createListItem([
            createListLevel('UL'),
            createListLevel('OL', { listStyleType: 'decimal' }),
        ]);

        doc.blocks.push(listItem);

        getAutoListStyleTypeSpy.and.returnValue(NumberingListType.Decimal);

        const result = getListAnnounceData([listItem, doc]);

        expect(result).toEqual({
            defaultStrings: 'announceListItemNumbering',
            formatStrings: ['1'],
        });
        expect(getAutoListStyleTypeSpy).toHaveBeenCalledWith('OL', {}, 1, 'decimal');
    });

    it('path has multiple list items', () => {
        const doc = createContentModelDocument();
        const listItem1 = createListItem([createListLevel('OL')]);
        const listItem2 = createListItem([createListLevel('OL')]);

        doc.blocks.push(listItem1, listItem2);

        getAutoListStyleTypeSpy.and.returnValue(NumberingListType.Decimal);

        const result = getListAnnounceData([listItem2, doc]);

        expect(result).toEqual({
            defaultStrings: 'announceListItemNumbering',
            formatStrings: ['2'],
        });
        expect(getAutoListStyleTypeSpy).toHaveBeenCalledWith('OL', {}, 0, undefined);
    });
});
