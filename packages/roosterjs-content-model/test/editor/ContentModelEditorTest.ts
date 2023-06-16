import * as contentModelToDom from '../../lib/modelToDom/contentModelToDom';
import * as domToContentModel from '../../lib/domToModel/domToContentModel';
import ContentModelEditor from '../../lib/editor/ContentModelEditor';
import { ContentModelDocument } from '../../lib/publicTypes/group/ContentModelDocument';
import { EditorContext } from '../../lib/publicTypes/context/EditorContext';
import { tablePreProcessor } from '../../lib/domToModel/processors/tablePreProcessor';
import {
    EditorPlugin,
    ExperimentalFeatures,
    PluginEventType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

const editorContext: EditorContext = {
    isDarkMode: false,
    darkColorHandler: undefined,
};

describe('ContentModelEditor', () => {
    it('domToContentModel', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);

        const mockedResult = 'Result' as any;

        spyOn((editor as any).core.api, 'createEditorContext').and.returnValue(editorContext);
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
            processorOverride: {
                table: tablePreProcessor,
            },
            disableCacheElement: true,
        });
    });

    it('domToContentModel, with Reuse Content Model dont add disableCacheElement option', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div, {
            experimentalFeatures: [ExperimentalFeatures.ReusableContentModel],
        });

        const mockedResult = 'Result' as any;

        spyOn((editor as any).core.api, 'createEditorContext').and.returnValue(editorContext);
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
            processorOverride: {
                table: tablePreProcessor,
            },
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

        spyOn((editor as any).core.api, 'createEditorContext').and.returnValue(editorContext);
        spyOn(contentModelToDom, 'default').and.returnValue(mockedResult);

        editor.setContentModel(mockedModel);

        expect(contentModelToDom.default).toHaveBeenCalledTimes(1);
        expect(contentModelToDom.default).toHaveBeenCalledWith(
            document,
            div,
            mockedModel,
            editorContext,
            {}
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

        spyOn((editor as any).core.api, 'createEditorContext').and.returnValue(editorContext);
        spyOn(contentModelToDom, 'default').and.returnValue(mockedResult);

        editor.setContentModel(mockedModel);

        expect(contentModelToDom.default).toHaveBeenCalledTimes(1);
        expect(contentModelToDom.default).toHaveBeenCalledWith(
            document,
            div,
            mockedModel,
            editorContext,
            {}
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
        const editor = new ContentModelEditor(div, {
            experimentalFeatures: [ExperimentalFeatures.ReusableContentModel],
        });
        const cachedModel = 'MODEL' as any;

        (editor as any).core.cachedModel = cachedModel;

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
