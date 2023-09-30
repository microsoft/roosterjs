import * as ContentModelCachePlugin from '../../lib/editor/corePlugins/ContentModelCachePlugin';
import * as ContentModelEditPlugin from '../../lib/editor/corePlugins/ContentModelEditPlugin';
import * as ContentModelFormatPlugin from '../../lib/editor/corePlugins/ContentModelFormatPlugin';
import * as createDomToModelContext from 'roosterjs-content-model-dom/lib/domToModel/context/createDomToModelContext';
import * as createEditorCore from 'roosterjs-editor-core/lib/editor/createEditorCore';
import * as createModelToDomContext from 'roosterjs-content-model-dom/lib/modelToDom/context/createModelToDomContext';
import ContentModelTypeInContainerPlugin from '../../lib/editor/corePlugins/ContentModelTypeInContainerPlugin';
import { contentModelDomIndexer } from '../../lib/editor/utils/contentModelDomIndexer';
import { ContentModelEditorOptions } from '../../lib/publicTypes/IContentModelEditor';
import { createContentModel } from '../../lib/editor/coreApi/createContentModel';
import { createContentModelEditorCore } from '../../lib/editor/createContentModelEditorCore';
import { createEditorContext } from '../../lib/editor/coreApi/createEditorContext';
import { getDOMSelection } from '../../lib/editor/coreApi/getDOMSelection';
import { setContentModel } from '../../lib/editor/coreApi/setContentModel';
import { setDOMSelection } from '../../lib/editor/coreApi/setDOMSelection';
import { switchShadowEdit } from '../../lib/editor/coreApi/switchShadowEdit';
import { tablePreProcessor } from '../../lib/editor/overrides/tablePreProcessor';

const mockedSwitchShadowEdit = 'SHADOWEDIT' as any;
const mockedDomToModelConfig = {
    config: 'mockedDomToModelConfig',
} as any;
const mockedModelToDomConfig = {
    config: 'mockedModelToDomConfig',
} as any;
const mockedFormatPlugin = 'FORMATPLUGIN' as any;
const mockedEditPlugin = 'EDITPLUGIN' as any;
const mockedCachePlugin = 'CACHPLUGIN' as any;

