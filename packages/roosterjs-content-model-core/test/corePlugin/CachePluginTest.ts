import * as textMutationObserver from '../../lib/corePlugin/utils/textMutationObserver';
import { createCachePlugin } from '../../lib/corePlugin/CachePlugin';
import { domIndexerImpl } from '../../lib/corePlugin/utils/domIndexerImpl';
import {
    CachePluginState,
    DomIndexer,
    IEditor,
    PluginWithState,
    EditorOptions,
} from 'roosterjs-content-model-types';

describe('CachePlugin', () => {
    let plugin: PluginWithState<CachePluginState>;
    let editor: IEditor;

    let addEventListenerSpy: jasmine.Spy;
    let removeEventListenerSpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;
    let reconcileSelectionSpy: jasmine.Spy;
    let isInShadowEditSpy: jasmine.Spy;
    let domIndexer: DomIndexer;
    let contentDiv: HTMLDivElement;

    function init(option: EditorOptions) {
        addEventListenerSpy = jasmine.createSpy('addEventListenerSpy');
        removeEventListenerSpy = jasmine.createSpy('removeEventListener');
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        reconcileSelectionSpy = jasmine.createSpy('reconcileSelection');
        isInShadowEditSpy = jasmine.createSpy('isInShadowEdit');

        domIndexer = {
            reconcileSelection: reconcileSelectionSpy,
        } as any;

        contentDiv = document.createElement('div');

        editor = ({
            getDOMSelection: getDOMSelectionSpy,
            isInShadowEdit: isInShadowEditSpy,
            getDocument: () => {
                return {
                    addEventListener: addEventListenerSpy,
                    removeEventListener: removeEventListenerSpy,
                };
            },
        } as any) as IEditor;

        plugin = createCachePlugin(option, contentDiv);
        plugin.initialize(editor);
    }

    describe('initialize', () => {
        afterEach(() => {
            plugin.dispose();
        });

        it('initialize', () => {
            init({});
            expect(addEventListenerSpy).toHaveBeenCalledWith('selectionchange', jasmine.anything());
            expect(plugin.getState()).toEqual({});
        });

        it('initialize with cache', () => {
            const startObservingSpy = jasmine.createSpy('startObserving');
            const stopObservingSpy = jasmine.createSpy('stopObserving');
            const mockedObserver = {
                startObserving: startObservingSpy,
                stopObserving: stopObservingSpy,
            } as any;
            spyOn(textMutationObserver, 'createTextMutationObserver').and.returnValue(
                mockedObserver
            );
            init({
                cacheModel: true,
            });
            expect(addEventListenerSpy).toHaveBeenCalledWith('selectionchange', jasmine.anything());
            expect(plugin.getState()).toEqual({
                domIndexer: domIndexerImpl,
                textMutationObserver: mockedObserver,
            });
            expect(startObservingSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('KeyDown event', () => {
        beforeEach(() => {
            init({});
        });
        afterEach(() => {
            plugin.dispose();
        });

        it('ENTER key', () => {
            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Enter',
                } as any,
            });

            expect(plugin.getState()).toEqual({
                cachedModel: undefined,
                cachedSelection: undefined,
            });
        });

        it('Other key without selection', () => {
            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'B',
                } as any,
            });

            expect(plugin.getState()).toEqual({
                cachedModel: undefined,
                cachedSelection: undefined,
            });
        });

        it('Other key with collapsed selection', () => {
            const state = plugin.getState();
            state.cachedSelection = {
                type: 'range',
                range: { collapsed: true } as any,
                isReverted: false,
            };

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'B',
                } as any,
            });

            expect(state).toEqual({
                cachedModel: undefined,
                cachedSelection: undefined,
            });
        });

        it('Expanded selection with arrow input', () => {
            const state = plugin.getState();
            state.cachedSelection = {
                type: 'range',
                range: { collapsed: false } as any,
                isReverted: false,
            };

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'ArrowUp',
                } as any,
            });

            expect(state).toEqual({
                cachedModel: undefined,
                cachedSelection: undefined,
            });
        });

        it('Do not clear cache when in shadow edit', () => {
            const state = plugin.getState();
            isInShadowEditSpy.and.returnValue(true);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Enter',
                } as any,
            });

            expect(state).toEqual({});
        });
    });

    describe('Input event', () => {
        beforeEach(() => {
            init({});
        });
        afterEach(() => {
            plugin.dispose();
        });

        it('No cached range, no cached model', () => {
            const state = plugin.getState();

            const selection = 'MockedRange' as any;
            getDOMSelectionSpy.and.returnValue(selection);

            plugin.onPluginEvent({
                eventType: 'input',
                rawEvent: null!,
            });

            expect(state).toEqual({
                cachedModel: undefined,
                cachedSelection: undefined,
            });
        });
    });

    describe('SelectionChanged', () => {
        beforeEach(() => {
            init({});
        });
        afterEach(() => {
            plugin.dispose();
        });

        it('Same range', () => {
            const selection = 'MockedRange' as any;
            const model = 'MockedModel' as any;
            const state = plugin.getState();

            state.cachedModel = model;
            state.cachedSelection = selection;
            state.domIndexer = domIndexer;

            getDOMSelectionSpy.and.returnValue(selection);
            reconcileSelectionSpy.and.returnValue(true);

            plugin.onPluginEvent({
                eventType: 'selectionChanged',
                newSelection: selection,
            });

            expect(state).toEqual({
                cachedModel: model,
                cachedSelection: selection,
                domIndexer,
            });
            expect(reconcileSelectionSpy).not.toHaveBeenCalled();
        });

        it('Different range', () => {
            const oldRangeEx = 'MockedRangeOld' as any;
            const newRangeEx = 'MockedRangeNew' as any;
            const model = 'MockedModel' as any;
            const state = plugin.getState();

            state.cachedModel = model;
            state.cachedSelection = oldRangeEx;
            state.domIndexer = domIndexer;

            reconcileSelectionSpy.and.returnValue(true);
            getDOMSelectionSpy.and.returnValue(newRangeEx);

            plugin.onPluginEvent({
                eventType: 'selectionChanged',
                newSelection: newRangeEx,
            });

            expect(state).toEqual({
                cachedModel: model,
                cachedSelection: newRangeEx,
                domIndexer,
            });
            expect(reconcileSelectionSpy).toHaveBeenCalledWith(model, newRangeEx, oldRangeEx);
        });

        it('Different range and fail to reconcile', () => {
            const oldRangeEx = 'MockedRangeOld' as any;
            const newRangeEx = 'MockedRangeNew' as any;
            const model = 'MockedModel' as any;
            const state = plugin.getState();

            state.cachedModel = model;
            state.cachedSelection = oldRangeEx;
            state.domIndexer = domIndexer;

            reconcileSelectionSpy.and.returnValue(false);
            getDOMSelectionSpy.and.returnValue(newRangeEx);

            plugin.onPluginEvent({
                eventType: 'selectionChanged',
                newSelection: newRangeEx,
            });

            expect(state).toEqual({
                cachedModel: undefined,
                cachedSelection: undefined,
                domIndexer,
            });
            expect(reconcileSelectionSpy).toHaveBeenCalledWith(model, newRangeEx, oldRangeEx);
        });
    });

    describe('ContentChanged', () => {
        beforeEach(() => {
            init({});
        });
        afterEach(() => {
            plugin.dispose();
        });

        it('No domIndexer, no model in event', () => {
            const model = 'MockedModel' as any;
            const state = plugin.getState();

            state.cachedModel = model;
            state.cachedSelection = undefined;

            plugin.onPluginEvent({
                eventType: 'contentChanged',
                source: '',
            });

            expect(state).toEqual({
                cachedModel: undefined,
                cachedSelection: undefined,
            });
            expect(reconcileSelectionSpy).not.toHaveBeenCalled();
        });

        it('No domIndexer, has model in event', () => {
            const oldRangeEx = 'MockedRangeOld' as any;
            const newRangeEx = 'MockedRangeNew' as any;
            const model = 'MockedModel' as any;
            const state = plugin.getState();

            state.cachedModel = model;
            state.cachedSelection = oldRangeEx;

            reconcileSelectionSpy.and.returnValue(true);

            plugin.onPluginEvent({
                eventType: 'contentChanged',
                source: '',
                contentModel: model,
                selection: newRangeEx,
            } as any);

            expect(state).toEqual({
                cachedModel: undefined,
                cachedSelection: undefined,
            });
            expect(reconcileSelectionSpy).not.toHaveBeenCalled();
        });

        it('Has domIndexer, has model in event', () => {
            const oldRangeEx = 'MockedRangeOld' as any;
            const newRangeEx = 'MockedRangeNew' as any;
            const model = 'MockedModel' as any;
            const state = plugin.getState();

            state.cachedModel = model;
            state.cachedSelection = oldRangeEx;
            state.domIndexer = domIndexer;

            reconcileSelectionSpy.and.returnValue(true);

            plugin.onPluginEvent({
                eventType: 'contentChanged',
                source: '',
                contentModel: model,
                selection: newRangeEx,
            } as any);

            expect(state).toEqual({
                cachedModel: model,
                cachedSelection: newRangeEx,
                domIndexer,
            });
            expect(reconcileSelectionSpy).not.toHaveBeenCalled();
        });
    });
});
