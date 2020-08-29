import * as dom from 'roosterjs-editor-dom';
import DOMEventPlugin from '../../lib/corePlugins/domEvent/DOMEventPlugin';
import {
    ChangeSource,
    DOMEventPluginState,
    IEditor,
    PluginEventType,
    Wrapper,
} from 'roosterjs-editor-types';

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
            addDomEventHandler,
        }));

        expect(addEventListener).toHaveBeenCalledTimes(1);
        expect(addEventListener.calls.argsFor(0)[0]).toBe('scroll');

        expect(state.value).toEqual({
            isInIME: false,
            scrollContainer: div,
            selectionRange: null,
            stopPrintableKeyboardEventPropagation: true,
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
            addDomEventHandler,
        }));

        expect(addEventListener1).not.toHaveBeenCalledTimes(1);
        expect(addEventListener2).toHaveBeenCalledTimes(1);
        expect(addEventListener2.calls.argsFor(0)[0]).toBe('scroll');

        expect(state.value).toEqual({
            isInIME: false,
            scrollContainer: divScrollContainer,
            selectionRange: null,
            stopPrintableKeyboardEventPropagation: false,
        });

        expect(addDomEventHandler).toHaveBeenCalled();

        plugin.dispose();
    });
});

describe('DOMEventPlugin verify event handlers while allow keyboard event propagation', () => {
    let eventMap: Record<string, (event: Event) => void>;
    let plugin: DOMEventPlugin;
    let state: Wrapper<DOMEventPluginState>;
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
        plugin.initialize(<IEditor>(<any>{
            addDomEventHandler: (map: Record<string, any>) => {
                eventMap = map;
                return jasmine.createSpy('disposer');
            },
            triggerPluginEvent,
            runAsync: (callback: any) => callback(),
            addUndoSnapshot,
            select,
            getSelectionRange,
        }));
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
        expect(eventMap.blur).toBeDefined();
    });

    it('verify composition event', () => {
        expect(state.value.isInIME).toBeFalsy();

        eventMap.compositionstart(<Event>{});
        expect(state.value.isInIME).toBeTruthy();

        const event = <Event>{};
        eventMap.compositionend(event);
        expect(state.value.isInIME).toBeFalsy();
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
        state.value.selectionRange = range;
        eventMap.focus(<Event>{});

        expect(select).toHaveBeenCalledTimes(1);
        expect(select.calls.argsFor(0)[0]).toBe(range);
        expect(state.value.selectionRange).toBeNull();
    });

    it('verify blur event', () => {
        expect(state.value.selectionRange).toBeNull();
        eventMap.blur(<Event>{});

        expect(getSelectionRange).toHaveBeenCalledWith(false);
        expect(state.value.selectionRange).toBe(getSelectionRangeResult);
    });
});

describe('DOMEventPlugin verify event handlers while disallow keyboard event propagation', () => {
    let eventMap: Record<string, any>;
    let plugin: DOMEventPlugin;
    let state: Wrapper<DOMEventPluginState>;

    beforeEach(() => {
        const div = <any>{
            addEventListener: jasmine.createSpy('addEventListener1'),
            removeEventListener: jasmine.createSpy('removeEventListener'),
        };

        plugin = new DOMEventPlugin({}, div);
        state = plugin.getState();
        plugin.initialize(<IEditor>(<any>{
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
        expect(state.value.stopPrintableKeyboardEventPropagation).toBeTruthy();
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
        spyOn(dom, 'isCharacterValue').and.returnValue(false);
        const stopPropagation = jasmine.createSpy();
        eventMap.keydown.beforeDispatch(<Event>(<any>{
            stopPropagation,
        }));
        expect(stopPropagation).not.toHaveBeenCalled();
    });

    it('verify keydown event for charactor value', () => {
        spyOn(dom, 'isCharacterValue').and.returnValue(true);
        const stopPropagation = jasmine.createSpy();
        eventMap.keydown.beforeDispatch(<Event>(<any>{
            stopPropagation,
        }));
        expect(stopPropagation).toHaveBeenCalled();
    });

    it('verify input event for non-charactor value', () => {
        spyOn(dom, 'isCharacterValue').and.returnValue(false);
        const stopPropagation = jasmine.createSpy();
        eventMap.input.beforeDispatch(<Event>(<any>{
            stopPropagation,
        }));
        expect(stopPropagation).toHaveBeenCalled();
    });

    it('verify input event for charactor value', () => {
        spyOn(dom, 'isCharacterValue').and.returnValue(true);
        const stopPropagation = jasmine.createSpy();
        eventMap.input.beforeDispatch(<Event>(<any>{
            stopPropagation,
        }));
        expect(stopPropagation).toHaveBeenCalled();
    });
});
