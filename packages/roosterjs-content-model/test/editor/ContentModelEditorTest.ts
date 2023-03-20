import * as contentModelToDom from '../../lib/modelToDom/contentModelToDom';
import * as domToContentModel from '../../lib/domToModel/domToContentModel';
import ContentModelEditor from '../../lib/editor/ContentModelEditor';
import { ContentModelDocument } from '../../lib/publicTypes/group/ContentModelDocument';
import { EditorContext } from '../../lib/publicTypes/context/EditorContext';
import {
    EditorPlugin,
    ExperimentalFeatures,
    PluginEventType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

const editorContext: EditorContext = {
    isDarkMode: false,
    getDarkColor: () => '',
    darkColorHandler: undefined,
};

describe('ContentModelEditor', () => {
    it('domToContentModel', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);

        const mockedResult = 'Result' as any;

        spyOn(editor as any, 'createEditorContext').and.returnValue(editorContext);
        spyOn(domToContentModel, 'default').and.returnValue(mockedResult);

        const model = editor.createContentModel();

        expect(model).toBe(mockedResult);
        expect(domToContentModel.default).toHaveBeenCalledTimes(1);
        expect(domToContentModel.default).toHaveBeenCalledWith(div, editorContext, {
            selectionRange: {
                type: SelectionRangeTypes.Normal,
                areAllCollapsed: true,
                ranges: [],
            },
            alwaysNormalizeTable: true,
        });
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

        spyOn(editor as any, 'createEditorContext').and.returnValue(editorContext);
        spyOn(contentModelToDom, 'default').and.returnValue(mockedResult);

        editor.setContentModel(mockedModel);

        expect(contentModelToDom.default).toHaveBeenCalledTimes(1);
        expect(contentModelToDom.default).toHaveBeenCalledWith(
            document,
            div,
            mockedModel,
            editorContext,
            undefined
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

        spyOn(editor as any, 'createEditorContext').and.returnValue(editorContext);
        spyOn(contentModelToDom, 'default').and.returnValue(mockedResult);

        editor.setContentModel(mockedModel);

        expect(contentModelToDom.default).toHaveBeenCalledTimes(1);
        expect(contentModelToDom.default).toHaveBeenCalledWith(
            document,
            div,
            mockedModel,
            editorContext,
            undefined
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

    it('get model with cache', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div, {
            experimentalFeatures: [ExperimentalFeatures.ReusableContentModel],
        });
        const cachedModel = 'MODEL' as any;

        (editor as any).cachedModel = cachedModel;

        spyOn(domToContentModel, 'default');

        const model = editor.createContentModel();

        expect(model).toBe(cachedModel);
        expect(domToContentModel.default).not.toHaveBeenCalled();
    });

    it('cache model', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div, {
            experimentalFeatures: [ExperimentalFeatures.ReusableContentModel],
        });
        const cachedModel = 'MODEL' as any;

        editor.cacheContentModel(cachedModel);

        expect((editor as any).cachedModel).toBe(cachedModel);

        editor.cacheContentModel(null);

        expect((editor as any).cachedModel).toBe(null);
    });

    it('default format', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div, {
            defaultFormat: {
                bold: true,
                italic: true,
                underline: true,
                fontFamily: 'Arial',
                fontSize: '10pt',
                textColors: {
                    lightModeColor: 'black',
                    darkModeColor: 'white',
                },
                backgroundColors: {
                    lightModeColor: 'white',
                    darkModeColor: 'black',
                },
            },
        });

        const model = editor.createContentModel();

        expect(model.format).toEqual({
            fontWeight: 'bold',
            italic: true,
            underline: true,
            fontFamily: 'Arial',
            fontSize: '10pt',
            textColor: 'black',
            backgroundColor: 'white',
        });
    });
});
