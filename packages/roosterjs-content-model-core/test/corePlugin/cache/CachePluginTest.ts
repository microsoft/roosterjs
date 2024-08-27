import * as textMutationObserver from '../../../lib/corePlugin/cache/textMutationObserver';
import { createCachePlugin } from '../../../lib/corePlugin/cache/CachePlugin';
import { DomIndexerImpl } from '../../../lib/corePlugin/cache/domIndexerImpl';
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
            init({ disableCache: true });
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
                disableCache: false,
            });
            expect(addEventListenerSpy).toHaveBeenCalledWith('selectionchange', jasmine.anything());
            expect(plugin.getState()).toEqual({
                domIndexer: new DomIndexerImpl(),
                textMutationObserver: mockedObserver,
            });
            expect(startObservingSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('logicalRootChanged event', () => {
        it('Change to a new node', () => {
            const startObservingSpy = jasmine.createSpy('startObserving');
            const stopObservingSpy = jasmine.createSpy('stopObserving');
            const mockedObserver = {
                startObserving: startObservingSpy,
                stopObserving: stopObservingSpy,
            } as any;
            const mockedNode = 'NODE' as any;

            const textMutationObserverSpy = spyOn(
                textMutationObserver,
                'createTextMutationObserver'
            ).and.returnValue(mockedObserver);

            init({});

            const state = plugin.getState();

            state.cachedModel = 'MODEL' as any;
            state.cachedSelection = 'SELECTION' as any;

            expect(stopObservingSpy).toHaveBeenCalledTimes(0);
            expect(startObservingSpy).toHaveBeenCalledTimes(1);
            expect(textMutationObserverSpy).toHaveBeenCalledTimes(1);

            plugin.onPluginEvent({
                eventType: 'logicalRootChanged',
                logicalRoot: mockedNode,
            });

            expect(state).toEqual({
                cachedModel: undefined,
                cachedSelection: undefined,
                domIndexer: new DomIndexerImpl(),
                textMutationObserver: mockedObserver,
            });
            expect(stopObservingSpy).toHaveBeenCalledTimes(1);
            expect(startObservingSpy).toHaveBeenCalledTimes(2);
            expect(textMutationObserverSpy).toHaveBeenCalledTimes(2);
            expect(textMutationObserverSpy.calls.argsFor(1)[0]).toBe(mockedNode);

            plugin.dispose();
        });
    });

    describe('KeyDown event', () => {
        beforeEach(() => {
            init({ disableCache: true });
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
            const node = 'NODE' as any;
            const offset = 0;
            state.cachedSelection = {
                type: 'range',
                start: { node, offset },
                end: { node, offset },
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
            const node = 'NODE' as any;
            state.cachedSelection = {
                type: 'range',
                start: { node, offset: 0 },
                end: { node, offset: 1 },
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
            init({
                disableCache: true,
            });
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
            init({ disableCache: true });
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
            init({ disableCache: true });
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

    describe('onMutation', () => {
        let onMutation: (mutation: textMutationObserver.Mutation) => void;
        let startObservingSpy: jasmine.Spy;
        let stopObservingSpy: jasmine.Spy;
        let mockedObserver: any;
        let reconcileChildListSpy: jasmine.Spy;
        let shouldIgnoreNodeSpy: jasmine.Spy;
        let mockedIndexer: DomIndexer;

        beforeEach(() => {
            reconcileChildListSpy = jasmine.createSpy('reconcileChildList');
            startObservingSpy = jasmine.createSpy('startObserving');
            stopObservingSpy = jasmine.createSpy('stopObserving');
            shouldIgnoreNodeSpy = jasmine.createSpy('shouldIgnoreNode');

            mockedObserver = {
                startObserving: startObservingSpy,
                stopObserving: stopObservingSpy,
                shouldIgnoreNode: shouldIgnoreNodeSpy,
            } as any;

            spyOn(textMutationObserver, 'createTextMutationObserver').and.callFake(
                (_: any, _onMutation: any) => {
                    onMutation = _onMutation;
                    return mockedObserver;
                }
            );

            init({});

            mockedIndexer = {
                reconcileSelection: reconcileSelectionSpy,
                reconcileChildList: reconcileChildListSpy,
            } as any;
        });

        it('unknown', () => {
            const state = plugin.getState();
            state.cachedModel = 'MODEL' as any;
            state.cachedSelection = 'SELECTION' as any;
            state.domIndexer = mockedIndexer;

            onMutation({ type: 'unknown' });

            expect(reconcileSelectionSpy).toHaveBeenCalledTimes(0);
            expect(reconcileChildListSpy).toHaveBeenCalledTimes(0);
            expect(state).toEqual({
                domIndexer: mockedIndexer,
                textMutationObserver: mockedObserver,
                cachedModel: undefined,
                cachedSelection: undefined,
            });
        });

        it('text, can reconcile', () => {
            reconcileSelectionSpy.and.returnValue(true);

            const state = plugin.getState();
            state.cachedModel = 'MODEL' as any;
            state.cachedSelection = 'SELECTION' as any;
            state.domIndexer = mockedIndexer;

            const mockedSelection = 'NEWSELECTION' as any;

            getDOMSelectionSpy.and.returnValue(mockedSelection);

            onMutation({ type: 'text' });

            expect(reconcileSelectionSpy).toHaveBeenCalledTimes(1);
            expect(reconcileChildListSpy).toHaveBeenCalledTimes(0);
            expect(state).toEqual({
                domIndexer: mockedIndexer,
                textMutationObserver: mockedObserver,
                cachedModel: 'MODEL' as any,
                cachedSelection: mockedSelection,
            });
        });

        it('text, cannot reconcile', () => {
            reconcileSelectionSpy.and.returnValue(false);

            const state = plugin.getState();
            state.cachedModel = 'MODEL' as any;
            state.cachedSelection = 'SELECTION' as any;
            state.domIndexer = mockedIndexer;

            const mockedSelection = 'NEWSELECTION' as any;

            getDOMSelectionSpy.and.returnValue(mockedSelection);

            onMutation({ type: 'text' });

            expect(reconcileSelectionSpy).toHaveBeenCalledTimes(1);
            expect(reconcileChildListSpy).toHaveBeenCalledTimes(0);
            expect(state).toEqual({
                domIndexer: mockedIndexer,
                textMutationObserver: mockedObserver,
                cachedModel: undefined,
                cachedSelection: undefined,
            });
        });

        it('childList, cannot reconcile', () => {
            const state = plugin.getState();
            state.cachedModel = 'MODEL' as any;
            state.cachedSelection = 'SELECTION' as any;
            state.domIndexer = mockedIndexer;

            const mockedSelection = 'NEWSELECTION' as any;

            getDOMSelectionSpy.and.returnValue(mockedSelection);

            reconcileChildListSpy.and.returnValue(false);

            onMutation({
                type: 'childList',
                addedNodes: 'ADDED' as any,
                removedNodes: 'REMOVED' as any,
            });

            expect(reconcileSelectionSpy).toHaveBeenCalledTimes(0);
            expect(reconcileChildListSpy).toHaveBeenCalledTimes(1);
            expect(reconcileChildListSpy).toHaveBeenCalledWith('ADDED', 'REMOVED');
            expect(state).toEqual({
                domIndexer: mockedIndexer,
                textMutationObserver: mockedObserver,
                cachedModel: undefined,
                cachedSelection: undefined,
            });
        });

        it('childList, can reconcile', () => {
            const state = plugin.getState();
            state.cachedModel = 'MODEL' as any;
            state.cachedSelection = 'SELECTION' as any;
            state.domIndexer = mockedIndexer;

            const mockedSelection = 'NEWSELECTION' as any;

            getDOMSelectionSpy.and.returnValue(mockedSelection);

            reconcileChildListSpy.and.returnValue(true);

            onMutation({
                type: 'childList',
                addedNodes: 'ADDED' as any,
                removedNodes: 'REMOVED' as any,
            });

            expect(reconcileSelectionSpy).toHaveBeenCalledTimes(0);
            expect(reconcileChildListSpy).toHaveBeenCalledTimes(1);
            expect(reconcileChildListSpy).toHaveBeenCalledWith('ADDED', 'REMOVED');
            expect(state).toEqual({
                domIndexer: mockedIndexer,
                textMutationObserver: mockedObserver,
                cachedModel: 'MODEL' as any,
                cachedSelection: 'SELECTION' as any,
            });
        });
    });
});
