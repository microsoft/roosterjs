import * as createEditorCore from 'roosterjs-editor-core/lib/editor/createEditorCore';
import * as isFeatureEnabled from 'roosterjs-editor-core/lib/editor/isFeatureEnabled';
import ContentModelEditPlugin from '../../lib/editor/plugins/ContentModelEditPlugin';
import ContentModelFormatPlugin from '../../lib/editor/plugins/ContentModelFormatPlugin';
import ContentModelTypeInContainerPlugin from '../../lib/editor/corePlugins/ContentModelTypeInContainerPlugin';
import { ContentModelCachePlugin } from '../../lib/editor/corePlugins/ContentModelCachePlugin';
import { createContentModel } from '../../lib/editor/coreApi/createContentModel';
import { createContentModelEditorCore } from '../../lib/editor/createContentModelEditorCore';
import { createEditorContext } from '../../lib/editor/coreApi/createEditorContext';
import { ExperimentalFeatures } from 'roosterjs-editor-types';
import { getSelectionRangeEx } from '../../lib/editor/coreApi/getSelectionRangeEx';
import { setContentModel } from '../../lib/editor/coreApi/setContentModel';
import { switchShadowEdit } from '../../lib/editor/coreApi/switchShadowEdit';

const mockedSwitchShadowEdit = 'SHADOWEDIT' as any;

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
            defaultDomToModelOptions: {},
            defaultModelToDomOptions: {},
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
            defaultDomToModelOptions,
            defaultModelToDomOptions,
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
            plugins: [
                new ContentModelCachePlugin(),
                new ContentModelFormatPlugin(),
                new ContentModelEditPlugin(),
            ],
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
            defaultDomToModelOptions: {},
            defaultModelToDomOptions: {},
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
            defaultDomToModelOptions: {},
            defaultModelToDomOptions: {},
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
            defaultDomToModelOptions: {},
            defaultModelToDomOptions: {},
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
