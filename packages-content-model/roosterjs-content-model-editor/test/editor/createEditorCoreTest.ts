import * as ContentModelCachePlugin from 'roosterjs-content-model-core/lib/corePlugin/ContentModelCachePlugin';
import * as ContentModelCopyPastePlugin from 'roosterjs-content-model-core/lib/corePlugin/ContentModelCopyPastePlugin';
import * as ContentModelFormatPlugin from 'roosterjs-content-model-core/lib/corePlugin/ContentModelFormatPlugin';
import * as createStandaloneEditorDefaultSettings from 'roosterjs-content-model-core/lib/editor/createStandaloneEditorDefaultSettings';
import * as DOMEventPlugin from 'roosterjs-content-model-core/lib/corePlugin/DOMEventPlugin';
import * as EditPlugin from '../../lib/corePlugins/EditPlugin';
import * as EntityPlugin from 'roosterjs-content-model-core/lib/corePlugin/EntityPlugin';
import * as EventTranslate from '../../lib/corePlugins/EventTypeTranslatePlugin';
import * as LifecyclePlugin from 'roosterjs-content-model-core/lib/corePlugin/LifecyclePlugin';
import * as NormalizeTablePlugin from '../../lib/corePlugins/NormalizeTablePlugin';
import * as SelectionPlugin from 'roosterjs-content-model-core/lib/corePlugin/SelectionPlugin';
import * as UndoPlugin from 'roosterjs-content-model-core/lib/corePlugin/UndoPlugin';
import { coreApiMap } from '../../lib/coreApi/coreApiMap';
import { createEditorCore } from '../../lib/editor/createEditorCore';
import { defaultTrustHtmlHandler } from 'roosterjs-content-model-core/lib/editor/createStandaloneEditorCore';
import { standaloneCoreApiMap } from 'roosterjs-content-model-core/lib/editor/standaloneCoreApiMap';

const mockedDomEventState = 'DOMEVENTSTATE' as any;
const mockedEditState = 'EDITSTATE' as any;
const mockedLifecycleState = 'LIFECYCLESTATE' as any;
const mockedUndoState = 'UNDOSTATE' as any;
const mockedEntityState = 'ENTITYSTATE' as any;
const mockedCopyPasteState = 'COPYPASTESTATE' as any;
const mockedCacheState = 'CACHESTATE' as any;
const mockedFormatState = 'FORMATSTATE' as any;
const mockedSelectionState = 'SELECTION' as any;

const mockedFormatPlugin = {
    getState: () => mockedFormatState,
} as any;
const mockedCachePlugin = {
    getState: () => mockedCacheState,
} as any;
const mockedCopyPastePlugin = {
    getState: () => mockedCopyPasteState,
} as any;
const mockedEditPlugin = {
    getState: () => mockedEditState,
} as any;
const mockedUndoPlugin = {
    getState: () => mockedUndoState,
} as any;
const mockedDOMEventPlugin = {
    getState: () => mockedDomEventState,
} as any;
const mockedEntityPlugin = {
    getState: () => mockedEntityState,
} as any;
const mockedSelectionPlugin = {
    getState: () => mockedSelectionState,
} as any;
const mockedNormalizeTablePlugin = 'NormalizeTablePlugin' as any;
const mockedLifecyclePlugin = {
    getState: () => mockedLifecycleState,
} as any;
const mockedEventTranslatePlugin = 'EventTranslate' as any;
const mockedDefaultDomToModelSettings = {
    settings: 'DOMTOMODELSETTINGS',
} as any;
const mockedDefaultModelToDomSettings = {
    settings: 'MODELTODOMSETTINGS',
} as any;

