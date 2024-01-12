import { createContentModelCachePlugin } from '../../lib/corePlugin/ContentModelCachePlugin';
import {
    ContentModelCachePluginState,
    ContentModelDomIndexer,
    IStandaloneEditor,
    PluginWithState,
} from 'roosterjs-content-model-types';

describe('ContentModelCachePlugin', () => {
    let plugin: PluginWithState<ContentModelCachePluginState>;
    let editor: IStandaloneEditor;

    let addEventListenerSpy: jasmine.Spy;
    let removeEventListenerSpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;
    let reconcileSelectionSpy: jasmine.Spy;
    let isInShadowEditSpy: jasmine.Spy;
    let domIndexer: ContentModelDomIndexer;

    function init() {
        addEventListenerSpy = jasmine.createSpy('addEventListenerSpy');
        removeEventListenerSpy = jasmine.createSpy('removeEventListener');
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        reconcileSelectionSpy = jasmine.createSpy('reconcileSelection');
        isInShadowEditSpy = jasmine.createSpy('isInShadowEdit');

        domIndexer = {
            reconcileSelection: reconcileSelectionSpy,
        } as any;

        editor = ({
            getDOMSelection: getDOMSelectionSpy,
            isInShadowEdit: isInShadowEditSpy,
            getDocument: () => {
                return {
                    addEventListener: addEventListenerSpy,
                    removeEventListener: removeEventListenerSpy,
                };
            },
        } as any) as IStandaloneEditor;

        plugin = createContentModelCachePlugin({});
        plugin.initialize(editor);
    }

    describe('initialize', () => {
        beforeEach(init);
        afterEach(() => {
            plugin.dispose();
        });

        it('initialize', () => {
            expect(addEventListenerSpy).toHaveBeenCalledWith('selectionchange', jasmine.anything());
        });
    });

    describe('KeyDown event', () => {
        beforeEach(init);
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
                domIndexer: undefined,
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
                domIndexer: undefined,
            });
        });

        it('Other key with collapsed selection', () => {
            const state = plugin.getState();
            state.cachedSelection = {
                type: 'range',
                range: { collapsed: true } as any,
            };

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'B',
                } as any,
            });

            expect(state).toEqual({
                cachedSelection: { type: 'range', range: { collapsed: true } as any },
                domIndexer: undefined,
            });
        });

        it('Expanded selection with text input', () => {
            const state = plugin.getState();
            state.cachedSelection = {
                type: 'range',
                range: { collapsed: false } as any,
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
                domIndexer: undefined,
            });
        });

        it('Expanded selection with arrow input', () => {
            const state = plugin.getState();
            state.cachedSelection = {
                type: 'range',
                range: { collapsed: false } as any,
            };

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'ArrowUp',
                } as any,
            });

            expect(state).toEqual({
                cachedSelection: {
                    type: 'range',
                    range: { collapsed: false } as any,
                },
                domIndexer: undefined,
            });
        });

        it('Table selection', () => {
            const state = plugin.getState();
            state.cachedSelection = {
                type: 'table',
            } as any;

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'B',
                } as any,
            });

            expect(state).toEqual({
                cachedModel: undefined,
                cachedSelection: undefined,
                domIndexer: undefined,
            });
        });

        it('Image selection', () => {
            const state = plugin.getState();
            state.cachedSelection = {
                type: 'image',
            } as any;

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'B',
                } as any,
            });

            expect(state).toEqual({
                cachedModel: undefined,
                cachedSelection: undefined,
                domIndexer: undefined,
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

            expect(state).toEqual({
                domIndexer: undefined,
            });
        });
    });

    describe('Input event', () => {
        beforeEach(init);
        afterEach(() => {
            plugin.dispose();
        });

        it('No cached range, no cached model', () => {
            const state = plugin.getState();
            state.cachedModel = undefined;
            state.cachedSelection = undefined;

            const selection = 'MockedRange' as any;
            getDOMSelectionSpy.and.returnValue(selection);

            plugin.onPluginEvent({
                eventType: 'input',
                rawEvent: null!,
            });

            expect(state).toEqual({
                cachedModel: undefined,
                cachedSelection: undefined,
                domIndexer: undefined,
            });
        });

        it('No cached range, has cached model', () => {
            const selection = 'MockedRange' as any;
            const model = 'MockedModel' as any;
            const state = plugin.getState();

            state.cachedModel = model;
            state.cachedSelection = undefined;

            getDOMSelectionSpy.and.returnValue(selection);

            plugin.onPluginEvent({
                eventType: 'input',
                rawEvent: null!,
            });

            expect(state).toEqual({
                cachedModel: undefined,
                cachedSelection: undefined,
                domIndexer: undefined,
            });
        });

        it('No cached range, has cached model, reconcile succeed', () => {
            const selection = 'MockedRange' as any;
            const model = 'MockedModel' as any;
            const state = plugin.getState();

            state.cachedModel = model;
            state.cachedSelection = undefined;
            state.domIndexer = domIndexer;

            getDOMSelectionSpy.and.returnValue(selection);
            reconcileSelectionSpy.and.returnValue(true);

            plugin.onPluginEvent({
                eventType: 'input',
                rawEvent: null!,
            });

            expect(state).toEqual({
                cachedModel: model,
                cachedSelection: selection,
                domIndexer: domIndexer,
            });
        });

        it('has cached range, has cached model', () => {
            const oldRangeEx = 'MockedRangeOld' as any;
            const newRangeEx = 'MockedRangeNew' as any;
            const model = 'MockedModel' as any;
            const state = plugin.getState();

            state.cachedModel = model;
            state.cachedSelection = oldRangeEx;
            getDOMSelectionSpy.and.returnValue(newRangeEx);

            plugin.onPluginEvent({
                eventType: 'input',
                rawEvent: null!,
            });

            expect(state).toEqual({
                cachedModel: undefined,
                cachedSelection: undefined,
                domIndexer: undefined,
            });
        });

        it('has cached range, has cached model, has domIndexer', () => {
            const oldRangeEx = 'MockedRangeOld' as any;
            const newRangeEx = 'MockedRangeNew' as any;
            const model = 'MockedModel' as any;
            const state = plugin.getState();

            state.cachedModel = model;
            state.cachedSelection = oldRangeEx;
            state.domIndexer = domIndexer;

            getDOMSelectionSpy.and.returnValue(newRangeEx);
            reconcileSelectionSpy.and.returnValue(true);

            plugin.onPluginEvent({
                eventType: 'input',
                rawEvent: null!,
            });

            expect(state).toEqual({
                cachedModel: model,
                cachedSelection: newRangeEx,
                domIndexer,
            });
        });
    });

    describe('SelectionChanged', () => {
        beforeEach(init);
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
        beforeEach(init);
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
                domIndexer: undefined,
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
                domIndexer: undefined,
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
