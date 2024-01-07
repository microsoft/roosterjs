import { createEditorContext } from '../../lib/coreApi/createEditorContext';
import { StandaloneEditorCore } from 'roosterjs-content-model-types';

describe('createEditorContext', () => {
    it('create a normal context', () => {
        const isDarkMode = 'DARKMODE' as any;
        const defaultFormat = 'DEFAULTFORMAT' as any;
        const getComputedStyleSpy = jasmine.createSpy('getComputedStyleSpy');
        const getBoundingClientRectSpy = jasmine.createSpy('getBoundingClientRect');
        const mockedSnapshotsManager = 'SNAPSHOTS' as any;

        const div = {
            ownerDocument: {
                defaultView: {
                    getComputedStyle: getComputedStyleSpy,
                },
            },
            getBoundingClientRect: getBoundingClientRectSpy,
        };

        const core = ({
            contentDiv: div,
            lifecycle: {
                isDarkMode,
            },
            format: {
                defaultFormat,
            },
            cache: {},
            undo: {
                snapshotsManager: mockedSnapshotsManager,
            },
        } as any) as StandaloneEditorCore;

        const context = createEditorContext(core);

        expect(context).toEqual({
            isDarkMode,
            defaultFormat,
            addDelimiterForEntity: true,
            allowCacheElement: true,
            domIndexer: undefined,
            snapshots: mockedSnapshotsManager,
        });
    });

    it('create a normal context with domIndexer', () => {
        const isDarkMode = 'DARKMODE' as any;
        const defaultFormat = 'DEFAULTFORMAT' as any;
        const getComputedStyleSpy = jasmine.createSpy('getComputedStyleSpy');
        const getBoundingClientRectSpy = jasmine.createSpy('getBoundingClientRect');
        const domIndexer = 'DOMINDEXER' as any;
        const mockedSnapshotsManager = 'SNAPSHOTS' as any;

        const div = {
            ownerDocument: {
                defaultView: {
                    getComputedStyle: getComputedStyleSpy,
                },
            },
            getBoundingClientRect: getBoundingClientRectSpy,
        };

        const core = ({
            contentDiv: div,
            lifecycle: {
                isDarkMode,
            },
            format: {
                defaultFormat,
            },
            cache: {
                domIndexer,
            },
            undo: {
                snapshotsManager: mockedSnapshotsManager,
            },
        } as any) as StandaloneEditorCore;

        const context = createEditorContext(core);

        expect(context).toEqual({
            isDarkMode,
            defaultFormat,
            addDelimiterForEntity: true,
            allowCacheElement: true,
            domIndexer,
            snapshots: mockedSnapshotsManager,
        });
    });
});

describe('createEditorContext - checkZoomScale', () => {
    let core: StandaloneEditorCore;
    let div: any;
    let getComputedStyleSpy: jasmine.Spy;
    let getBoundingClientRectSpy: jasmine.Spy;
    const isDarkMode = 'DARKMODE' as any;
    const defaultFormat = 'DEFAULTFORMAT' as any;
    const mockedSnapshotsManager = 'SNAPSHOTS' as any;

    beforeEach(() => {
        getComputedStyleSpy = jasmine.createSpy('getComputedStyleSpy');
        getBoundingClientRectSpy = jasmine.createSpy('getBoundingClientRect');

        div = {
            ownerDocument: {
                defaultView: {
                    getComputedStyle: getComputedStyleSpy,
                },
            },
            getBoundingClientRect: getBoundingClientRectSpy,
        };
        core = ({
            contentDiv: div,
            lifecycle: {
                isDarkMode,
            },
            format: {
                defaultFormat,
            },
            cache: {},
            undo: {
                snapshotsManager: mockedSnapshotsManager,
            },
        } as any) as StandaloneEditorCore;
    });

    it('Zoom scale = 1', () => {
        div.offsetWidth = 100;
        getBoundingClientRectSpy.and.returnValue({
            width: 100,
        });

        const context = createEditorContext(core);

        expect(context).toEqual({
            isDarkMode,
            defaultFormat,
            addDelimiterForEntity: true,
            zoomScale: 1,
            allowCacheElement: true,
            domIndexer: undefined,
            snapshots: mockedSnapshotsManager,
        });
    });

    it('Zoom scale = 2', () => {
        div.offsetWidth = 50;
        getBoundingClientRectSpy.and.returnValue({
            width: 100,
        });

        const context = createEditorContext(core);

        expect(context).toEqual({
            isDarkMode,
            defaultFormat,
            addDelimiterForEntity: true,
            zoomScale: 2,
            allowCacheElement: true,
            domIndexer: undefined,
            snapshots: mockedSnapshotsManager,
        });
    });

    it('Zoom scale = 0.5', () => {
        div.offsetWidth = 200;
        getBoundingClientRectSpy.and.returnValue({
            width: 100,
        });

        const context = createEditorContext(core);

        expect(context).toEqual({
            isDarkMode,
            defaultFormat,
            addDelimiterForEntity: true,
            zoomScale: 0.5,
            allowCacheElement: true,
            domIndexer: undefined,
            snapshots: mockedSnapshotsManager,
        });
    });
});

describe('createEditorContext - checkRootDir', () => {
    let core: StandaloneEditorCore;
    let div: any;
    let getComputedStyleSpy: jasmine.Spy;
    let getBoundingClientRectSpy: jasmine.Spy;
    const isDarkMode = 'DARKMODE' as any;
    const defaultFormat = 'DEFAULTFORMAT' as any;
    const mockedSnapshotsManager = 'SNAPSHOTS' as any;

    beforeEach(() => {
        getComputedStyleSpy = jasmine.createSpy('getComputedStyleSpy');
        getBoundingClientRectSpy = jasmine.createSpy('getBoundingClientRect');

        div = {
            ownerDocument: {
                defaultView: {
                    getComputedStyle: getComputedStyleSpy,
                },
            },
            getBoundingClientRect: getBoundingClientRectSpy,
        };
        core = ({
            contentDiv: div,
            lifecycle: {
                isDarkMode,
            },
            format: {
                defaultFormat,
            },
            cache: {},
            undo: {
                snapshotsManager: mockedSnapshotsManager,
            },
        } as any) as StandaloneEditorCore;
    });

    it('LTR CSS', () => {
        getComputedStyleSpy.and.returnValue({
            direction: 'ltr',
        });

        const context = createEditorContext(core);

        expect(context).toEqual({
            isDarkMode,
            defaultFormat,
            addDelimiterForEntity: true,
            allowCacheElement: true,
            domIndexer: undefined,
            snapshots: mockedSnapshotsManager,
        });
    });

    it('RTL', () => {
        getComputedStyleSpy.and.returnValue({
            direction: 'rtl',
        });

        const context = createEditorContext(core);

        expect(context).toEqual({
            isDarkMode,
            defaultFormat,
            addDelimiterForEntity: true,
            isRootRtl: true,
            allowCacheElement: true,
            domIndexer: undefined,
            snapshots: mockedSnapshotsManager,
        });
    });
});
