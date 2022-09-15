import * as isCharacterValue from 'roosterjs-editor-dom/lib/event/isCharacterValue';
import DOMEventPlugin from '../../lib/corePlugins/DOMEventPlugin';
import {
    ChangeSource,
    DOMEventPluginState,
    IEditor,
    PluginEventType,
} from 'roosterjs-editor-types';

const getDocument = () => document;

describe('DOMEventPlugin', () => {
    it('init and dispose', () => {
        const addEventListener = jasmine.createSpy('addEventListener');
        const removeEventListener = jasmine.createSpy('removeEventListener');
        const div = <any>{
            addEventListener,
            removeEventListener,
        };
        const plugin = new DOMEventPlugin({}, div);
        const disposer = jasmine.createSpy('disposer');
        const addDomEventHandler = jasmine
            .createSpy('addDomEventHandler')
            .and.returnValue(disposer);
        const state = plugin.getState();
        plugin.initialize(<IEditor>(<any>{
            getDocument,
            addDomEventHandler,
        }));

        expect(addEventListener).toHaveBeenCalledTimes(1);
        expect(addEventListener.calls.argsFor(0)[0]).toBe('scroll');

        expect(state).toEqual({
            isInIME: false,
            scrollContainer: div,
            selectionRange: null,
            stopPrintableKeyboardEventPropagation: true,
            contextMenuProviders: [],
            tableSelectionRange: null,
            imageSelectionRange: null,
        });

        expect(addDomEventHandler).toHaveBeenCalled();
        expect(removeEventListener).not.toHaveBeenCalled();
        expect(disposer).not.toHaveBeenCalled();

        plugin.dispose();

        expect(removeEventListener).toHaveBeenCalled();
        expect(disposer).toHaveBeenCalled();
    });

    it('init with different options', () => {
        const addEventListener1 = jasmine.createSpy('addEventListener1');
        const addEventListener2 = jasmine.createSpy('addEventListener2');
        const div = <any>{
            addEventListener: addEventListener1,
        };
        const divScrollContainer = <any>{
            addEventListener: addEventListener2,
            removeEventListener: jasmine.createSpy('removeEventListener'),
        };
        const plugin = new DOMEventPlugin(
            {
                scrollContainer: divScrollContainer,
                allowKeyboardEventPropagation: true,
            },
            div
        );
        const state = plugin.getState();

        const addDomEventHandler = jasmine
            .createSpy('addDomEventHandler')
            .and.returnValue(jasmine.createSpy('disposer'));
        plugin.initialize(<IEditor>(<any>{
            getDocument,
            addDomEventHandler,
        }));

        expect(addEventListener1).not.toHaveBeenCalledTimes(1);
        expect(addEventListener2).toHaveBeenCalledTimes(1);
        expect(addEventListener2.calls.argsFor(0)[0]).toBe('scroll');

        expect(state).toEqual({
            isInIME: false,
            scrollContainer: divScrollContainer,
            selectionRange: null,
            stopPrintableKeyboardEventPropagation: false,
            contextMenuProviders: [],
            tableSelectionRange: null,
            imageSelectionRange: null,
        });

        expect(addDomEventHandler).toHaveBeenCalled();

        plugin.dispose();
    });
});

