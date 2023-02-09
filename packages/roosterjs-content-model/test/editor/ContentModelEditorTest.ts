import * as contentModelToDom from '../../lib/modelToDom/contentModelToDom';
import * as domToContentModel from '../../lib/domToModel/domToContentModel';
import * as entityPlaceholderUtils from 'roosterjs-editor-dom/lib/entity/entityPlaceholderUtils';
import ContentModelEditor from '../../lib/editor/ContentModelEditor';
import { ContentModelDocument } from '../../lib/publicTypes/group/ContentModelDocument';
import { EditorPlugin, PluginEventType, SelectionRangeTypes } from 'roosterjs-editor-types';

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
                getDarkColor: (editor as any).core.lifecycle.getDarkColor,
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
                getDarkColor: (editor as any).core.lifecycle.getDarkColor,
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
                getDarkColor: (editor as any).core.lifecycle.getDarkColor,
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

    it('createContentModel in EditorReady event', () => {
        let model: ContentModelDocument | undefined;
        let pluginEditor: any;

        const div = document.createElement('div');
        const plugin: EditorPlugin = {
            getName: () => '',
            initialize: e => {
                pluginEditor = e;
            },
            dispose: () => {
                pluginEditor = undefined;
            },
            onPluginEvent: event => {
                if (event.eventType == PluginEventType.EditorReady) {
                    model = pluginEditor.createContentModel();
                }
            },
        };
        const editor = new ContentModelEditor(div, {
            plugins: [plugin],
        });
        editor.dispose();

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
    });
});
