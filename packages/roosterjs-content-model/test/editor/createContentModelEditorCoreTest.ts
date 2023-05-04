import * as createEditorCore from 'roosterjs-editor-core/lib/editor/createEditorCore';
import ContentModelEditPlugin from '../../lib/editor/plugins/ContentModelEditPlugin';
import ContentModelFormatPlugin from '../../lib/editor/plugins/ContentModelFormatPlugin';
import ContentModelTypeInContainerPlugin from '../../lib/editor/corePlugins/ContentModelTypeInContainerPlugin';
import { createContentModel } from '../../lib/editor/coreApi/createContentModel';
import { createContentModelEditorCore } from '../../lib/editor/createContentModelEditorCore';
import { createEditorContext } from '../../lib/editor/coreApi/createEditorContext';
import { createPasteModel } from '../../lib/editor/coreApi/createPasteModel';
import { ExperimentalFeatures } from 'roosterjs-editor-types';
import { setContentModel } from '../../lib/editor/coreApi/setContentModel';
import { switchShadowEdit } from '../../lib/editor/coreApi/switchShadowEdit';

const mockedSwitchShadowEdit = 'SHADOWEDIT' as any;

describe('createContentModelEditorCore', () => {
    let createEditorCoreSpy: jasmine.Spy;
    let mockedCore: any;
    let contentDiv: any;

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
        const options = {};
        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, {
            plugins: [new ContentModelFormatPlugin(), new ContentModelEditPlugin()],
            corePluginOverride: {
                typeInContainer: new ContentModelTypeInContainerPlugin(),
            },
        });
        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [],
                defaultFormat: {},
            },
            api: {
                switchShadowEdit: mockedSwitchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
            },
            originalApi: {
                a: 'b',
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
            },
            defaultDomToModelOptions: {},
            defaultModelToDomOptions: {},
            defaultFormat: {
                fontWeight: undefined,
                italic: undefined,
                underline: undefined,
                fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
                fontSize: '12pt',
                textColor: undefined,
                backgroundColor: undefined,
            },
            reuseModel: false,
            addDelimiterForEntity: false,
            contentDiv: {
                style: {},
            },
            defaultFormatOnContainer: false,
            originalContainerFormat: {},
        } as any);
    });

    it('With additional option', () => {
        const defaultDomToModelOptions = { a: '1' } as any;
        const defaultModelToDomOptions = { b: '2' } as any;

        const options = { defaultDomToModelOptions, defaultModelToDomOptions };
        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, {
            defaultDomToModelOptions,
            defaultModelToDomOptions,
            plugins: [new ContentModelFormatPlugin(), new ContentModelEditPlugin()],
            corePluginOverride: {
                typeInContainer: new ContentModelTypeInContainerPlugin(),
            },
        });

        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [],
                defaultFormat: {},
            },
            api: {
                switchShadowEdit: mockedSwitchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
            },
            originalApi: {
                a: 'b',
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
            },
            defaultDomToModelOptions,
            defaultModelToDomOptions,
            defaultFormat: {
                fontWeight: undefined,
                italic: undefined,
                underline: undefined,
                fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
                fontSize: '12pt',
                textColor: undefined,
                backgroundColor: undefined,
            },
            reuseModel: false,
            addDelimiterForEntity: false,
            contentDiv: {
                style: {},
            },
            defaultFormatOnContainer: false,
            originalContainerFormat: {},
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

        const options = {};
        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, {
            plugins: [new ContentModelFormatPlugin(), new ContentModelEditPlugin()],
            corePluginOverride: {
                typeInContainer: new ContentModelTypeInContainerPlugin(),
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
                switchShadowEdit: mockedSwitchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
            },
            originalApi: {
                a: 'b',
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
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
            reuseModel: false,
            addDelimiterForEntity: false,
            contentDiv: {
                style: {},
            },
            defaultFormatOnContainer: false,
            originalContainerFormat: {},
        } as any);
    });

    it('Reuse model', () => {
        mockedCore.lifecycle.experimentalFeatures.push(ExperimentalFeatures.ReusableContentModel);

        const options = {};
        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, {
            plugins: [new ContentModelFormatPlugin(), new ContentModelEditPlugin()],
            corePluginOverride: {
                typeInContainer: new ContentModelTypeInContainerPlugin(),
            },
        });
        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [ExperimentalFeatures.ReusableContentModel],
                defaultFormat: {},
            },
            api: {
                switchShadowEdit: switchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
            },
            originalApi: {
                a: 'b',
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
            },
            defaultDomToModelOptions: {},
            defaultModelToDomOptions: {},
            defaultFormat: {
                fontWeight: undefined,
                italic: undefined,
                underline: undefined,
                fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
                fontSize: '12pt',
                textColor: undefined,
                backgroundColor: undefined,
            },
            reuseModel: true,
            addDelimiterForEntity: false,
            contentDiv: {
                style: {},
            },
            defaultFormatOnContainer: false,
            originalContainerFormat: {},
        } as any);
    });

    it('Allow entity delimiters', () => {
        mockedCore.lifecycle.experimentalFeatures.push(
            ExperimentalFeatures.InlineEntityReadOnlyDelimiters
        );

        const options = {};
        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, {
            plugins: [new ContentModelFormatPlugin(), new ContentModelEditPlugin()],
            corePluginOverride: {
                typeInContainer: new ContentModelTypeInContainerPlugin(),
            },
        });
        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [ExperimentalFeatures.InlineEntityReadOnlyDelimiters],
                defaultFormat: {},
            },
            api: {
                switchShadowEdit: mockedSwitchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
            },
            originalApi: {
                a: 'b',
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
            },
            defaultDomToModelOptions: {},
            defaultModelToDomOptions: {},
            defaultFormat: {
                fontWeight: undefined,
                italic: undefined,
                underline: undefined,
                fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
                fontSize: '12pt',
                textColor: undefined,
                backgroundColor: undefined,
            },
            reuseModel: false,
            addDelimiterForEntity: true,
            contentDiv: {
                style: {},
            },
            defaultFormatOnContainer: false,
            originalContainerFormat: {},
        } as any);
    });
});

