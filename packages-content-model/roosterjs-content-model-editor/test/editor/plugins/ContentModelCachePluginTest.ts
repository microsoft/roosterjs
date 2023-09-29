import { ContentModelCachePluginState } from '../../../lib/publicTypes/pluginState/ContentModelCachePluginState';
import { ContentModelDomIndexer } from 'roosterjs-content-model-types';
import { default as ContentModelCachePlugin } from '../../../lib/editor/corePlugins/ContentModelCachePlugin';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import { Keys, PluginEventType } from 'roosterjs-editor-types';

describe('ContentModelCachePlugin', () => {
    let plugin: ContentModelCachePlugin;
    let state: ContentModelCachePluginState;
    let editor: IContentModelEditor;

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

        state = {};
        editor = ({
            getDOMSelection: getDOMSelectionSpy,
            isInShadowEdit: isInShadowEditSpy,
            getDocument: () => {
                return {
                    addEventListener: addEventListenerSpy,
                    removeEventListener: removeEventListenerSpy,
                };
            },
        } as any) as IContentModelEditor;

        plugin = new ContentModelCachePlugin(state);
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
                    which: Keys.ENTER,
                } as any,
            });

            expect(state).toEqual({
                cachedModel: undefined,
                cachedSelection: undefined,
            });
        });

        it('Other key', () => {
            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    which: Keys.B,
                } as any,
            });

            expect(state).toEqual({});
        });

        it('Do not clear cache when in shadow edit', () => {
            isInShadowEditSpy.and.returnValue(true);

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    which: Keys.ENTER,
                } as any,
            });

            expect(state).toEqual({});
        });
    });

    describe('Input event', () => {
        beforeEach(init);
        afterEach(() => {
            plugin.dispose();
        });

        it('No cached range, no cached model', () => {
            state.cachedModel = undefined;
            state.cachedSelection = undefined;

            const selection = 'MockedRange' as any;
            getDOMSelectionSpy.and.returnValue(selection);

            plugin.onPluginEvent({
                eventType: PluginEventType.Input,
                rawEvent: null!,
            });

            expect(state).toEqual({
                cachedModel: undefined,
                cachedSelection: undefined,
            });
        });

        it('No cached range, has cached model', () => {
            const selection = 'MockedRange' as any;
            const model = 'MockedModel' as any;

            state.cachedModel = model;
            state.cachedSelection = undefined;

            getDOMSelectionSpy.and.returnValue(selection);

            plugin.onPluginEvent({
                eventType: PluginEventType.Input,
                rawEvent: null!,
            });

            expect(state).toEqual({
                cachedModel: undefined,
                cachedSelection: undefined,
            });
        });

        it('No cached range, has cached model, reconcile succeed', () => {
            const selection = 'MockedRange' as any;
            const model = 'MockedModel' as any;

            state.cachedModel = model;
            state.cachedSelection = undefined;
            state.domIndexer = domIndexer;

            getDOMSelectionSpy.and.returnValue(selection);
            reconcileSelectionSpy.and.returnValue(true);

            plugin.onPluginEvent({
                eventType: PluginEventType.Input,
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

            state.cachedModel = model;
            state.cachedSelection = oldRangeEx;
            getDOMSelectionSpy.and.returnValue(newRangeEx);

            plugin.onPluginEvent({
                eventType: PluginEventType.Input,
                rawEvent: null!,
            });

            expect(state).toEqual({
                cachedModel: undefined,
                cachedSelection: undefined,
            });
        });

        it('has cached range, has cached model, has domIndexer', () => {
            const oldRangeEx = 'MockedRangeOld' as any;
            const newRangeEx = 'MockedRangeNew' as any;
            const model = 'MockedModel' as any;

            state.cachedModel = model;
            state.cachedSelection = oldRangeEx;
            state.domIndexer = domIndexer;

            getDOMSelectionSpy.and.returnValue(newRangeEx);
            reconcileSelectionSpy.and.returnValue(true);

            plugin.onPluginEvent({
                eventType: PluginEventType.Input,
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

            state.cachedModel = model;
            state.cachedSelection = selection;
            state.domIndexer = domIndexer;

            getDOMSelectionSpy.and.returnValue(selection);
            reconcileSelectionSpy.and.returnValue(true);

            plugin.onPluginEvent({
                eventType: PluginEventType.SelectionChanged,
                selectionRangeEx: selection,
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

            state.cachedModel = model;
            state.cachedSelection = oldRangeEx;
            state.domIndexer = domIndexer;

            reconcileSelectionSpy.and.returnValue(true);
            getDOMSelectionSpy.and.returnValue(newRangeEx);

            plugin.onPluginEvent({
                eventType: PluginEventType.SelectionChanged,
                selectionRangeEx: newRangeEx,
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

            state.cachedModel = model;
            state.cachedSelection = oldRangeEx;
            state.domIndexer = domIndexer;

            reconcileSelectionSpy.and.returnValue(false);
            getDOMSelectionSpy.and.returnValue(newRangeEx);

            plugin.onPluginEvent({
                eventType: PluginEventType.SelectionChanged,
                selectionRangeEx: newRangeEx,
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

            state.cachedModel = model;
            state.cachedSelection = undefined;

            plugin.onPluginEvent({
                eventType: PluginEventType.ContentChanged,
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

            state.cachedModel = model;
            state.cachedSelection = oldRangeEx;

            reconcileSelectionSpy.and.returnValue(true);

            plugin.onPluginEvent({
                eventType: PluginEventType.ContentChanged,
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

            state.cachedModel = model;
            state.cachedSelection = oldRangeEx;
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
                cachedSelection: newRangeEx,
                domIndexer,
            });
            expect(reconcileSelectionSpy).not.toHaveBeenCalled();
        });
    });
});
