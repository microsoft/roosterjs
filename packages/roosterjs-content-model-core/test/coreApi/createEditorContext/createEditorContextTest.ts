import { createEditorContext } from '../../../lib/coreApi/createEditorContext/createEditorContext';
import { EditorCore } from 'roosterjs-content-model-types';

describe('createEditorContext', () => {
    it('create a normal context', () => {
        const isDarkMode = 'DARKMODE' as any;
        const defaultFormat = 'DEFAULTFORMAT' as any;
        const darkColorHandler = 'DARKHANDLER' as any;
        const calculateZoomScaleSpy = jasmine.createSpy('calculateZoomScale').and.returnValue(1);
        const domIndexer = 'DOMINDEXER' as any;
        const isRtlSpy = jasmine.createSpy('isRtl');
        const mockedParagraphMap = 'PARAMAP' as any;

        const div = {
            ownerDocument: {},
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
                paragraphMap: mockedParagraphMap,
            },
            domHelper: {
                calculateZoomScale: calculateZoomScaleSpy,
                isRightToLeft: isRtlSpy,
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
            experimentalFeatures: [],
            paragraphMap: mockedParagraphMap,
        });
    });

    it('create a normal context with domIndexer', () => {
        const isDarkMode = 'DARKMODE' as any;
        const defaultFormat = 'DEFAULTFORMAT' as any;
        const darkColorHandler = 'DARKHANDLER' as any;
        const calculateZoomScaleSpy = jasmine.createSpy('calculateZoomScale').and.returnValue(1);
        const isRtlSpy = jasmine.createSpy('isRtl');
        const domIndexer = 'DOMINDEXER' as any;
        const mockedParagraphMap = 'PARAMAP' as any;

        const div = {
            ownerDocument: {},
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
                paragraphMap: mockedParagraphMap,
            },
            domHelper: {
                calculateZoomScale: calculateZoomScaleSpy,
                isRightToLeft: isRtlSpy,
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
            experimentalFeatures: [],
            paragraphMap: mockedParagraphMap,
        });
    });

    it('create with pending format', () => {
        const isDarkMode = 'DARKMODE' as any;
        const defaultFormat = 'DEFAULTFORMAT' as any;
        const darkColorHandler = 'DARKHANDLER' as any;
        const mockedPendingFormat = 'PENDINGFORMAT' as any;
        const calculateZoomScaleSpy = jasmine.createSpy('calculateZoomScale').and.returnValue(1);
        const mockedParagraphMap = 'PARAMAP' as any;

        const div = {
            ownerDocument: {},
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
            cache: { paragraphMap: mockedParagraphMap },
            domHelper: {
                calculateZoomScale: calculateZoomScaleSpy,
                isRightToLeft: jasmine.createSpy('isRtl'),
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
            experimentalFeatures: [],
            paragraphMap: mockedParagraphMap,
        });
    });

    it('create with shadow edit', () => {
        const isDarkMode = 'DARKMODE' as any;
        const defaultFormat = 'DEFAULTFORMAT' as any;
        const darkColorHandler = 'DARKHANDLER' as any;
        const mockedPendingFormat = 'PENDINGFORMAT' as any;
        const calculateZoomScaleSpy = jasmine.createSpy('calculateZoomScale').and.returnValue(1);
        const isRtlSpy = jasmine.createSpy('isRtl');
        const mockedParagraphMap = 'PARAMAP' as any;
        const div = {
            ownerDocument: {},
        };

        const core = ({
            physicalRoot: div,
            logicalRoot: div,
            lifecycle: {
                isDarkMode,
                shadowEditFragment: {} as any,
            },
            format: {
                defaultFormat,
                pendingFormat: mockedPendingFormat,
            },
            darkColorHandler,
            cache: {
                paragraphMap: mockedParagraphMap,
            },
            domHelper: {
                calculateZoomScale: calculateZoomScaleSpy,
                isRightToLeft: isRtlSpy,
            },
        } as any) as EditorCore;

        const context = createEditorContext(core, true);

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
            experimentalFeatures: [],
            paragraphMap: mockedParagraphMap,
        });
    });
});

describe('createEditorContext - checkZoomScale', () => {
    let core: EditorCore;
    let div: any;
    let calculateZoomScaleSpy: jasmine.Spy;
    let isRtlSpy: jasmine.Spy;
    const isDarkMode = 'DARKMODE' as any;
    const defaultFormat = 'DEFAULTFORMAT' as any;
    const darkColorHandler = 'DARKHANDLER' as any;
    const mockedParagraphMap = 'PARAMAP' as any;

    beforeEach(() => {
        calculateZoomScaleSpy = jasmine.createSpy('calculateZoomScale');
        isRtlSpy = jasmine.createSpy('isRtl');

        div = {
            ownerDocument: {},
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
            cache: { paragraphMap: mockedParagraphMap },
            domHelper: {
                calculateZoomScale: calculateZoomScaleSpy,
                isRightToLeft: isRtlSpy,
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
            experimentalFeatures: [],
            paragraphMap: mockedParagraphMap,
        });
    });
});

describe('createEditorContext - checkRootDir', () => {
    let core: EditorCore;
    let div: any;
    let calculateZoomScaleSpy: jasmine.Spy;
    let isRtlSpy: jasmine.Spy;
    const isDarkMode = 'DARKMODE' as any;
    const defaultFormat = 'DEFAULTFORMAT' as any;
    const darkColorHandler = 'DARKHANDLER' as any;
    const mockedParagraphMap = 'PARAMAP' as any;

    beforeEach(() => {
        calculateZoomScaleSpy = jasmine.createSpy('calculateZoomScale').and.returnValue(1);
        isRtlSpy = jasmine.createSpy('isRtl');
        div = {
            ownerDocument: {},
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
            cache: {
                paragraphMap: mockedParagraphMap,
            },
            domHelper: {
                calculateZoomScale: calculateZoomScaleSpy,
                isRightToLeft: isRtlSpy,
            },
        } as any) as EditorCore;
    });

    it('LTR CSS', () => {
        isRtlSpy.and.returnValue(false);
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
            experimentalFeatures: [],
            paragraphMap: mockedParagraphMap,
        });
    });

    it('RTL', () => {
        isRtlSpy.and.returnValue(true);
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
            experimentalFeatures: [],
            paragraphMap: mockedParagraphMap,
        });
    });
});