describe('createEditorCore', () => {
    let contentDiv: any;

    beforeEach(() => {
        contentDiv = {
            style: {},
        } as any;

        spyOn(ContentModelFormatPlugin, 'createContentModelFormatPlugin').and.returnValue(
            mockedFormatPlugin
        );
        spyOn(ContentModelCachePlugin, 'createContentModelCachePlugin').and.returnValue(
            mockedCachePlugin
        );
        spyOn(ContentModelCopyPastePlugin, 'createContentModelCopyPastePlugin').and.returnValue(
            mockedCopyPastePlugin
        );
        spyOn(EditPlugin, 'createEditPlugin').and.returnValue(mockedEditPlugin);
        spyOn(UndoPlugin, 'createUndoPlugin').and.returnValue(mockedUndoPlugin);
        spyOn(DOMEventPlugin, 'createDOMEventPlugin').and.returnValue(mockedDOMEventPlugin);
        spyOn(SelectionPlugin, 'createSelectionPlugin').and.returnValue(mockedSelectionPlugin);
        spyOn(EntityPlugin, 'createEntityPlugin').and.returnValue(mockedEntityPlugin);
        spyOn(NormalizeTablePlugin, 'createNormalizeTablePlugin').and.returnValue(
            mockedNormalizeTablePlugin
        );
        spyOn(LifecyclePlugin, 'createLifecyclePlugin').and.returnValue(mockedLifecyclePlugin);
        spyOn(EventTranslate, 'createEventTypeTranslatePlugin').and.returnValue(
            mockedEventTranslatePlugin
        );
        spyOn(createStandaloneEditorDefaultSettings, 'createDomToModelSettings').and.returnValue(
            mockedDefaultDomToModelSettings
        );
        spyOn(createStandaloneEditorDefaultSettings, 'createModelToDomSettings').and.returnValue(
            mockedDefaultModelToDomSettings
        );
    });

    it('No additional option', () => {
        const core = createEditorCore(contentDiv, {});
        expect(core).toEqual({
            contentDiv,
            api: { ...coreApiMap, ...standaloneCoreApiMap },
            originalApi: { ...coreApiMap, ...standaloneCoreApiMap },
            plugins: [
                mockedCachePlugin,
                mockedFormatPlugin,
                mockedCopyPastePlugin,
                mockedDOMEventPlugin,
                mockedSelectionPlugin,
                mockedEntityPlugin,
                mockedEventTranslatePlugin,
                mockedEditPlugin,
                mockedNormalizeTablePlugin,
                mockedUndoPlugin,
                mockedLifecyclePlugin,
            ],
            domEvent: mockedDomEventState,
            edit: mockedEditState,
            lifecycle: mockedLifecycleState,
            undo: mockedUndoState,
            entity: mockedEntityState,
            copyPaste: mockedCopyPasteState,
            cache: mockedCacheState,
            format: mockedFormatState,
            selection: mockedSelectionState,
            trustedHTMLHandler: defaultTrustHtmlHandler,
            zoomScale: 1,
            sizeTransformer: jasmine.anything(),
            darkColorHandler: jasmine.anything(),
            disposeErrorHandler: undefined,
            domToModelSettings: mockedDefaultDomToModelSettings,
            modelToDomSettings: mockedDefaultModelToDomSettings,
            environment: {
                isMac: false,
                isAndroid: false,
                isSafari: false,
            },
            customData: {},
            experimentalFeatures: [],
        });
    });

    it('With additional option', () => {
        const defaultDomToModelOptions = { a: '1' } as any;
        const defaultModelToDomOptions = { b: '2' } as any;

        const options = {
            defaultDomToModelOptions,
            defaultModelToDomOptions,
        };
        const core = createEditorCore(contentDiv, options);

        expect(createStandaloneEditorDefaultSettings.createDomToModelSettings).toHaveBeenCalledWith(
            options
        );
        expect(createStandaloneEditorDefaultSettings.createModelToDomSettings).toHaveBeenCalledWith(
            options
        );

        expect(core).toEqual({
            contentDiv,
            api: { ...coreApiMap, ...standaloneCoreApiMap },
            originalApi: { ...coreApiMap, ...standaloneCoreApiMap },
            plugins: [
                mockedCachePlugin,
                mockedFormatPlugin,
                mockedCopyPastePlugin,
                mockedDOMEventPlugin,
                mockedSelectionPlugin,
                mockedEntityPlugin,
                mockedEventTranslatePlugin,
                mockedEditPlugin,
                mockedNormalizeTablePlugin,
                mockedUndoPlugin,
                mockedLifecyclePlugin,
            ],
            domEvent: mockedDomEventState,
            edit: mockedEditState,
            lifecycle: mockedLifecycleState,
            undo: mockedUndoState,
            entity: mockedEntityState,
            copyPaste: mockedCopyPasteState,
            cache: mockedCacheState,
            format: mockedFormatState,
            selection: mockedSelectionState,
            trustedHTMLHandler: defaultTrustHtmlHandler,
            zoomScale: 1,
            sizeTransformer: jasmine.anything(),
            darkColorHandler: jasmine.anything(),
            disposeErrorHandler: undefined,
            domToModelSettings: mockedDefaultDomToModelSettings,
            modelToDomSettings: mockedDefaultModelToDomSettings,
            environment: {
                isMac: false,
                isAndroid: false,
                isSafari: false,
            },
            customData: {},
            experimentalFeatures: [],
        });
    });
});
