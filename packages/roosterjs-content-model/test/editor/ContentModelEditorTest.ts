import * as contentModelToDom from '../../lib/publicApi/contentModelToDom';
import * as domToContentModel from '../../lib/publicApi/domToContentModel';
import * as entityPlaceholderUtils from 'roosterjs-editor-dom/lib/entity/entityPlaceholderUtils';
import ContentModelEditor from '../../lib/editor/ContentModelEditor';
import { SelectionRangeTypes } from 'roosterjs-editor-types';

describe('ContentModelEditor', () => {
    it('domToContentModel', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);

        const mockedResult = 'Result' as any;

        spyOn(domToContentModel, 'default').and.returnValue(mockedResult);

        const model = editor.createContentModel();

        expect(model).toBe(mockedResult);
        expect(domToContentModel.default).toHaveBeenCalledTimes(1);
        expect(domToContentModel.default).toHaveBeenCalledWith(
            div,
            {
                isDarkMode: false,
                getDarkColor: undefined,
                darkColorHandler: null,
            },
            {
                selectionRange: {
                    type: SelectionRangeTypes.Normal,
                    areAllCollapsed: true,
                    ranges: [],
                },
                alwaysNormalizeTable: true,
            }
        );
    });

    it('setContentModel with normal selection', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);
        const mockedFragment = 'Fragment' as any;
        const mockedRange = {
            type: SelectionRangeTypes.Normal,
            ranges: [document.createRange()],
        } as any;
        const mockedPairs = 'Pairs' as any;

        const mockedResult = [mockedFragment, mockedRange, mockedPairs] as any;
        const mockedModel = 'MockedModel' as any;

        spyOn(contentModelToDom, 'default').and.returnValue(mockedResult);
        spyOn(entityPlaceholderUtils, 'restoreContentWithEntityPlaceholder');

        editor.setContentModel(mockedModel);

        expect(contentModelToDom.default).toHaveBeenCalledTimes(1);
        expect(contentModelToDom.default).toHaveBeenCalledWith(
            document,
            mockedModel,
            {
                isDarkMode: false,
                getDarkColor: undefined,
                darkColorHandler: null,
            },
            undefined
        );
        expect(entityPlaceholderUtils.restoreContentWithEntityPlaceholder).toHaveBeenCalledTimes(1);
        expect(entityPlaceholderUtils.restoreContentWithEntityPlaceholder).toHaveBeenCalledWith(
            mockedFragment,
            div,
            mockedPairs
        );
    });

    it('setContentModel', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);
        const mockedFragment = 'Fragment' as any;
        const mockedRange = {
            type: SelectionRangeTypes.Normal,
            ranges: [document.createRange()],
        } as any;
        const mockedPairs = 'Pairs' as any;

        const mockedResult = [mockedFragment, mockedRange, mockedPairs] as any;
        const mockedModel = 'MockedModel' as any;

        spyOn(contentModelToDom, 'default').and.returnValue(mockedResult);
        spyOn(entityPlaceholderUtils, 'restoreContentWithEntityPlaceholder');

        editor.setContentModel(mockedModel);

        expect(contentModelToDom.default).toHaveBeenCalledTimes(1);
        expect(contentModelToDom.default).toHaveBeenCalledWith(
            document,
            mockedModel,
            {
                isDarkMode: false,
                getDarkColor: undefined,
                darkColorHandler: null,
            },
            undefined
        );
        expect(entityPlaceholderUtils.restoreContentWithEntityPlaceholder).toHaveBeenCalledTimes(1);
        expect(entityPlaceholderUtils.restoreContentWithEntityPlaceholder).toHaveBeenCalledWith(
            mockedFragment,
            div,
            mockedPairs
        );
    });
});