describe('createContentModelEditorCore with experimental feature "DefaultFormatOnContainer', () => {
    let createEditorCoreSpy: jasmine.Spy;
    let mockedCore: any;
    let contentDiv: any;

    beforeEach(() => {
        contentDiv = {
            style: {},
        } as any;

        mockedCore = {
            lifecycle: {
                experimentalFeatures: [ExperimentalFeatures.DefaultFormatOnContainer],
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
        const options = {};
        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, {
            plugins: [new ContentModelFormatPlugin(), new ContentModelEditPlugin()],
            corePluginOverride: {
                typeInContainer: new ContentModelTypeInContainerPlugin(),
            },
        });
        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [ExperimentalFeatures.DefaultFormatOnContainer],
                defaultFormat: {
                    fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
                    fontSize: '12pt',
                },
            },
            api: {
                switchShadowEdit: mockedSwitchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
            },
            originalApi: {
                a: 'b',
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
            },
            defaultDomToModelOptions: {},
            defaultModelToDomOptions: {},
            defaultFormat: {
                fontWeight: undefined,
                italic: undefined,
                underline: undefined,
                fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
                fontSize: '12pt',
                textColor: undefined,
                backgroundColor: undefined,
            },
            reuseModel: false,
            addDelimiterForEntity: false,
            contentDiv: {
                style: { fontFamily: 'Calibri, Arial, Helvetica, sans-serif', fontSize: '12pt' },
            },
            defaultFormatOnContainer: true,
            originalContainerFormat: { fontFamily: undefined, fontSize: undefined },
        } as any);
    });

    it('With additional option', () => {
        const defaultDomToModelOptions = { a: '1' } as any;
        const defaultModelToDomOptions = { b: '2' } as any;

        const options = { defaultDomToModelOptions, defaultModelToDomOptions };
        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, {
            defaultDomToModelOptions,
            defaultModelToDomOptions,
            plugins: [new ContentModelFormatPlugin(), new ContentModelEditPlugin()],
            corePluginOverride: {
                typeInContainer: new ContentModelTypeInContainerPlugin(),
            },
        });

        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [ExperimentalFeatures.DefaultFormatOnContainer],
                defaultFormat: {
                    fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
                    fontSize: '12pt',
                },
            },
            api: {
                switchShadowEdit: mockedSwitchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
            },
            originalApi: {
                a: 'b',
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
            },
            defaultDomToModelOptions,
            defaultModelToDomOptions,
            defaultFormat: {
                fontWeight: undefined,
                italic: undefined,
                underline: undefined,
                fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
                fontSize: '12pt',
                textColor: undefined,
                backgroundColor: undefined,
            },
            reuseModel: false,
            addDelimiterForEntity: false,
            contentDiv: {
                style: { fontFamily: 'Calibri, Arial, Helvetica, sans-serif', fontSize: '12pt' },
            },
            defaultFormatOnContainer: true,
            originalContainerFormat: { fontFamily: undefined, fontSize: undefined },
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

        const options = {};
        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, {
            plugins: [new ContentModelFormatPlugin(), new ContentModelEditPlugin()],
            corePluginOverride: {
                typeInContainer: new ContentModelTypeInContainerPlugin(),
            },
        });
        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [ExperimentalFeatures.DefaultFormatOnContainer],
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
                switchShadowEdit: mockedSwitchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
            },
            originalApi: {
                a: 'b',
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
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
            reuseModel: false,
            addDelimiterForEntity: false,
            contentDiv: {
                style: { fontFamily: 'Arial', fontSize: '10pt' },
            },
            defaultFormatOnContainer: true,
            originalContainerFormat: { fontFamily: undefined, fontSize: undefined },
        } as any);
    });

    it('Reuse model', () => {
        mockedCore.lifecycle.experimentalFeatures.push(ExperimentalFeatures.ReusableContentModel);

        const options = {};
        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, {
            plugins: [new ContentModelFormatPlugin(), new ContentModelEditPlugin()],
            corePluginOverride: {
                typeInContainer: new ContentModelTypeInContainerPlugin(),
            },
        });
        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [
                    ExperimentalFeatures.DefaultFormatOnContainer,
                    ExperimentalFeatures.ReusableContentModel,
                ],
                defaultFormat: {
                    fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
                    fontSize: '12pt',
                },
            },
            api: {
                switchShadowEdit: switchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
            },
            originalApi: {
                a: 'b',
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
            },
            defaultDomToModelOptions: {},
            defaultModelToDomOptions: {},
            defaultFormat: {
                fontWeight: undefined,
                italic: undefined,
                underline: undefined,
                fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
                fontSize: '12pt',
                textColor: undefined,
                backgroundColor: undefined,
            },
            reuseModel: true,
            addDelimiterForEntity: false,
            contentDiv: {
                style: { fontFamily: 'Calibri, Arial, Helvetica, sans-serif', fontSize: '12pt' },
            },
            defaultFormatOnContainer: true,
            originalContainerFormat: { fontFamily: undefined, fontSize: undefined },
        } as any);
    });

    it('Allow entity delimiters', () => {
        mockedCore.lifecycle.experimentalFeatures.push(
            ExperimentalFeatures.InlineEntityReadOnlyDelimiters
        );

        const options = {};
        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, {
            plugins: [new ContentModelFormatPlugin(), new ContentModelEditPlugin()],
            corePluginOverride: {
                typeInContainer: new ContentModelTypeInContainerPlugin(),
            },
        });
        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [
                    ExperimentalFeatures.DefaultFormatOnContainer,
                    ExperimentalFeatures.InlineEntityReadOnlyDelimiters,
                ],
                defaultFormat: {
                    fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
                    fontSize: '12pt',
                },
            },
            api: {
                switchShadowEdit: mockedSwitchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
            },
            originalApi: {
                a: 'b',
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
            },
            defaultDomToModelOptions: {},
            defaultModelToDomOptions: {},
            defaultFormat: {
                fontWeight: undefined,
                italic: undefined,
                underline: undefined,
                fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
                fontSize: '12pt',
                textColor: undefined,
                backgroundColor: undefined,
            },
            reuseModel: false,
            addDelimiterForEntity: true,
            contentDiv: {
                style: { fontFamily: 'Calibri, Arial, Helvetica, sans-serif', fontSize: '12pt' },
            },
            defaultFormatOnContainer: true,
            originalContainerFormat: { fontFamily: undefined, fontSize: undefined },
        } as any);
    });

    it('Content Div already has style', () => {
        const options = {};
        const core = createContentModelEditorCore(contentDiv, options);

        contentDiv.style.fontFamily = 'AAAA';
        contentDiv.style.fontSize = 'BBBB';

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, {
            plugins: [new ContentModelFormatPlugin(), new ContentModelEditPlugin()],
            corePluginOverride: {
                typeInContainer: new ContentModelTypeInContainerPlugin(),
            },
        });
        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [ExperimentalFeatures.DefaultFormatOnContainer],
                defaultFormat: {
                    fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
                    fontSize: '12pt',
                },
            },
            api: {
                switchShadowEdit: mockedSwitchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
            },
            originalApi: {
                a: 'b',
                createEditorContext,
                createContentModel,
                setContentModel,
                createPasteModel,
            },
            defaultDomToModelOptions: {},
            defaultModelToDomOptions: {},
            defaultFormat: {
                fontWeight: undefined,
                italic: undefined,
                underline: undefined,
                fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
                fontSize: '12pt',
                textColor: undefined,
                backgroundColor: undefined,
            },
            reuseModel: false,
            addDelimiterForEntity: false,
            contentDiv: {
                style: {
                    fontFamily: 'AAAA',
                    fontSize: 'BBBB',
                },
            },
            defaultFormatOnContainer: true,
            originalContainerFormat: { fontFamily: undefined, fontSize: undefined },
        } as any);
    });
});
