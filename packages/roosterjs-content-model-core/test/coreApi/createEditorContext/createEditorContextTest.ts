import { createEditorContext } from '../../../lib/coreApi/createEditorContext/createEditorContext';
import { EditorCore } from 'roosterjs-content-model-types';

describe('createEditorContext', () => {
    it('create a normal context', () => {
        const isDarkMode = 'DARKMODE' as any;
        const defaultFormat = 'DEFAULTFORMAT' as any;
        const darkColorHandler = 'DARKHANDLER' as any;
        const getComputedStyleSpy = jasmine.createSpy('getComputedStyleSpy');
        const calculateZoomScaleSpy = jasmine.createSpy('calculateZoomScale').and.returnValue(1);
        const domIndexer = 'DOMINDEXER' as any;

        const div = {
            ownerDocument: {
                defaultView: {
                    getComputedStyle: getComputedStyleSpy,
                },
            },
        };

        const core = ({
            physicalRoot: div,
            logicalRoot: div,
            lifecycle: {
                isDarkMode,
            },
            format: {
                defaultFormat,
            },
            darkColorHandler,
            cache: {
                domIndexer: domIndexer,
            },
            domHelper: {
                calculateZoomScale: calculateZoomScaleSpy,
            },
        } as any) as EditorCore;

        const context = createEditorContext(core, false);

        expect(context).toEqual({
            isDarkMode,
            darkColorHandler,
            defaultFormat,
            addDelimiterForEntity: true,
            allowCacheElement: true,
            domIndexer: undefined,
            pendingFormat: undefined,
            zoomScale: 1,
            rootFontSize: 16,
        });
    });

    it('create a normal context with domIndexer', () => {
        const isDarkMode = 'DARKMODE' as any;
        const defaultFormat = 'DEFAULTFORMAT' as any;
        const darkColorHandler = 'DARKHANDLER' as any;
        const getComputedStyleSpy = jasmine.createSpy('getComputedStyleSpy');
        const calculateZoomScaleSpy = jasmine.createSpy('calculateZoomScale').and.returnValue(1);
        const domIndexer = 'DOMINDEXER' as any;

        const div = {
            ownerDocument: {
                defaultView: {
                    getComputedStyle: getComputedStyleSpy,
                },
            },
        };

        const core = ({
            physicalRoot: div,
            logicalRoot: div,
            lifecycle: {
                isDarkMode,
            },
            format: {
                defaultFormat,
            },
            darkColorHandler,
            cache: {
                domIndexer,
            },
            domHelper: {
                calculateZoomScale: calculateZoomScaleSpy,
            },
        } as any) as EditorCore;

        const context = createEditorContext(core, true);

        expect(context).toEqual({
            isDarkMode,
            darkColorHandler,
            defaultFormat,
            addDelimiterForEntity: true,
            allowCacheElement: true,
            domIndexer,
            pendingFormat: undefined,
            zoomScale: 1,
            rootFontSize: 16,
        });
    });

    it('create with pending format', () => {
        const isDarkMode = 'DARKMODE' as any;
        const defaultFormat = 'DEFAULTFORMAT' as any;
        const darkColorHandler = 'DARKHANDLER' as any;
        const mockedPendingFormat = 'PENDINGFORMAT' as any;
        const getComputedStyleSpy = jasmine.createSpy('getComputedStyleSpy');
        const calculateZoomScaleSpy = jasmine.createSpy('calculateZoomScale').and.returnValue(1);

        const div = {
            ownerDocument: {
                defaultView: {
                    getComputedStyle: getComputedStyleSpy,
                },
            },
        };

        const core = ({
            physicalRoot: div,
            logicalRoot: div,
            lifecycle: {
                isDarkMode,
            },
            format: {
                defaultFormat,
                pendingFormat: mockedPendingFormat,
            },
            darkColorHandler,
            cache: {},
            domHelper: {
                calculateZoomScale: calculateZoomScaleSpy,
            },
        } as any) as EditorCore;

        const context = createEditorContext(core, false);

        expect(context).toEqual({
            isDarkMode,
            darkColorHandler,
            defaultFormat,
            addDelimiterForEntity: true,
            allowCacheElement: true,
            domIndexer: undefined,
            pendingFormat: mockedPendingFormat,
            zoomScale: 1,
            rootFontSize: 16,
        });
    });
});

