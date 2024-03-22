import * as createDomToModelContext from 'roosterjs-content-model-dom/lib/domToModel/context/createDomToModelContext';
import * as domToContentModel from 'roosterjs-content-model-dom/lib/domToModel/domToContentModel';
import * as findAllEntities from 'roosterjs-content-model-core/lib/corePlugin/entity/findAllEntities';
import { ContentModelDocument, EditorContext, EditorCore } from 'roosterjs-content-model-types';
import { EditorAdapter } from '../../lib/editor/EditorAdapter';
import { EditorPlugin, PluginEventType } from 'roosterjs-editor-types';

const editorContext: EditorContext = {
    isDarkMode: false,
};

describe('EditorAdapter', () => {
    it('domToContentModel', () => {
        const mockedResult = 'Result' as any;
        const mockedContext = 'MockedContext' as any;
        const mockedConfig = 'MockedConfig' as any;

        spyOn(domToContentModel, 'domToContentModel').and.returnValue(mockedResult);
        spyOn(createDomToModelContext, 'createDomToModelContextWithConfig').and.returnValue(
            mockedContext
        );
        spyOn(createDomToModelContext, 'createDomToModelConfig').and.returnValue(mockedConfig);
        spyOn(findAllEntities, 'findAllEntities');

        const div = document.createElement('div');
        const editor = new EditorAdapter(div, {
            coreApiOverride: {
                createEditorContext: jasmine
                    .createSpy('createEditorContext')
                    .and.returnValue(editorContext),
                setContentModel: jasmine.createSpy('setContentModel'),
            },
        });

        const model = editor.getContentModelCopy('connected');

        expect(model).toBe(mockedResult);
        expect(domToContentModel.domToContentModel).toHaveBeenCalledTimes(1);
        expect(domToContentModel.domToContentModel).toHaveBeenCalledWith(div, mockedContext);
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
        spyOn(findAllEntities, 'findAllEntities');

        const div = document.createElement('div');
        const editor = new EditorAdapter(div, {
            coreApiOverride: {
                createEditorContext: jasmine
                    .createSpy('createEditorContext')
                    .and.returnValue(editorContext),
                setContentModel: jasmine.createSpy('setContentModel'),
            },
        });

        const model = editor.getContentModelCopy('connected');

        expect(model).toBe(mockedResult);
        expect(domToContentModel.domToContentModel).toHaveBeenCalledTimes(1);
        expect(domToContentModel.domToContentModel).toHaveBeenCalledWith(div, mockedContext);
        expect(createDomToModelContext.createDomToModelContextWithConfig).toHaveBeenCalledWith(
            mockedConfig,
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
                    model = pluginEditor.getContentModelCopy('connected');
                }
            },
        };
        const editor = new EditorAdapter(div, {
            legacyPlugins: [plugin],
            disableCache: true,
        });
        editor.dispose();

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    cachedElement: jasmine.anything(),
                },
            ],
        });
    });

    it('get model with cache', () => {
        const div = document.createElement('div');
        const editor = new EditorAdapter(div);
        const cachedModel = 'MODEL' as any;

        (editor as any).core.cache.cachedModel = cachedModel;

        spyOn(domToContentModel, 'domToContentModel');

        const model = editor.getContentModelCopy('connected');

        expect(model).toBe(cachedModel);
        expect(domToContentModel.domToContentModel).not.toHaveBeenCalled();
    });

    it('formatContentModel', () => {
        const div = document.createElement('div');
        const editor = new EditorAdapter(div);
        const core = (editor as any).core;
        const formatContentModelSpy = spyOn(core.api, 'formatContentModel');
        const callback = jasmine.createSpy('callback');
        const options = 'Options' as any;

        editor.formatContentModel(callback, options);

        expect(formatContentModelSpy).toHaveBeenCalledWith(core, callback, options);
    });

    it('default format', () => {
        const div = document.createElement('div');
        const editor = new EditorAdapter(div, {
            defaultSegmentFormat: {
                fontWeight: 'bold',
                italic: true,
                underline: true,
                fontFamily: 'Arial',
                fontSize: '10pt',
                textColor: 'black',
                backgroundColor: 'white',
            },
        });

        const model = editor.getContentModelCopy('connected');

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

    it('getPendingFormat', () => {
        const div = document.createElement('div');
        const editor = new EditorAdapter(div);
        const core: EditorCore = (editor as any).core;
        const mockedFormat = 'FORMAT' as any;

        expect(editor.getPendingFormat()).toBeNull();

        core.format.pendingFormat = {
            format: mockedFormat,
        } as any;

        expect(editor.getPendingFormat()).toEqual(mockedFormat);
    });

    it('dispose', () => {
        const div = document.createElement('div');
        div.style.fontFamily = 'Arial';

        const editor = new EditorAdapter(div);

        expect(div.style.fontFamily).toBe('Arial');

        editor.dispose();

        expect(div.style.fontFamily).toBe('Arial');
    });
});
