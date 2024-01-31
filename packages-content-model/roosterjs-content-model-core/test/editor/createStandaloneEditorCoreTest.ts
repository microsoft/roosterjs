import * as createDefaultSettings from '../../lib/editor/createStandaloneEditorDefaultSettings';
import * as createStandaloneEditorCorePlugins from '../../lib/corePlugin/createStandaloneEditorCorePlugins';
import * as DarkColorHandlerImpl from '../../lib/editor/DarkColorHandlerImpl';
import * as DOMHelperImpl from '../../lib/editor/DOMHelperImpl';
import { standaloneCoreApiMap } from '../../lib/editor/standaloneCoreApiMap';
import { StandaloneEditorCore, StandaloneEditorOptions } from 'roosterjs-content-model-types';
import {
    createStandaloneEditorCore,
    defaultTrustHtmlHandler,
    getDarkColorFallback,
} from '../../lib/editor/createStandaloneEditorCore';

describe('createEditorCore', () => {
    function createMockedPlugin(stateName: string): any {
        return {
            getState: () => stateName,
        };
    }

    const mockedCachePlugin = createMockedPlugin('cache');
    const mockedFormatPlugin = createMockedPlugin('format');
    const mockedCopyPastePlugin = createMockedPlugin('copyPaste');
    const mockedDomEventPlugin = createMockedPlugin('domEvent');
    const mockedLifeCyclePlugin = createMockedPlugin('lifecycle');
    const mockedEntityPlugin = createMockedPlugin('entity');
    const mockedSelectionPlugin = createMockedPlugin('selection');
    const mockedUndoPlugin = createMockedPlugin('undo');
    const mockedContextMenuPlugin = createMockedPlugin('contextMenu');
    const mockedPlugins = {
        cache: mockedCachePlugin,
        format: mockedFormatPlugin,
        copyPaste: mockedCopyPastePlugin,
        domEvent: mockedDomEventPlugin,
        lifecycle: mockedLifeCyclePlugin,
        entity: mockedEntityPlugin,
        selection: mockedSelectionPlugin,
        undo: mockedUndoPlugin,
        contextMenu: mockedContextMenuPlugin,
    };
    const mockedDarkColorHandler = 'DARKCOLOR' as any;
    const mockedDomToModelSettings = 'DOMTOMODEL' as any;
    const mockedModelToDomSettings = 'MODELTODOM' as any;
    const mockedDOMHelper = 'DOMHELPER' as any;

    beforeEach(() => {
        spyOn(
            createStandaloneEditorCorePlugins,
            'createStandaloneEditorCorePlugins'
        ).and.returnValue(mockedPlugins);
        spyOn(DarkColorHandlerImpl, 'createDarkColorHandler').and.returnValue(
            mockedDarkColorHandler
        );
        spyOn(createDefaultSettings, 'createDomToModelSettings').and.returnValue(
            mockedDomToModelSettings
        );
        spyOn(createDefaultSettings, 'createModelToDomSettings').and.returnValue(
            mockedModelToDomSettings
        );
        spyOn(DOMHelperImpl, 'createDOMHelper').and.returnValue(mockedDOMHelper);
    });

    function runTest(
        contentDiv: HTMLDivElement,
        options: StandaloneEditorOptions,
        additionalResult: Partial<StandaloneEditorCore>
    ) {
        const core = createStandaloneEditorCore(contentDiv, options);

        expect(core).toEqual({
            contentDiv: contentDiv,
            api: standaloneCoreApiMap,
            originalApi: standaloneCoreApiMap,
            plugins: [
                mockedCachePlugin,
                mockedFormatPlugin,
                mockedCopyPastePlugin,
                mockedDomEventPlugin,
                mockedSelectionPlugin,
                mockedEntityPlugin,
                mockedUndoPlugin,
                mockedContextMenuPlugin,
                mockedLifeCyclePlugin,
            ],
            environment: {
                isMac: false,
                isAndroid: false,
                isSafari: false,
            },
            darkColorHandler: mockedDarkColorHandler,
            trustedHTMLHandler: defaultTrustHtmlHandler,
            domToModelSettings: mockedDomToModelSettings,
            modelToDomSettings: mockedModelToDomSettings,
            cache: 'cache' as any,
            format: 'format' as any,
            copyPaste: 'copyPaste' as any,
            domEvent: 'domEvent' as any,
            lifecycle: 'lifecycle' as any,
            entity: 'entity' as any,
            selection: 'selection' as any,
            undo: 'undo' as any,
            contextMenu: 'contextMenu' as any,
            domHelper: mockedDOMHelper,
            disposeErrorHandler: undefined,
            zoomScale: 1,
            ...additionalResult,
        });

        expect(
            createStandaloneEditorCorePlugins.createStandaloneEditorCorePlugins
        ).toHaveBeenCalledWith(options, contentDiv);
        expect(createDefaultSettings.createDomToModelSettings).toHaveBeenCalledWith(options);
        expect(createDefaultSettings.createModelToDomSettings).toHaveBeenCalledWith(options);
    }

    it('No options', () => {
        const mockedDiv = {
            ownerDocument: {},
            attributes: {
                a: 'b',
            },
        } as any;
        runTest(
            mockedDiv,
            {
                name: 'Options',
            } as any,
            {}
        );

        expect(DarkColorHandlerImpl.createDarkColorHandler).toHaveBeenCalledWith(
            mockedDiv,
            getDarkColorFallback,
            undefined
        );
    });

    it('With options', () => {
        const mockedDiv = {
            ownerDocument: {},
            attributes: {
                a: 'b',
            },
        } as any;
        const mockedPlugin1 = 'P1' as any;
        const mockedPlugin2 = 'P2' as any;
        const mockedGetDarkColor = 'DARK' as any;
        const mockedTrustHtmlHandler = 'TRUST' as any;
        const mockedDisposeErrorHandler = 'DISPOSE' as any;
        const mockedOptions = {
            coreApiOverride: {
                a: 'b',
            },
            plugins: [mockedPlugin1, null, mockedPlugin2],
            getDarkColor: mockedGetDarkColor,
            trustedHTMLHandler: mockedTrustHtmlHandler,
            disposeErrorHandler: mockedDisposeErrorHandler,
            zoomScale: 2,
        } as any;

        runTest(mockedDiv, mockedOptions, {
            contentDiv: mockedDiv,
            api: { ...standaloneCoreApiMap, a: 'b' } as any,
            plugins: [
                mockedCachePlugin,
                mockedFormatPlugin,
                mockedCopyPastePlugin,
                mockedDomEventPlugin,
                mockedSelectionPlugin,
                mockedEntityPlugin,
                mockedPlugin1,
                mockedPlugin2,
                mockedUndoPlugin,
                mockedContextMenuPlugin,
                mockedLifeCyclePlugin,
            ],
            darkColorHandler: mockedDarkColorHandler,
            trustedHTMLHandler: mockedTrustHtmlHandler,
            disposeErrorHandler: mockedDisposeErrorHandler,
            zoomScale: 2,
        });

        expect(DarkColorHandlerImpl.createDarkColorHandler).toHaveBeenCalledWith(
            mockedDiv,
            mockedGetDarkColor,
            undefined
        );
    });

    it('Invalid zoom scale', () => {
        const mockedDiv = {
            ownerDocument: {},
            attributes: {
                a: 'b',
            },
        } as any;
        const mockedOptions = {
            zoomScale: -1,
        } as any;

        runTest(mockedDiv, mockedOptions, {});

        expect(DarkColorHandlerImpl.createDarkColorHandler).toHaveBeenCalledWith(
            mockedDiv,
            getDarkColorFallback,
            undefined
        );
    });

    it('Android', () => {
        const mockedDiv = {
            ownerDocument: {
                defaultView: {
                    navigator: {
                        userAgent: 'Android',
                    },
                },
            },
            attributes: {
                a: 'b',
            },
        } as any;
        const mockedOptions = {
            zoomScale: -1,
        } as any;

        runTest(mockedDiv, mockedOptions, {
            environment: {
                isMac: false,
                isAndroid: true,
                isSafari: false,
            },
        });

        expect(DarkColorHandlerImpl.createDarkColorHandler).toHaveBeenCalledWith(
            mockedDiv,
            getDarkColorFallback,
            undefined
        );
    });

    it('Android+Safari', () => {
        const mockedDiv = {
            ownerDocument: {
                defaultView: {
                    navigator: {
                        userAgent: 'Android Safari',
                    },
                },
            },
            attributes: {
                a: 'b',
            },
        } as any;
        const mockedOptions = {
            zoomScale: -1,
        } as any;

        runTest(mockedDiv, mockedOptions, {
            environment: {
                isMac: false,
                isAndroid: true,
                isSafari: false,
            },
        });

        expect(DarkColorHandlerImpl.createDarkColorHandler).toHaveBeenCalledWith(
            mockedDiv,
            getDarkColorFallback,
            undefined
        );
    });

    it('Mac', () => {
        const mockedDiv = {
            ownerDocument: {
                defaultView: {
                    navigator: {
                        appVersion: 'Mac',
                    },
                },
            },
            attributes: {
                a: 'b',
            },
        } as any;
        const mockedOptions = {
            zoomScale: -1,
        } as any;

        runTest(mockedDiv, mockedOptions, {
            environment: {
                isMac: true,
                isAndroid: false,
                isSafari: false,
            },
        });

        expect(DarkColorHandlerImpl.createDarkColorHandler).toHaveBeenCalledWith(
            mockedDiv,
            getDarkColorFallback,
            undefined
        );
    });

    it('Safari', () => {
        const mockedDiv = {
            ownerDocument: {
                defaultView: {
                    navigator: {
                        userAgent: 'Safari',
                    },
                },
            },
            attributes: {
                a: 'b',
            },
        } as any;
        const mockedOptions = {
            zoomScale: -1,
        } as any;

        runTest(mockedDiv, mockedOptions, {
            environment: {
                isMac: false,
                isAndroid: false,
                isSafari: true,
            },
        });

        expect(DarkColorHandlerImpl.createDarkColorHandler).toHaveBeenCalledWith(
            mockedDiv,
            getDarkColorFallback,
            undefined
        );
    });

    it('Chrome', () => {
        const mockedDiv = {
            ownerDocument: {
                defaultView: {
                    navigator: {
                        userAgent: 'Safari Chrome',
                    },
                },
            },
            attributes: {
                a: 'b',
            },
        } as any;
        const mockedOptions = {
            zoomScale: -1,
        } as any;

        runTest(mockedDiv, mockedOptions, {
            environment: {
                isMac: false,
                isAndroid: false,
                isSafari: false,
            },
        });

        expect(DarkColorHandlerImpl.createDarkColorHandler).toHaveBeenCalledWith(
            mockedDiv,
            getDarkColorFallback,
            undefined
        );
    });
});