describe('createContentModelEditorCore', () => {
    let createEditorCoreSpy: jasmine.Spy;
    let mockedCore: any;
    let contentDiv: any;

    let copyPastePlugin = 'copyPastePlugin' as any;

    beforeEach(() => {
        contentDiv = {
            style: {},
        } as any;

        mockedCore = {
            lifecycle: {
                experimentalFeatures: [],
            },
            api: {
                switchShadowEdit: mockedSwitchShadowEdit,
            },
            originalApi: {
                a: 'b',
            },
            contentDiv,
        } as any;

        createEditorCoreSpy = spyOn(createEditorCore, 'createEditorCore').and.returnValue(
            mockedCore
        );
        spyOn(ContentModelFormatPlugin, 'createContentModelFormatPlugin').and.returnValue(
            mockedFormatPlugin
        );
        spyOn(ContentModelEditPlugin, 'createContentModelEditPlugin').and.returnValue(
            mockedEditPlugin
        );
        spyOn(ContentModelCachePlugin, 'createContentModelCachePlugin').and.returnValue(
            mockedCachePlugin
        );

        spyOn(createDomToModelContext, 'createDomToModelConfig').and.returnValue(
            mockedDomToModelConfig
        );
        spyOn(createModelToDomContext, 'createModelToDomConfig').and.returnValue(
            mockedModelToDomConfig
        );
    });

    it('No additional option', () => {
        const options = {
            corePluginOverride: {
                copyPaste: copyPastePlugin,
            },
        };
        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, {
            plugins: [mockedCachePlugin, mockedFormatPlugin, mockedEditPlugin],
            corePluginOverride: {
                typeInContainer: new ContentModelTypeInContainerPlugin(),
                copyPaste: copyPastePlugin,
            },
        });
        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [],
            },
            api: {
                switchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                getDOMSelection,
                setDOMSelection,
            },
            originalApi: {
                a: 'b',
                createEditorContext,
                createContentModel,
                setContentModel,
                getDOMSelection,
                setDOMSelection,
            },
            defaultDomToModelOptions: [
                { processorOverride: { table: tablePreProcessor } },
                undefined,
            ],
            defaultModelToDomOptions: [undefined],
            defaultDomToModelConfig: mockedDomToModelConfig,
            defaultModelToDomConfig: mockedModelToDomConfig,
            format: {
                defaultFormat: {
                    fontWeight: undefined,
                    italic: undefined,
                    underline: undefined,
                    fontFamily: undefined,
                    fontSize: undefined,
                    textColor: undefined,
                    backgroundColor: undefined,
                },
            },
            contentDiv: {
                style: {},
            },
            cache: { domIndexer: undefined },
            copyPaste: { allowedCustomPasteType: [] },
        } as any);
    });

    it('With additional option', () => {
        const defaultDomToModelOptions = { a: '1' } as any;
        const defaultModelToDomOptions = { b: '2' } as any;

        const options = {
            defaultDomToModelOptions,
            defaultModelToDomOptions,
            corePluginOverride: {
                copyPaste: copyPastePlugin,
            },
        };
        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, {
            defaultDomToModelOptions,
            defaultModelToDomOptions,
            plugins: [mockedCachePlugin, mockedFormatPlugin, mockedEditPlugin],
            corePluginOverride: {
                typeInContainer: new ContentModelTypeInContainerPlugin(),
                copyPaste: copyPastePlugin,
            },
        });

        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [],
            },
            api: {
                switchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                getDOMSelection,
                setDOMSelection,
            },
            originalApi: {
                a: 'b',
                createEditorContext,
                createContentModel,
                setContentModel,
                getDOMSelection,
                setDOMSelection,
            },
            defaultDomToModelOptions: [
                { processorOverride: { table: tablePreProcessor } },
                defaultDomToModelOptions,
            ],
            defaultModelToDomOptions: [defaultModelToDomOptions],
            defaultDomToModelConfig: mockedDomToModelConfig,
            defaultModelToDomConfig: mockedModelToDomConfig,
            format: {
                defaultFormat: {
                    fontWeight: undefined,
                    italic: undefined,
                    underline: undefined,
                    fontFamily: undefined,
                    fontSize: undefined,
                    textColor: undefined,
                    backgroundColor: undefined,
                },
            },
            contentDiv: {
                style: {},
            },
            cache: {
                domIndexer: undefined,
            },
            copyPaste: { allowedCustomPasteType: [] },
        } as any);
    });

    it('With default format', () => {
        const options = {
            corePluginOverride: {
                copyPaste: copyPastePlugin,
            },
            defaultFormat: {
                bold: true,
                italic: true,
                underline: true,
                fontFamily: 'Arial',
                fontSize: '10pt',
                textColor: 'red',
                backgroundColor: 'blue',
            },
        };

        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, {
            plugins: [mockedCachePlugin, mockedFormatPlugin, mockedEditPlugin],
            corePluginOverride: {
                typeInContainer: new ContentModelTypeInContainerPlugin(),
                copyPaste: copyPastePlugin,
            },
            defaultFormat: {
                bold: true,
                italic: true,
                underline: true,
                fontFamily: 'Arial',
                fontSize: '10pt',
                textColor: 'red',
                backgroundColor: 'blue',
            },
        });
        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [],
            },
            api: {
                switchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                getDOMSelection,
                setDOMSelection,
            },
            originalApi: {
                a: 'b',
                createEditorContext,
                createContentModel,
                setContentModel,
                getDOMSelection,
                setDOMSelection,
            },
            defaultDomToModelOptions: [
                { processorOverride: { table: tablePreProcessor } },
                undefined,
            ],
            defaultModelToDomOptions: [undefined],
            defaultDomToModelConfig: mockedDomToModelConfig,
            defaultModelToDomConfig: mockedModelToDomConfig,
            format: {
                defaultFormat: {
                    fontWeight: 'bold',
                    italic: true,
                    underline: true,
                    fontFamily: 'Arial',
                    fontSize: '10pt',
                    textColor: 'red',
                    backgroundColor: 'blue',
                },
            },
            contentDiv: {
                style: {},
            },
            cache: { domIndexer: undefined },
            copyPaste: { allowedCustomPasteType: [] },
        } as any);
    });

    it('Reuse model', () => {
        const options = {
            corePluginOverride: {
                copyPaste: copyPastePlugin,
            },
        };

        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, {
            plugins: [mockedCachePlugin, mockedFormatPlugin, mockedEditPlugin],
            corePluginOverride: {
                typeInContainer: new ContentModelTypeInContainerPlugin(),
                copyPaste: copyPastePlugin,
            },
        });
        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [],
            },
            api: {
                switchShadowEdit: switchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                getDOMSelection,
                setDOMSelection,
            },
            originalApi: {
                a: 'b',
                createEditorContext,
                createContentModel,
                setContentModel,
                getDOMSelection,
                setDOMSelection,
            },
            defaultDomToModelOptions: [
                { processorOverride: { table: tablePreProcessor } },
                undefined,
            ],
            defaultModelToDomOptions: [undefined],
            format: {
                defaultFormat: {
                    fontWeight: undefined,
                    italic: undefined,
                    underline: undefined,
                    fontFamily: undefined,
                    fontSize: undefined,
                    textColor: undefined,
                    backgroundColor: undefined,
                },
            },
            defaultDomToModelConfig: mockedDomToModelConfig,
            defaultModelToDomConfig: mockedModelToDomConfig,

            contentDiv: {
                style: {},
            },
            cache: { domIndexer: undefined },
            copyPaste: { allowedCustomPasteType: [] },
        } as any);
    });

    it('Allow dom indexer', () => {
        const options: ContentModelEditorOptions = {
            corePluginOverride: {
                copyPaste: copyPastePlugin,
            },
            cacheModel: true,
        };

        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, {
            plugins: [mockedCachePlugin, mockedFormatPlugin, mockedEditPlugin],
            corePluginOverride: {
                typeInContainer: new ContentModelTypeInContainerPlugin(),
                copyPaste: copyPastePlugin,
            },
            cacheModel: true,
        });
        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [],
            },
            api: {
                switchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                getDOMSelection,
                setDOMSelection,
            },
            originalApi: {
                a: 'b',
                createEditorContext,
                createContentModel,
                setContentModel,
                getDOMSelection,
                setDOMSelection,
            },
            defaultDomToModelOptions: [
                { processorOverride: { table: tablePreProcessor } },
                undefined,
            ],
            defaultModelToDomOptions: [undefined],
            defaultDomToModelConfig: mockedDomToModelConfig,
            defaultModelToDomConfig: mockedModelToDomConfig,
            format: {
                defaultFormat: {
                    fontWeight: undefined,
                    italic: undefined,
                    underline: undefined,
                    fontFamily: undefined,
                    fontSize: undefined,
                    textColor: undefined,
                    backgroundColor: undefined,
                },
            },
            contentDiv: {
                style: {},
            },
            cache: { domIndexer: contentModelDomIndexer },
            copyPaste: { allowedCustomPasteType: [] },
        } as any);
    });
});
