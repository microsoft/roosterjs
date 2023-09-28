import * as contentModelToDom from 'roosterjs-content-model-dom/lib/modelToDom/contentModelToDom';
import * as createDomToModelContext from 'roosterjs-content-model-dom/lib/domToModel/context/createDomToModelContext';
import * as createModelToDomContext from 'roosterjs-content-model-dom/lib/modelToDom/context/createModelToDomContext';
import * as domToContentModel from 'roosterjs-content-model-dom/lib/domToModel/domToContentModel';
import ContentModelEditor from '../../lib/editor/ContentModelEditor';
import { ContentModelDocument, EditorContext } from 'roosterjs-content-model-types';
import { EditorPlugin, PluginEventType } from 'roosterjs-editor-types';

const editorContext: EditorContext = {
    isDarkMode: false,
    darkColorHandler: undefined,
};

describe('ContentModelEditor', () => {
    it('domToContentModel', () => {
        const mockedResult = 'Result' as any;
        const mockedContext = 'MockedContext' as any;
        const mockedConfig = 'MockedConfig' as any;

        spyOn(domToContentModel, 'domToContentModel').and.returnValue(mockedResult);
        spyOn(createDomToModelContext, 'createDomToModelContextWithConfig').and.returnValue(
            mockedContext
        );
        spyOn(createDomToModelContext, 'createDomToModelConfig').and.returnValue(mockedConfig);

        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);

        spyOn((editor as any).core.api, 'createEditorContext').and.returnValue(editorContext);

        const model = editor.createContentModel();

        expect(model).toBe(mockedResult);
        expect(domToContentModel.domToContentModel).toHaveBeenCalledTimes(1);
        expect(domToContentModel.domToContentModel).toHaveBeenCalledWith(
            div,
            mockedContext,
            undefined
        );
        expect(createDomToModelContext.createDomToModelContextWithConfig).toHaveBeenCalledWith(
            mockedConfig,
            editorContext
        );
    });

    it('domToContentModel, with Reuse Content Model do not add disableCacheElement option', () => {
        const mockedResult = 'Result' as any;
        const mockedContext = 'MockedContext' as any;
        const mockedConfig = 'MockedConfig' as any;

        spyOn(domToContentModel, 'domToContentModel').and.returnValue(mockedResult);
        spyOn(createDomToModelContext, 'createDomToModelContextWithConfig').and.returnValue(
            mockedContext
        );
        spyOn(createDomToModelContext, 'createDomToModelConfig').and.returnValue(mockedConfig);

        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);

        spyOn((editor as any).core.api, 'createEditorContext').and.returnValue(editorContext);

        const model = editor.createContentModel();

        expect(model).toBe(mockedResult);
        expect(domToContentModel.domToContentModel).toHaveBeenCalledTimes(1);
        expect(domToContentModel.domToContentModel).toHaveBeenCalledWith(
            div,
            mockedContext,
            undefined
        );
        expect(createDomToModelContext.createDomToModelContextWithConfig).toHaveBeenCalledWith(
            mockedConfig,
            editorContext
        );
    });

    it('setContentModel with normal selection', () => {
        const mockedRange = {
            type: 'range',
            range: document.createRange(),
        } as any;
        const mockedModel = 'MockedModel' as any;
        const mockedContext = 'MockedContext' as any;
        const mockedConfig = 'MockedConfig' as any;

        spyOn(contentModelToDom, 'contentModelToDom').and.returnValue(mockedRange);
        spyOn(createModelToDomContext, 'createModelToDomContextWithConfig').and.returnValue(
            mockedContext
        );
        spyOn(createModelToDomContext, 'createModelToDomConfig').and.returnValue(mockedConfig);

        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);

        spyOn((editor as any).core.api, 'createEditorContext').and.returnValue(editorContext);

        const selection = editor.setContentModel(mockedModel);

        expect(contentModelToDom.contentModelToDom).toHaveBeenCalledTimes(1);
        expect(contentModelToDom.contentModelToDom).toHaveBeenCalledWith(
            document,
            div,
            mockedModel,
            mockedContext,
            undefined
        );
        expect(createModelToDomContext.createModelToDomContextWithConfig).toHaveBeenCalledWith(
            mockedConfig,
            editorContext
        );
        expect(selection).toBe(mockedRange);
    });

    it('setContentModel', () => {
        const mockedRange = {
            type: 'range',
            range: document.createRange(),
        } as any;
        const mockedModel = 'MockedModel' as any;
        const mockedContext = 'MockedContext' as any;
        const mockedConfig = 'MockedConfig' as any;

        spyOn(contentModelToDom, 'contentModelToDom').and.returnValue(mockedRange);
        spyOn(createModelToDomContext, 'createModelToDomContextWithConfig').and.returnValue(
            mockedContext
        );
        spyOn(createModelToDomContext, 'createModelToDomConfig').and.returnValue(mockedConfig);

        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);

        spyOn((editor as any).core.api, 'createEditorContext').and.returnValue(editorContext);

        const selection = editor.setContentModel(mockedModel);

        expect(contentModelToDom.contentModelToDom).toHaveBeenCalledTimes(1);
        expect(contentModelToDom.contentModelToDom).toHaveBeenCalledWith(
            document,
            div,
            mockedModel,
            mockedContext,
            undefined
        );
        expect(createModelToDomContext.createModelToDomContextWithConfig).toHaveBeenCalledWith(
            mockedConfig,
            editorContext
        );
        expect(selection).toBe(mockedRange);
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
            format: {
                fontWeight: undefined,
                italic: undefined,
                underline: undefined,
                fontFamily: undefined,
                fontSize: undefined,
                textColor: undefined,
                backgroundColor: undefined,
            },
        });
    });

    it('get model with cache', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);
        const cachedModel = 'MODEL' as any;

        (editor as any).core.cache.cachedModel = cachedModel;

        spyOn(domToContentModel, 'domToContentModel');

        const model = editor.createContentModel();

        expect(model).toBe(cachedModel);
        expect(domToContentModel.domToContentModel).not.toHaveBeenCalled();
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

    it('dispose', () => {
        const div = document.createElement('div');
        div.style.fontFamily = 'Arial';

        const editor = new ContentModelEditor(div);

        expect(div.style.fontFamily).toBe('Arial');

        editor.dispose();

        expect(div.style.fontFamily).toBe('Arial');
    });
});
