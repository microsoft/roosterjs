import { setModelListLevel } from '../../../lib/modelApi/list/setModelListLevel';
import {
    createContentModelDocument,
    createListItem,
    createListLevel,
    createParagraph,
    createSelectionMarker,
    createText,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelDocument,
    ContentModelListItem,
    FormatContentModelContext,
} from 'roosterjs-content-model-types';

describe('setModelListLevel', () => {
    function createSelectedParagraph(text: string) {
        const para = createParagraph();
        const textSegment = createText(text);

        textSegment.isSelected = true;
        para.segments.push(textSegment);

        return para;
    }

    function createListItemWithLevels(
        listTypes: ('OL' | 'UL')[],
        text: string,
        isSelected: boolean
    ) {
        const listItem = createListItem(listTypes.map(type => createListLevel(type)));
        const para = createParagraph();
        const textSegment = createText(text);

        textSegment.isSelected = isSelected;
        para.segments.push(textSegment);
        listItem.blocks.push(para);

        return listItem;
    }

    function getListTypes(model: ContentModelDocument, index: number) {
        const block = model.blocks[index] as ContentModelListItem;

        expect(block.blockType).toBe('BlockGroup');
        expect(block.blockGroupType).toBe('ListItem');

        return block.levels.map(x => x.listType);
    }

    it('no selection', () => {
        const model = createContentModelDocument();
        const para = createParagraph();

        para.segments.push(createText('test'));
        model.blocks.push(para);

        const result = setModelListLevel(model, 'UL', 2);

        expect(result).toBeFalse();
        expect(model.blocks[0]).toBe(para);
    });

    it('paragraph to bullet list level 1', () => {
        const model = createContentModelDocument();

        model.blocks.push(createSelectedParagraph('test'));

        const result = setModelListLevel(model, 'UL', 1);

        expect(result).toBeTrue();
        expect(model.blocks.length).toBe(1);
        expect(getListTypes(model, 0)).toEqual(['UL']);
    });

    it('paragraph to numbering list level 3', () => {
        const model = createContentModelDocument();

        model.blocks.push(createSelectedParagraph('test'));

        const result = setModelListLevel(model, 'OL', 3);

        expect(result).toBeTrue();
        expect(getListTypes(model, 0)).toEqual(['OL', 'OL', 'OL']);

        const levels = (model.blocks[0] as ContentModelListItem).levels;

        expect(levels[1].format.startNumberOverride).toBeUndefined();
        expect(levels[2].format.startNumberOverride).toBeUndefined();
        expect(levels[2].dataset.editingInfo).toContain('"applyListStyleFromLevel":true');
    });

    it('selection marker in paragraph', () => {
        const model = createContentModelDocument();
        const para = createParagraph();

        para.segments.push(createText('test'), createSelectionMarker());
        model.blocks.push(para);

        const result = setModelListLevel(model, 'UL', 2);

        expect(result).toBeTrue();
        expect(getListTypes(model, 0)).toEqual(['UL', 'UL']);
    });

    it('list item already in expected type and level is not toggled off', () => {
        const model = createContentModelDocument();

        model.blocks.push(createListItemWithLevels(['UL'], 'test', true));

        const result = setModelListLevel(model, 'UL', 1);

        expect(result).toBeTrue();
        expect(getListTypes(model, 0)).toEqual(['UL']);
    });

    it('decrease level of list item', () => {
        const model = createContentModelDocument();

        model.blocks.push(createListItemWithLevels(['OL', 'UL', 'UL'], 'test', true));

        const result = setModelListLevel(model, 'UL', 1);

        expect(result).toBeTrue();
        expect(getListTypes(model, 0)).toEqual(['UL']);
    });

    it('increase level and change list type', () => {
        const model = createContentModelDocument();

        model.blocks.push(createListItemWithLevels(['UL'], 'test', true));

        const result = setModelListLevel(model, 'OL', 2);

        expect(result).toBeTrue();
        expect(getListTypes(model, 0)).toEqual(['OL', 'OL']);
    });

    it('decrease level changes the type of the new last level', () => {
        const model = createContentModelDocument();

        model.blocks.push(createListItemWithLevels(['UL', 'OL', 'UL'], 'test', true));

        const result = setModelListLevel(model, 'UL', 2);

        expect(result).toBeTrue();
        expect(getListTypes(model, 0)).toEqual(['UL', 'UL']);

        const levels = (model.blocks[0] as ContentModelListItem).levels;

        expect(levels[1].dataset.editingInfo).toContain('"applyListStyleFromLevel":true');
    });

    it('level smaller than 1 removes the list', () => {
        const model = createContentModelDocument();

        model.blocks.push(createListItemWithLevels(['UL', 'UL'], 'test', true));

        const result = setModelListLevel(model, 'UL', 0);

        expect(result).toBeTrue();
        expect(model.blocks.length).toBe(1);
        expect(model.blocks[0].blockType).toBe('Paragraph');
    });

    it('multiple selected items with different levels', () => {
        const model = createContentModelDocument();

        model.blocks.push(
            createListItemWithLevels(['OL'], 'test1', false),
            createListItemWithLevels(['OL'], 'test2', true),
            createListItemWithLevels(['OL', 'OL', 'OL'], 'test3', true),
            createSelectedParagraph('test4')
        );

        const result = setModelListLevel(model, 'OL', 2);

        expect(result).toBeTrue();
        expect(model.blocks.length).toBe(4);
        expect(getListTypes(model, 0)).toEqual(['OL']);
        expect(getListTypes(model, 1)).toEqual(['OL', 'OL']);
        expect(getListTypes(model, 2)).toEqual(['OL', 'OL']);
        expect(getListTypes(model, 3)).toEqual(['OL', 'OL']);
    });

    it('new level reuses dataset from previous item in same thread', () => {
        const model = createContentModelDocument();
        const prevItem = createListItemWithLevels(['OL', 'OL'], 'test1', false);

        prevItem.levels[1].dataset.editingInfo = '{"orderedStyleType":3}';
        model.blocks.push(prevItem, createListItemWithLevels(['OL'], 'test2', true));

        setModelListLevel(model, 'OL', 2);

        const levels = (model.blocks[1] as ContentModelListItem).levels;

        expect(levels.length).toBe(2);
        expect(levels[1].dataset.editingInfo).toContain('"orderedStyleType":3');
        expect(levels[1].dataset.editingInfo).toContain('"applyListStyleFromLevel":true');
    });

    it('set announce data when single list item is changed', () => {
        const model = createContentModelDocument();
        const context: FormatContentModelContext = {
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        };

        model.blocks.push(createSelectedParagraph('test'));

        setModelListLevel(model, 'UL', 2, context);

        expect(context.announceData).toEqual({
            defaultStrings: 'announceListItemBullet',
        });
    });
});
