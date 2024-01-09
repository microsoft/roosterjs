import { createEditorContext } from '../../lib/coreApi/createEditorContext';
import { StandaloneEditorCore } from 'roosterjs-content-model-types';

describe('createEditorContext', () => {
    it('create a normal context', () => {
        const isDarkMode = 'DARKMODE' as any;
        const defaultFormat = 'DEFAULTFORMAT' as any;
        const colorManager = 'COLOR' as any;
        const getComputedStyleSpy = jasmine.createSpy('getComputedStyleSpy');
        const getBoundingClientRectSpy = jasmine.createSpy('getBoundingClientRect');

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
            colorManager: colorManager,
            cache: {},
        } as any) as StandaloneEditorCore;

        const context = createEditorContext(core);

        expect(context).toEqual({
            isDarkMode,
            colorManager: colorManager,

            defaultFormat,
            addDelimiterForEntity: true,
            allowCacheElement: true,
            domIndexer: undefined,
        });
    });

    it('create a normal context with domIndexer', () => {
        const isDarkMode = 'DARKMODE' as any;
        const defaultFormat = 'DEFAULTFORMAT' as any;
        const colorManager = 'COLOR' as any;
        const getComputedStyleSpy = jasmine.createSpy('getComputedStyleSpy');
        const getBoundingClientRectSpy = jasmine.createSpy('getBoundingClientRect');
        const domIndexer = 'DOMINDEXER' as any;

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
            colorManager,
            cache: {
                domIndexer,
            },
        } as any) as StandaloneEditorCore;

        const context = createEditorContext(core);

        expect(context).toEqual({
            isDarkMode,
            colorManager,
            defaultFormat,
            addDelimiterForEntity: true,
            allowCacheElement: true,
            domIndexer,
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
    const colorManager = 'COLOR' as any;

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
            colorManager,
            cache: {},
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
            colorManager,
            addDelimiterForEntity: true,
            zoomScale: 1,
            allowCacheElement: true,
            domIndexer: undefined,
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
            colorManager,
            addDelimiterForEntity: true,
            zoomScale: 2,
            allowCacheElement: true,
            domIndexer: undefined,
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
            colorManager,
            addDelimiterForEntity: true,
            zoomScale: 0.5,
            allowCacheElement: true,
            domIndexer: undefined,
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
    const colorManager = 'COLOR' as any;

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
            colorManager,
            cache: {},
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
            colorManager,
            addDelimiterForEntity: true,
            allowCacheElement: true,
            domIndexer: undefined,
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
            colorManager,
            addDelimiterForEntity: true,
            isRootRtl: true,
            allowCacheElement: true,
            domIndexer: undefined,
        });
    });
});
