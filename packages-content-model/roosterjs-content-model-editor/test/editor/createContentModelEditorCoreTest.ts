import * as buildBaseHandlerMap from 'roosterjs-content-model-dom/lib/modelToDom/context/buildBaseHandlerMap';
import * as buildBaseProcessorMap from 'roosterjs-content-model-dom/lib/domToModel/context/buildBaseProcessorMap';
import * as createEditorCore from 'roosterjs-editor-core/lib/editor/createEditorCore';
import * as isFeatureEnabled from 'roosterjs-editor-core/lib/editor/isFeatureEnabled';
import ContentModelEditPlugin from '../../lib/editor/plugins/ContentModelEditPlugin';
import ContentModelFormatPlugin from '../../lib/editor/plugins/ContentModelFormatPlugin';
import ContentModelTypeInContainerPlugin from '../../lib/editor/corePlugins/ContentModelTypeInContainerPlugin';
import { ContentModelEditorOptions } from '../../lib/publicTypes/IContentModelEditor';
import { createContentModel } from '../../lib/editor/coreApi/createContentModel';
import { createContentModelEditorCore } from '../../lib/editor/createContentModelEditorCore';
import { createEditorContext } from '../../lib/editor/coreApi/createEditorContext';
import { ExperimentalFeatures } from 'roosterjs-editor-types';
import { getSelectionRangeEx } from '../../lib/editor/coreApi/getSelectionRangeEx';
import { setContentModel } from '../../lib/editor/coreApi/setContentModel';
import { switchShadowEdit } from '../../lib/editor/coreApi/switchShadowEdit';

const mockedSwitchShadowEdit = 'SHADOWEDIT' as any;
const mockedProcessorMap = 'PROCESSORMAP' as any;
const mockedHandlerMap = 'HANDLERMAP' as any;

