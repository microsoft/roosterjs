import * as buildBaseHandlerMap from 'roosterjs-content-model-dom/lib/modelToDom/context/buildBaseHandlerMap';
import * as buildBaseProcessorMap from 'roosterjs-content-model-dom/lib/domToModel/context/buildBaseProcessorMap';
import * as contentModelToDom from 'roosterjs-content-model-dom/lib/modelToDom/contentModelToDom';
import * as createDomToModelContext from 'roosterjs-content-model-dom/lib/domToModel/context/createDomToModelContext';
import * as createModelToDomContext from 'roosterjs-content-model-dom/lib/modelToDom/context/createModelToDomContext';
import * as domToContentModel from 'roosterjs-content-model-dom/lib/domToModel/domToContentModel';
import ContentModelEditor from '../../lib/editor/ContentModelEditor';
import { ContentModelDocument, EditorContext } from 'roosterjs-content-model-types';
import { EditorPlugin, PluginEventType, SelectionRangeTypes } from 'roosterjs-editor-types';
import { tablePreProcessor } from '../../lib/editor/overrides/tablePreProcessor';

const editorContext: EditorContext = {
    isDarkMode: false,
    darkColorHandler: undefined,
};

describe('ContentModelEditor', () => {
    it('domToContentModel', () => {
        const mockedResult = 'Result' as any;
        const mockedContext = 'MockedContext' as any;
        const mockedBaseProcessor = 'Processors' as any;

        spyOn(domToContentModel, 'domToContentModel').and.returnValue(mockedResult);
        spyOn(createDomToModelContext, 'createDomToModelContext').and.returnValue(mockedContext);
        spyOn(buildBaseProcessorMap, 'buildBaseProcessorMap').and.returnValue(mockedBaseProcessor);

        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);

        spyOn((editor as any).core.api, 'createEditorContext').and.returnValue(editorContext);

        const model = editor.createContentModel();

        expect(model).toBe(mockedResult);
        expect(domToContentModel.domToContentModel).toHaveBeenCalledTimes(1);
        expect(domToContentModel.domToContentModel).toHaveBeenCalledWith(div, mockedContext);
        expect(buildBaseProcessorMap.buildBaseProcessorMap).toHaveBeenCalledWith(
            {
                table: tablePreProcessor,
            },
            undefined
        );
        expect(createDomToModelContext.createDomToModelContext).toHaveBeenCalledWith(
            undefined,
            {},
            [undefined, undefined],
            mockedBaseProcessor,
            {
                type: SelectionRangeTypes.Normal,
                ranges: [],
                areAllCollapsed: true,
            },
            editorContext
        );
    });

    it('domToContentModel, with Reuse Content Model do not add disableCacheElement option', () => {
        const div = document.createElement('div');

        const mockedResult = 'Result' as any;
        const mockedContext = 'MockedContext' as any;
        const mockedBaseProcessor = 'Processors' as any;

        spyOn(buildBaseProcessorMap, 'buildBaseProcessorMap').and.returnValue(mockedBaseProcessor);

        const editor = new ContentModelEditor(div);

        spyOn((editor as any).core.api, 'createEditorContext').and.returnValue(editorContext);
        spyOn(domToContentModel, 'domToContentModel').and.returnValue(mockedResult);
        spyOn(createDomToModelContext, 'createDomToModelContext').and.returnValue(mockedContext);

        const model = editor.createContentModel();

        expect(model).toBe(mockedResult);
        expect(domToContentModel.domToContentModel).toHaveBeenCalledTimes(1);
        expect(domToContentModel.domToContentModel).toHaveBeenCalledWith(div, mockedContext);
        expect(createDomToModelContext.createDomToModelContext).toHaveBeenCalledWith(
            undefined,
            {},
            [undefined, undefined],
            mockedBaseProcessor,
            {
                type: SelectionRangeTypes.Normal,
                ranges: [],
                areAllCollapsed: true,
            },
            editorContext
        );
        expect(buildBaseProcessorMap.buildBaseProcessorMap).toHaveBeenCalledWith(
            {
                table: tablePreProcessor,
            },
            undefined
        );
    });

    it('setContentModel with normal selection', () => {
        const div = document.createElement('div');
        const mockedFragment = 'Fragment' as any;
        const mockedRange = {
            type: SelectionRangeTypes.Normal,
            ranges: [document.createRange()],
        } as any;
        const mockedPairs = 'Pairs' as any;

        const mockedResult = [mockedFragment, mockedRange, mockedPairs] as any;
        const mockedModel = 'MockedModel' as any;
        const mockedContext = 'MockedContext' as any;
        const mockedHandlerMap = 'Handlers' as any;

        spyOn(buildBaseHandlerMap, 'buildBaseHandlerMap').and.returnValue(mockedHandlerMap);

        const editor = new ContentModelEditor(div);

        spyOn((editor as any).core.api, 'createEditorContext').and.returnValue(editorContext);
        spyOn(contentModelToDom, 'contentModelToDom').and.returnValue(mockedResult);
        spyOn(createModelToDomContext, 'createModelToDomContext').and.returnValue(mockedContext);

        editor.setContentModel(mockedModel);

        expect(contentModelToDom.contentModelToDom).toHaveBeenCalledTimes(1);
        expect(contentModelToDom.contentModelToDom).toHaveBeenCalledWith(
            document,
            div,
            mockedModel,
            mockedContext
        );
        expect(buildBaseHandlerMap.buildBaseHandlerMap).toHaveBeenCalledWith(undefined);
        expect(createModelToDomContext.createModelToDomContext).toHaveBeenCalledWith(
            undefined,
            undefined,
            {},
            [undefined, undefined],
            mockedHandlerMap,
            editorContext
        );
    });

    it('setContentModel', () => {
        const div = document.createElement('div');
        const mockedFragment = 'Fragment' as any;
        const mockedRange = {
            type: SelectionRangeTypes.Normal,
            ranges: [document.createRange()],
        } as any;
        const mockedPairs = 'Pairs' as any;

        const mockedResult = [mockedFragment, mockedRange, mockedPairs] as any;
        const mockedModel = 'MockedModel' as any;
        const mockedContext = 'MockedContext' as any;
        const mockedHandlerMap = 'Handlers' as any;

        spyOn(buildBaseHandlerMap, 'buildBaseHandlerMap').and.returnValue(mockedHandlerMap);

        const editor = new ContentModelEditor(div);

        spyOn((editor as any).core.api, 'createEditorContext').and.returnValue(editorContext);
        spyOn(contentModelToDom, 'contentModelToDom').and.returnValue(mockedResult);
        spyOn(createModelToDomContext, 'createModelToDomContext').and.returnValue(mockedContext);

        editor.setContentModel(mockedModel);

        expect(contentModelToDom.contentModelToDom).toHaveBeenCalledTimes(1);
        expect(contentModelToDom.contentModelToDom).toHaveBeenCalledWith(
            document,
            div,
            mockedModel,
            mockedContext
        );
        expect(createModelToDomContext.createModelToDomContext).toHaveBeenCalledWith(
            undefined,
            undefined,
            {},
            [undefined, undefined],
            mockedHandlerMap,
            editorContext
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

        (editor as any).core.cachedModel = cachedModel;

        spyOn(domToContentModel, 'domToContentModel');

        const model = editor.createContentModel();

        expect(model).toBe(cachedModel);
        expect(domToContentModel.domToContentModel).not.toHaveBeenCalled();
    });

    it('cache model', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);
        const cachedModel = 'MODEL' as any;

        editor.cacheContentModel(cachedModel);

        expect((editor as any).core.cachedModel).toBe(cachedModel);

        editor.cacheContentModel(null);

        expect((editor as any).core.cachedModel).toBe(undefined);
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

    it('getContentModelDefaultFormat', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div, {
            defaultFormat: {
                fontFamily: 'Tahoma',
                fontSize: '20pt',
            },
        });
        const format = editor.getContentModelDefaultFormat();

        editor.dispose();

        expect(format).toEqual({
            fontWeight: undefined,
            italic: undefined,
            underline: undefined,
            fontFamily: 'Tahoma',
            fontSize: '20pt',
            textColor: undefined,
            backgroundColor: undefined,
        });
    });
});