describe('DOMEventPlugin verify event handlers while allow keyboard event propagation', () => {
    let eventMap: Record<string, (event: Event) => void>;
    let plugin: DOMEventPlugin;
    let state: DOMEventPluginState;
    let triggerPluginEvent: jasmine.Spy;
    let addUndoSnapshot: jasmine.Spy;
    let select: jasmine.Spy;
    let getSelectionRange: jasmine.Spy;
    let getSelectionRangeResult: Range;

    beforeEach(() => {
        const div = <any>{
            addEventListener: jasmine.createSpy('addEventListener1'),
            removeEventListener: jasmine.createSpy('removeEventListener'),
        };

        getSelectionRangeResult = document.createRange();

        plugin = new DOMEventPlugin({ allowKeyboardEventPropagation: true }, div);
        state = plugin.getState();
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        addUndoSnapshot = jasmine.createSpy('addUndoSnapshot');
        select = jasmine.createSpy('select');
        getSelectionRange = jasmine.createSpy().and.returnValue(getSelectionRangeResult);
        const editor = <IEditor>(<any>{
            getDocument,
            addDomEventHandler: (map: Record<string, any>) => {
                eventMap = map;
                return jasmine.createSpy('disposer');
            },
            triggerPluginEvent,
            addUndoSnapshot,
            select,
            getSelectionRange,
        });
        editor.runAsync = (callback: any) => callback(editor);

        plugin.initialize(editor);
    });

    afterEach(() => {
        plugin.dispose();
        eventMap = undefined;
    });

    it('check events are mapped', () => {
        expect(eventMap).toBeDefined();
        expect(eventMap.keypress).toBe(PluginEventType.KeyPress);
        expect(eventMap.keydown).toBe(PluginEventType.KeyDown);
        expect(eventMap.keyup).toBe(PluginEventType.KeyUp);
        expect(eventMap.mousedown).toBe(PluginEventType.MouseDown);
        expect(eventMap.input).toBe(PluginEventType.Input);
        expect(eventMap.compositionstart).toBeDefined();
        expect(eventMap.compositionend).toBeDefined();
        expect(eventMap.drop).toBeDefined();
        expect(eventMap.focus).toBeDefined();
    });

    it('verify composition event', () => {
        expect(state.isInIME).toBeFalsy();

        eventMap.compositionstart(<Event>{});
        expect(state.isInIME).toBeTruthy();

        const event = <Event>{};
        eventMap.compositionend(event);
        expect(state.isInIME).toBeFalsy();
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.CompositionEnd, {
            rawEvent: event,
        });
    });

    it('verify drop event', () => {
        eventMap.drop(<Event>{
            type: 'drop',
        });

        expect(addUndoSnapshot).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot.calls.argsFor(0)[1]).toBe(ChangeSource.Drop);
    });

    it('verify focus event', () => {
        const range = document.createRange();
        state.selectionRange = range;
        eventMap.focus(<Event>{});

        expect(select).toHaveBeenCalledTimes(1);
        expect(select.calls.argsFor(0)[0]).toBe(range);
        expect(state.selectionRange).toBeNull();
    });
});

describe('DOMEventPlugin verify event handlers while disallow keyboard event propagation', () => {
    let eventMap: Record<string, any>;
    let plugin: DOMEventPlugin;
    let state: DOMEventPluginState;

    beforeEach(() => {
        const div = <any>{
            addEventListener: jasmine.createSpy('addEventListener1'),
            removeEventListener: jasmine.createSpy('removeEventListener'),
        };

        plugin = new DOMEventPlugin({}, div);
        state = plugin.getState();
        plugin.initialize(<IEditor>(<any>{
            getDocument,
            addDomEventHandler: (map: Record<string, any>) => {
                eventMap = map;
                return jasmine.createSpy('disposer');
            },
        }));
    });

    afterEach(() => {
        plugin.dispose();
        eventMap = undefined;
    });

    it('check events are mapped', () => {
        expect(state.stopPrintableKeyboardEventPropagation).toBeTruthy();
        expect(eventMap).toBeDefined();
        expect(eventMap.keypress.pluginEventType).toBe(PluginEventType.KeyPress);
        expect(eventMap.keydown.pluginEventType).toBe(PluginEventType.KeyDown);
        expect(eventMap.keyup.pluginEventType).toBe(PluginEventType.KeyUp);
        expect(eventMap.input.pluginEventType).toBe(PluginEventType.Input);
        expect(eventMap.keypress.beforeDispatch).toBeDefined();
        expect(eventMap.keydown.beforeDispatch).toBeDefined();
        expect(eventMap.keyup.beforeDispatch).toBeDefined();
        expect(eventMap.input.beforeDispatch).toBeDefined();
    });

    it('verify keydown event for non-charactor value', () => {
        spyOn(isCharacterValue, 'default').and.returnValue(false);
        const stopPropagation = jasmine.createSpy();
        eventMap.keydown.beforeDispatch(<Event>(<any>{
            stopPropagation,
        }));
        expect(stopPropagation).not.toHaveBeenCalled();
    });

    it('verify keydown event for charactor value', () => {
        spyOn(isCharacterValue, 'default').and.returnValue(true);
        const stopPropagation = jasmine.createSpy();
        eventMap.keydown.beforeDispatch(<Event>(<any>{
            stopPropagation,
        }));
        expect(stopPropagation).toHaveBeenCalled();
    });

    it('verify input event for non-charactor value', () => {
        spyOn(isCharacterValue, 'default').and.returnValue(false);
        const stopPropagation = jasmine.createSpy();
        eventMap.input.beforeDispatch(<Event>(<any>{
            stopPropagation,
        }));
        expect(stopPropagation).toHaveBeenCalled();
    });

    it('verify input event for charactor value', () => {
        spyOn(isCharacterValue, 'default').and.returnValue(true);
        const stopPropagation = jasmine.createSpy();
        eventMap.input.beforeDispatch(<Event>(<any>{
            stopPropagation,
        }));
        expect(stopPropagation).toHaveBeenCalled();
    });
});