describe('createContentModelEditorCore', () => {
    let createEditorCoreSpy: jasmine.Spy;
    let mockedCore: any;
    let contentDiv: any;

    let copyPastePlugin = 'copyPastePlugin' as any;

    beforeEach(() => {
        spyOn(buildBaseProcessorMap, 'buildBaseProcessorMap').and.returnValue(mockedProcessorMap);
        spyOn(buildBaseHandlerMap, 'buildBaseHandlerMap').and.returnValue(mockedHandlerMap);

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
    });

    it('No additional option', () => {
        const options = {
            corePluginOverride: {
                copyPaste: copyPastePlugin,
            },
        };
        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, {
            plugins: [new ContentModelFormatPlugin(), new ContentModelEditPlugin()],
            corePluginOverride: {
                typeInContainer: new ContentModelTypeInContainerPlugin(),
                copyPaste: copyPastePlugin,
            },
        });
        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [],
                defaultFormat: {},
            },
            api: {
                switchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                getSelectionRangeEx,
            },
            originalApi: {
                a: 'b',
                createEditorContext,
                createContentModel,
                setContentModel,
            },
            formatParserOverride: undefined,
            additionalFormatParsers: undefined,
            formatApplierOverride: undefined,
            additionalFormatAppliers: undefined,
            baseProcessorMap: mockedProcessorMap,
            baseHandlerMap: mockedHandlerMap,
            defaultFormat: {
                fontWeight: undefined,
                italic: undefined,
                underline: undefined,
                fontFamily: undefined,
                fontSize: undefined,
                textColor: undefined,
                backgroundColor: undefined,
            },
            addDelimiterForEntity: false,
            contentDiv: {
                style: {},
            },
        } as any);
    });

    it('With additional option', () => {
        const processorOverride = { a: '1' } as any;
        const modelHandlerOverride = { b: '2' } as any;

        const options: ContentModelEditorOptions = {
            defaultDomToModelOptions: { processorOverride },
            defaultModelToDomOptions: { modelHandlerOverride },
            corePluginOverride: {
                copyPaste: copyPastePlugin,
            },
        };
        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, {
            defaultDomToModelOptions: { processorOverride },
            defaultModelToDomOptions: { modelHandlerOverride },
            plugins: [new ContentModelFormatPlugin(), new ContentModelEditPlugin()],
            corePluginOverride: {
                typeInContainer: new ContentModelTypeInContainerPlugin(),
                copyPaste: copyPastePlugin,
            },
        });

        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [],
                defaultFormat: {},
            },
            api: {
                switchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                getSelectionRangeEx,
            },
            originalApi: {
                a: 'b',
                createEditorContext,
                createContentModel,
                setContentModel,
            },
            formatParserOverride: undefined,
            additionalFormatParsers: undefined,
            formatApplierOverride: undefined,
            additionalFormatAppliers: undefined,
            baseProcessorMap: mockedProcessorMap,
            baseHandlerMap: mockedHandlerMap,
            defaultFormat: {
                fontWeight: undefined,
                italic: undefined,
                underline: undefined,
                fontFamily: undefined,
                fontSize: undefined,
                textColor: undefined,
                backgroundColor: undefined,
            },
            addDelimiterForEntity: false,
            contentDiv: {
                style: {},
            },
        } as any);
    });

    it('With default format', () => {
        mockedCore.lifecycle.defaultFormat = {
            bold: true,
            italic: true,
            underline: true,
            fontFamily: 'Arial',
            fontSize: '10pt',
            textColor: 'red',
            backgroundColor: 'blue',
        };

        const options = {
            corePluginOverride: {
                copyPaste: copyPastePlugin,
            },
        };

        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, {
            plugins: [new ContentModelFormatPlugin(), new ContentModelEditPlugin()],
            corePluginOverride: {
                typeInContainer: new ContentModelTypeInContainerPlugin(),
                copyPaste: copyPastePlugin,
            },
        });
        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [],
                defaultFormat: {
                    bold: true,
                    italic: true,
                    underline: true,
                    fontFamily: 'Arial',
                    fontSize: '10pt',
                    textColor: 'red',
                    backgroundColor: 'blue',
                },
            },
            api: {
                switchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                getSelectionRangeEx,
            },
            originalApi: {
                a: 'b',
                createEditorContext,
                createContentModel,
                setContentModel,
            },
            formatParserOverride: undefined,
            additionalFormatParsers: undefined,
            formatApplierOverride: undefined,
            additionalFormatAppliers: undefined,
            baseProcessorMap: mockedProcessorMap,
            baseHandlerMap: mockedHandlerMap,
            defaultFormat: {
                fontWeight: 'bold',
                italic: true,
                underline: true,
                fontFamily: 'Arial',
                fontSize: '10pt',
                textColor: 'red',
                backgroundColor: 'blue',
            },
            addDelimiterForEntity: false,
            contentDiv: {
                style: {},
            },
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
            plugins: [new ContentModelFormatPlugin(), new ContentModelEditPlugin()],
            corePluginOverride: {
                typeInContainer: new ContentModelTypeInContainerPlugin(),
                copyPaste: copyPastePlugin,
            },
        });
        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [],
                defaultFormat: {},
            },
            api: {
                switchShadowEdit: switchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                getSelectionRangeEx,
            },
            originalApi: {
                a: 'b',
                createEditorContext,
                createContentModel,
                setContentModel,
            },
            formatParserOverride: undefined,
            additionalFormatParsers: undefined,
            formatApplierOverride: undefined,
            additionalFormatAppliers: undefined,
            baseProcessorMap: mockedProcessorMap,
            baseHandlerMap: mockedHandlerMap,
            defaultFormat: {
                fontWeight: undefined,
                italic: undefined,
                underline: undefined,
                fontFamily: undefined,
                fontSize: undefined,
                textColor: undefined,
                backgroundColor: undefined,
            },
            addDelimiterForEntity: false,
            contentDiv: {
                style: {},
            },
        } as any);
    });

    it('Allow entity delimiters', () => {
        mockedCore.lifecycle.experimentalFeatures.push(
            ExperimentalFeatures.InlineEntityReadOnlyDelimiters
        );

        const options = {
            corePluginOverride: {
                copyPaste: copyPastePlugin,
            },
        };

        spyOn(isFeatureEnabled, 'isFeatureEnabled').and.callFake(
            (features, feature) => feature == ExperimentalFeatures.InlineEntityReadOnlyDelimiters
        );

        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, {
            plugins: [new ContentModelFormatPlugin(), new ContentModelEditPlugin()],
            corePluginOverride: {
                typeInContainer: new ContentModelTypeInContainerPlugin(),
                copyPaste: copyPastePlugin,
            },
        });
        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [ExperimentalFeatures.InlineEntityReadOnlyDelimiters],
                defaultFormat: {},
            },
            api: {
                switchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                getSelectionRangeEx,
            },
            originalApi: {
                a: 'b',
                createEditorContext,
                createContentModel,
                setContentModel,
            },
            formatParserOverride: undefined,
            additionalFormatParsers: undefined,
            formatApplierOverride: undefined,
            additionalFormatAppliers: undefined,
            baseProcessorMap: mockedProcessorMap,
            baseHandlerMap: mockedHandlerMap,
            defaultFormat: {
                fontWeight: undefined,
                italic: undefined,
                underline: undefined,
                fontFamily: undefined,
                fontSize: undefined,
                textColor: undefined,
                backgroundColor: undefined,
            },
            addDelimiterForEntity: true,
            contentDiv: {
                style: {},
            },
        } as any);
    });
});
