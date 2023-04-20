import * as createEditorCore from 'roosterjs-editor-core/lib/editor/createEditorCore';
import { createContentModel } from '../../lib/editor/coreApi/createContentModel';
import { createContentModelEditorCore } from '../../lib/editor/createContentModelEditorCore';
import { createEditorContext } from '../../lib/editor/coreApi/createEditorContext';
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

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, options);
        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [],
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
        } as any);
    });

    it('With additional option', () => {
        const defaultDomToModelOptions = { a: '1' } as any;
        const defaultModelToDomOptions = { b: '2' } as any;

        const options = { defaultDomToModelOptions, defaultModelToDomOptions };
        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, options);

        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [],
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

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, options);
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
            reuseModel: false,
            addDelimiterForEntity: false,
            contentDiv: {
                style: { fontFamily: 'Arial', fontSize: '10pt' },
            },
        } as any);
    });

    it('Reuse model', () => {
        mockedCore.lifecycle.experimentalFeatures.push(ExperimentalFeatures.ReusableContentModel);

        const options = {};
        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, options);
        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [ExperimentalFeatures.ReusableContentModel],
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
        } as any);
    });

    it('Allow entity delimiters', () => {
        mockedCore.lifecycle.experimentalFeatures.push(
            ExperimentalFeatures.InlineEntityReadOnlyDelimiters
        );

        const options = {};
        const core = createContentModelEditorCore(contentDiv, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, options);
        expect(core).toEqual({
            lifecycle: {
                experimentalFeatures: [ExperimentalFeatures.InlineEntityReadOnlyDelimiters],
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
        } as any);
    });
});
