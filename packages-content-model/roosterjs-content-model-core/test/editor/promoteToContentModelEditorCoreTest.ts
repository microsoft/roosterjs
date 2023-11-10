import * as createDomToModelContext from 'roosterjs-content-model-dom/lib/domToModel/context/createDomToModelContext';
import * as createModelToDomContext from 'roosterjs-content-model-dom/lib/modelToDom/context/createModelToDomContext';
import { ContentModelPluginState } from 'roosterjs-content-model-types';
import { createContentModel } from '../../lib/coreApi/createContentModel';
import { createEditorContext } from '../../lib/coreApi/createEditorContext';
import { EditorCore } from 'roosterjs-editor-types';
import { formatContentModel } from '../../lib/coreApi/formatContentModel';
import { getDOMSelection } from '../../lib/coreApi/getDOMSelection';
import { promoteToContentModelEditorCore } from '../../lib/editor/promoteToContentModelEditorCore';
import { setContentModel } from '../../lib/coreApi/setContentModel';
import { setDOMSelection } from '../../lib/coreApi/setDOMSelection';
import { switchShadowEdit } from '../../lib/coreApi/switchShadowEdit';
import { tablePreProcessor } from '../../lib/override/tablePreProcessor';
import {
    listItemMetadataApplier,
    listLevelMetadataApplier,
} from '../../lib/metadata/updateListMetadata';

describe('promoteToContentModelEditorCore', () => {
    let pluginState: ContentModelPluginState;
    let core: EditorCore;
    const mockedSwitchShadowEdit = 'SHADOWEDIT' as any;
    const mockedDomToModelConfig = {
        config: 'mockedDomToModelConfig',
    } as any;
    const mockedModelToDomConfig = {
        config: 'mockedModelToDomConfig',
    } as any;

    const baseResult: any = {
        contentDiv: null!,
        darkColorHandler: null!,
        domEvent: null!,
        edit: null!,
        entity: null!,
        getVisibleViewport: null!,
        lifecycle: null!,
        pendingFormatState: null!,
        trustedHTMLHandler: null!,
        undo: null!,
        sizeTransformer: null!,
        zoomScale: 1,
        plugins: [],
    };

    beforeEach(() => {
        pluginState = {
            cache: {},
            copyPaste: { allowedCustomPasteType: [] },
            format: {
                defaultFormat: {},
                pendingFormat: null,
            },
        };
        core = {
            ...baseResult,
            api: {
                switchShadowEdit: mockedSwitchShadowEdit,
            } as any,
            originalApi: {
                switchShadowEdit: mockedSwitchShadowEdit,
            } as any,
            copyPaste: { allowedCustomPasteType: [] },
        };

        spyOn(createDomToModelContext, 'createDomToModelConfig').and.returnValue(
            mockedDomToModelConfig
        );
        spyOn(createModelToDomContext, 'createModelToDomConfig').and.returnValue(
            mockedModelToDomConfig
        );
    });

    it('No additional option', () => {
        promoteToContentModelEditorCore(core, {}, pluginState);

        expect(core).toEqual({
            ...baseResult,
            api: {
                switchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                getDOMSelection,
                setDOMSelection,
                formatContentModel,
            },
            originalApi: {
                switchShadowEdit: mockedSwitchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                getDOMSelection,
                setDOMSelection,
                formatContentModel,
            },
            defaultDomToModelOptions: [
                { processorOverride: { table: tablePreProcessor } },
                undefined,
            ],
            defaultModelToDomOptions: [
                {
                    metadataAppliers: {
                        listItem: listItemMetadataApplier,
                        listLevel: listLevelMetadataApplier,
                    },
                },
                undefined,
            ],
            defaultDomToModelConfig: mockedDomToModelConfig,
            defaultModelToDomConfig: mockedModelToDomConfig,
            format: {
                defaultFormat: {},
                pendingFormat: null,
            },
            cache: {},
            copyPaste: { allowedCustomPasteType: [] },
            environment: { isMac: false, isAndroid: false },
        } as any);
    });

    it('With additional option', () => {
        const defaultDomToModelOptions = { a: '1' } as any;
        const defaultModelToDomOptions = { b: '2' } as any;
        const mockedPlugin = 'PLUGIN' as any;
        const options = {
            defaultDomToModelOptions,
            defaultModelToDomOptions,
            corePluginOverride: {
                copyPaste: mockedPlugin,
            },
        };

        promoteToContentModelEditorCore(core, options, pluginState);

        expect(core).toEqual({
            ...baseResult,
            api: {
                switchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                getDOMSelection,
                setDOMSelection,
                formatContentModel,
            },
            originalApi: {
                switchShadowEdit: mockedSwitchShadowEdit,
                createEditorContext,
                createContentModel,
                setContentModel,
                getDOMSelection,
                setDOMSelection,
                formatContentModel,
            },
            defaultDomToModelOptions: [
                { processorOverride: { table: tablePreProcessor } },
                defaultDomToModelOptions,
            ],
            defaultModelToDomOptions: [
                {
                    metadataAppliers: {
                        listItem: listItemMetadataApplier,
                        listLevel: listLevelMetadataApplier,
                    },
                },
                defaultModelToDomOptions,
            ],
            defaultDomToModelConfig: mockedDomToModelConfig,
            defaultModelToDomConfig: mockedModelToDomConfig,
            format: {
                defaultFormat: {},
                pendingFormat: null,
            },
            cache: {},
            copyPaste: { allowedCustomPasteType: [] },
            environment: { isMac: false, isAndroid: false },
        } as any);
    });
});