describe('createEditorContext - checkZoomScale', () => {
    let core: EditorCore;
    let div: any;
    let getComputedStyleSpy: jasmine.Spy;
    let calculateZoomScaleSpy: jasmine.Spy;
    const isDarkMode = 'DARKMODE' as any;
    const defaultFormat = 'DEFAULTFORMAT' as any;
    const darkColorHandler = 'DARKHANDLER' as any;

    beforeEach(() => {
        getComputedStyleSpy = jasmine.createSpy('getComputedStyleSpy');
        calculateZoomScaleSpy = jasmine.createSpy('calculateZoomScale');

        div = {
            ownerDocument: {
                defaultView: {
                    getComputedStyle: getComputedStyleSpy,
                },
            },
        };
        core = ({
            physicalRoot: div,
            logicalRoot: div,
            lifecycle: {
                isDarkMode,
            },
            format: {
                defaultFormat,
            },
            darkColorHandler,
            cache: {},
            domHelper: {
                calculateZoomScale: calculateZoomScaleSpy,
            },
        } as any) as EditorCore;
    });

    it('Zoom scale = 2', () => {
        calculateZoomScaleSpy.and.returnValue(2);

        const context = createEditorContext(core, false);

        expect(context).toEqual({
            isDarkMode,
            defaultFormat,
            darkColorHandler,
            addDelimiterForEntity: true,
            zoomScale: 2,
            allowCacheElement: true,
            domIndexer: undefined,
            pendingFormat: undefined,
            rootFontSize: 16,
        });
    });
});

describe('createEditorContext - checkRootDir', () => {
    let core: EditorCore;
    let div: any;
    let getComputedStyleSpy: jasmine.Spy;
    let calculateZoomScaleSpy: jasmine.Spy;
    const isDarkMode = 'DARKMODE' as any;
    const defaultFormat = 'DEFAULTFORMAT' as any;
    const darkColorHandler = 'DARKHANDLER' as any;

    beforeEach(() => {
        getComputedStyleSpy = jasmine.createSpy('getComputedStyleSpy');
        calculateZoomScaleSpy = jasmine.createSpy('calculateZoomScale').and.returnValue(1);
        div = {
            ownerDocument: {
                defaultView: {
                    getComputedStyle: getComputedStyleSpy,
                },
            },
        };
        core = ({
            physicalRoot: div,
            logicalRoot: div,
            lifecycle: {
                isDarkMode,
            },
            format: {
                defaultFormat,
            },
            darkColorHandler,
            cache: {},
            domHelper: {
                calculateZoomScale: calculateZoomScaleSpy,
            },
        } as any) as EditorCore;
    });

    it('LTR CSS', () => {
        getComputedStyleSpy.and.returnValue({
            direction: 'ltr',
        });

        const context = createEditorContext(core, false);

        expect(context).toEqual({
            isDarkMode,
            defaultFormat,
            darkColorHandler,
            addDelimiterForEntity: true,
            allowCacheElement: true,
            domIndexer: undefined,
            pendingFormat: undefined,
            zoomScale: 1,
            rootFontSize: 16,
        });
    });

    it('RTL', () => {
        getComputedStyleSpy.and.returnValue({
            direction: 'rtl',
        });

        const context = createEditorContext(core, false);

        expect(context).toEqual({
            isDarkMode,
            defaultFormat,
            darkColorHandler,
            addDelimiterForEntity: true,
            isRootRtl: true,
            allowCacheElement: true,
            domIndexer: undefined,
            pendingFormat: undefined,
            zoomScale: 1,
            rootFontSize: 16,
        });
    });
});
