import { createContentModelCachePlugin } from '../../lib/corePlugin/ContentModelCachePlugin';
import { IEditor, PluginEventType, PluginWithState } from 'roosterjs-editor-types';
import {
    ContentModelCachePluginState,
    ContentModelDomIndexer,
    IStandaloneEditor,
} from 'roosterjs-content-model-types';

describe('ContentModelCachePlugin', () => {
    let plugin: PluginWithState<ContentModelCachePluginState>;
    let editor: IStandaloneEditor & IEditor;

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
        } as any) as IStandaloneEditor & IEditor;

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
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'Enter',
                } as any,
            });

            expect(plugin.getState()).toEqual({
                cachedModel: null,
                previousSelection: null,
                domIndexer: undefined,
            });
        });

        it('Other key without selection', () => {
            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'B',
                } as any,
            });

            expect(plugin.getState()).toEqual({
                cachedModel: null,
                previousSelection: null,
                domIndexer: undefined,
            });
        });

        it('Other key with collapsed selection', () => {
            const state = plugin.getState();
            state.previousSelection = {
                type: 'range',
                range: { collapsed: true } as any,
            };

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'B',
                } as any,
            });

            expect(state).toEqual({
                previousSelection: { type: 'range', range: { collapsed: true } as any },
                domIndexer: undefined,
                cachedModel: null,
            });
        });

        it('Expanded selection with text input', () => {
            const state = plugin.getState();
            state.previousSelection = {
                type: 'range',
                range: { collapsed: false } as any,
            };

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'B',
                } as any,
            });

            expect(state).toEqual({
                cachedModel: null,
                previousSelection: {
                    type: 'range',
                    range: { collapsed: false } as any,
                },
                domIndexer: undefined,
            });
        });

        it('Expanded selection with arrow input', () => {
            const state = plugin.getState();
            state.previousSelection = {
                type: 'range',
                range: { collapsed: false } as any,
            };

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'ArrowUp',
                } as any,
            });

            expect(state).toEqual({
                previousSelection: {
                    type: 'range',
                    range: { collapsed: false } as any,
                },
                cachedModel: null,
                domIndexer: undefined,
            });
        });

        it('Table selection', () => {
            const state = plugin.getState();
            state.previousSelection = {
                type: 'table',
            } as any;

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'B',
                } as any,
            });

            expect(state).toEqual({
                cachedModel: null,
                previousSelection: {
                    type: 'table',
                } as any,
                domIndexer: undefined,
            });
        });

        it('Image selection', () => {
            const state = plugin.getState();
            state.previousSelection = {
                type: 'image',
            } as any;

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'B',
                } as any,
            });

            expect(state).toEqual({
                cachedModel: null,
                previousSelection: {
                    type: 'image',
                } as any,
                domIndexer: undefined,
            });
        });

        it('Do not clear cache when in shadow edit', () => {
            const state = plugin.getState();
            isInShadowEditSpy.and.returnValue(true);

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'Enter',
                } as any,
            });

            expect(state).toEqual({
                domIndexer: undefined,
                cachedModel: null,
                previousSelection: null,
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
            state.cachedModel = null;
            state.previousSelection = null;

            const selection = 'MockedRange' as any;
            getDOMSelectionSpy.and.returnValue(selection);

            plugin.onPluginEvent({
                eventType: PluginEventType.Input,
                rawEvent: null!,
            });

            expect(state).toEqual({
                cachedModel: null,
                previousSelection: null,
                domIndexer: undefined,
            });
        });

        it('No cached range, has cached model', () => {
            const selection = 'MockedRange' as any;
            const model = 'MockedModel' as any;
            const state = plugin.getState();

            state.cachedModel = model;
            state.previousSelection = null;

            getDOMSelectionSpy.and.returnValue(selection);

            plugin.onPluginEvent({
                eventType: PluginEventType.Input,
                rawEvent: null!,
            });

            expect(state).toEqual({
                cachedModel: null,
                previousSelection: null,
                domIndexer: undefined,
            });
        });

        it('No cached range, has cached model, reconcile succeed', () => {
            const selection = 'MockedRange' as any;
            const model = 'MockedModel' as any;
            const state = plugin.getState();

            state.cachedModel = model;
            state.previousSelection = null;
            state.domIndexer = domIndexer;

            getDOMSelectionSpy.and.returnValue(selection);
            reconcileSelectionSpy.and.returnValue(true);

            plugin.onPluginEvent({
                eventType: PluginEventType.Input,
                rawEvent: null!,
            });

            expect(state).toEqual({
                cachedModel: model,
                previousSelection: selection,
                domIndexer: domIndexer,
            });
        });

        it('has cached range, has cached model', () => {
            const oldRangeEx = 'MockedRangeOld' as any;
            const newRangeEx = 'MockedRangeNew' as any;
            const model = 'MockedModel' as any;
            const state = plugin.getState();

            state.cachedModel = model;
            state.previousSelection = oldRangeEx;
            getDOMSelectionSpy.and.returnValue(newRangeEx);

            plugin.onPluginEvent({
                eventType: PluginEventType.Input,
                rawEvent: null!,
            });

            expect(state).toEqual({
                cachedModel: null,
                previousSelection: null,
                domIndexer: undefined,
            });
        });

        it('has cached range, has cached model, has domIndexer', () => {
            const oldRangeEx = 'MockedRangeOld' as any;
            const newRangeEx = 'MockedRangeNew' as any;
            const model = 'MockedModel' as any;
            const state = plugin.getState();

            state.cachedModel = model;
            state.previousSelection = oldRangeEx;
            state.domIndexer = domIndexer;

            getDOMSelectionSpy.and.returnValue(newRangeEx);
            reconcileSelectionSpy.and.returnValue(true);

            plugin.onPluginEvent({
                eventType: PluginEventType.Input,
                rawEvent: null!,
            });

            expect(state).toEqual({
                cachedModel: model,
                previousSelection: newRangeEx,
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
            state.previousSelection = selection;
            state.domIndexer = domIndexer;

            getDOMSelectionSpy.and.returnValue(selection);
            reconcileSelectionSpy.and.returnValue(true);

            plugin.onPluginEvent({
                eventType: PluginEventType.SelectionChanged,
                selectionRangeEx: selection,
            });

            expect(state).toEqual({
                cachedModel: model,
                previousSelection: selection,
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
            state.previousSelection = oldRangeEx;
            state.domIndexer = domIndexer;

            reconcileSelectionSpy.and.returnValue(true);
            getDOMSelectionSpy.and.returnValue(newRangeEx);

            plugin.onPluginEvent({
                eventType: PluginEventType.SelectionChanged,
                selectionRangeEx: newRangeEx,
            });

            expect(state).toEqual({
                cachedModel: model,
                previousSelection: newRangeEx,
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
            state.previousSelection = oldRangeEx;
            state.domIndexer = domIndexer;

            reconcileSelectionSpy.and.returnValue(false);
            getDOMSelectionSpy.and.returnValue(newRangeEx);

            plugin.onPluginEvent({
                eventType: PluginEventType.SelectionChanged,
                selectionRangeEx: newRangeEx,
            });

            expect(state).toEqual({
                cachedModel: null,
                previousSelection: null,
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
            state.previousSelection = null;

            plugin.onPluginEvent({
                eventType: PluginEventType.ContentChanged,
                source: '',
            });

            expect(state).toEqual({
                cachedModel: null,
                previousSelection: null,
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
            state.previousSelection = oldRangeEx;

            reconcileSelectionSpy.and.returnValue(true);

            plugin.onPluginEvent({
                eventType: PluginEventType.ContentChanged,
                source: '',
                contentModel: model,
                selection: newRangeEx,
            } as any);

            expect(state).toEqual({
                cachedModel: null,
                previousSelection: null,
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
            state.previousSelection = oldRangeEx;
            state.domIndexer = domIndexer;

            reconcileSelectionSpy.and.returnValue(true);

            plugin.onPluginEvent({
                eventType: PluginEventType.ContentChanged,
                source: '',
                contentModel: model,
                selection: newRangeEx,
            } as any);

            expect(state).toEqual({
                cachedModel: model,
                previousSelection: newRangeEx,
                domIndexer,
            });
            expect(reconcileSelectionSpy).not.toHaveBeenCalled();
        });
    });
});
