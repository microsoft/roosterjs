import * as eventUtils from '../../lib/publicApi/domUtils/eventUtils';
import { ChangeSource, IEditor, PluginEventType, PluginWithState } from 'roosterjs-editor-types';
import { createDOMEventPlugin } from '../../lib/corePlugin/DOMEventPlugin';
import { DOMEventPluginState, IStandaloneEditor } from 'roosterjs-content-model-types';

const getDocument = () => document;

describe('DOMEventPlugin', () => {
    it('init and dispose', () => {
        const addEventListener = jasmine.createSpy('addEventListener');
        const removeEventListener = jasmine.createSpy('removeEventListener');
        const div = <any>{
            addEventListener,
            removeEventListener,
        };
        const plugin = createDOMEventPlugin({}, div);
        const disposer = jasmine.createSpy('disposer');
        const addDomEventHandler = jasmine
            .createSpy('addDomEventHandler')
            .and.returnValue(disposer);
        const state = plugin.getState();
        const editor = ({
            getDocument,
            addDomEventHandler,
            getEnvironment: () => ({}),
        } as any) as IStandaloneEditor & IEditor;

        plugin.initialize(editor);

        expect(addEventListener).toHaveBeenCalledTimes(1);
        expect(addEventListener.calls.argsFor(0)[0]).toBe('scroll');

        expect(state).toEqual({
            isInIME: false,
            scrollContainer: div,
            selectionRange: null,
            contextMenuProviders: [],
            tableSelectionRange: null,
            imageSelectionRange: null,
            mouseDownX: null,
            mouseDownY: null,
            mouseUpEventListerAdded: false,
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
        const plugin = createDOMEventPlugin(
            {
                scrollContainer: divScrollContainer,
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
            getEnvironment: () => ({}),
        }));

        expect(addEventListener1).not.toHaveBeenCalledTimes(1);
        expect(addEventListener2).toHaveBeenCalledTimes(1);
        expect(addEventListener2.calls.argsFor(0)[0]).toBe('scroll');

        expect(state).toEqual({
            isInIME: false,
            scrollContainer: divScrollContainer,
            selectionRange: null,
            contextMenuProviders: [],
            tableSelectionRange: null,
            imageSelectionRange: null,
            mouseDownX: null,
            mouseDownY: null,
            mouseUpEventListerAdded: false,
        });

        expect(addDomEventHandler).toHaveBeenCalled();

        plugin.dispose();
    });
});

describe('DOMEventPlugin verify event handlers while disallow keyboard event propagation', () => {
    let eventMap: Record<string, any>;
    let plugin: PluginWithState<DOMEventPluginState>;

    beforeEach(() => {
        const div = <any>{
            addEventListener: jasmine.createSpy('addEventListener1'),
            removeEventListener: jasmine.createSpy('removeEventListener'),
        };

        plugin = createDOMEventPlugin({}, div);
        plugin.initialize(<IEditor>(<any>{
            getDocument,
            addDomEventHandler: (map: Record<string, any>) => {
                eventMap = map;
                return jasmine.createSpy('disposer');
            },
            getEnvironment: () => ({}),
        }));
    });

    afterEach(() => {
        plugin.dispose();
        eventMap = undefined!;
    });

    it('check events are mapped', () => {
        expect(eventMap).toBeDefined();
        expect(eventMap.keypress.pluginEventType).toBe(PluginEventType.KeyPress);
        expect(eventMap.keydown.pluginEventType).toBe(PluginEventType.KeyDown);
        expect(eventMap.keyup.pluginEventType).toBe(PluginEventType.KeyUp);
        expect(eventMap.input.pluginEventType).toBe(PluginEventType.Input);
        expect(eventMap.keypress.beforeDispatch).toBeDefined();
        expect(eventMap.keydown.beforeDispatch).toBeDefined();
        expect(eventMap.keyup.beforeDispatch).toBeDefined();
        expect(eventMap.input.beforeDispatch).toBeDefined();
        expect(eventMap.mousedown).toBeDefined();
        expect(eventMap.contextmenu).toBeDefined();
        expect(eventMap.compositionstart).toBeDefined();
        expect(eventMap.compositionend).toBeDefined();
        expect(eventMap.dragstart).toBeDefined();
        expect(eventMap.drop).toBeDefined();
        expect(eventMap.focus).toBeDefined();
        expect(eventMap.mouseup).not.toBeDefined();
    });

    it('verify keydown event for non-character value', () => {
        spyOn(eventUtils, 'isCharacterValue').and.returnValue(false);
        const stopPropagation = jasmine.createSpy();
        eventMap.keydown.beforeDispatch(<Event>(<any>{
            stopPropagation,
        }));
        expect(stopPropagation).not.toHaveBeenCalled();
    });

    it('verify keydown event for character value', () => {
        spyOn(eventUtils, 'isCharacterValue').and.returnValue(true);
        const stopPropagation = jasmine.createSpy();
        eventMap.keydown.beforeDispatch(<Event>(<any>{
            stopPropagation,
        }));
        expect(stopPropagation).toHaveBeenCalled();
    });

    it('verify input event for non-character value', () => {
        spyOn(eventUtils, 'isCharacterValue').and.returnValue(false);
        const stopPropagation = jasmine.createSpy();
        eventMap.input.beforeDispatch(<Event>(<any>{
            stopPropagation,
        }));
        expect(stopPropagation).toHaveBeenCalled();
    });

    it('verify input event for character value', () => {
        spyOn(eventUtils, 'isCharacterValue').and.returnValue(true);
        const stopPropagation = jasmine.createSpy();
        eventMap.input.beforeDispatch(<Event>(<any>{
            stopPropagation,
        }));
        expect(stopPropagation).toHaveBeenCalled();
    });
});

describe('DOMEventPlugin handle mouse down and mouse up event', () => {
    let plugin: PluginWithState<DOMEventPluginState>;
    let addEventListener: jasmine.Spy;
    let removeEventListener: jasmine.Spy;
    let triggerPluginEvent: jasmine.Spy;
    let eventMap: Record<string, any>;
    let scrollContainer: HTMLElement;
    let onMouseUp: Function;

    beforeEach(() => {
        addEventListener = jasmine
            .createSpy('addEventListener')
            .and.callFake((eventName, handler, useCapture) => {
                expect(eventName).toBe('mouseup');
                expect(useCapture).toBe(true);

                onMouseUp = handler;
            });
        removeEventListener = jasmine.createSpy('.removeEventListener');
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        scrollContainer = {
            addEventListener: () => {},
            removeEventListener: () => {},
        } as any;
        plugin = createDOMEventPlugin(
            {
                scrollContainer,
            },
            null!
        );
        plugin.initialize(<IEditor>(<any>{
            getDocument: () => ({
                addEventListener,
                removeEventListener,
            }),
            triggerPluginEvent,
            getEnvironment: () => ({}),
            addDomEventHandler: (map: Record<string, any>) => {
                eventMap = map;
                return jasmine.createSpy('disposer');
            },
        }));
    });

    afterEach(() => {
        plugin.dispose();
    });

    it('Trigger mouse down event', () => {
        const mockedEvent = {
            pageX: 100,
            pageY: 200,
        };
        eventMap.mousedown(mockedEvent);
        expect(addEventListener).toHaveBeenCalledTimes(1);
        expect(addEventListener.calls.argsFor(0)[0]).toBe('mouseup');
        expect(addEventListener.calls.argsFor(0)[2]).toBe(true);
        expect(plugin.getState()).toEqual({
            isInIME: false,
            scrollContainer: scrollContainer,
            selectionRange: null,
            contextMenuProviders: [],
            tableSelectionRange: null,
            imageSelectionRange: null,
            mouseDownX: 100,
            mouseDownY: 200,
            mouseUpEventListerAdded: true,
        });
    });

    it('Trigger mouse up event, isClicking', () => {
        expect(eventMap.mouseup).toBeUndefined();
        const mockedEvent = {
            pageX: 100,
            pageY: 200,
        };
        eventMap.mousedown(mockedEvent);

        expect(eventMap.mouseup).toBeUndefined();
        expect(plugin.getState()).toEqual({
            isInIME: false,
            scrollContainer: scrollContainer,
            selectionRange: null,
            contextMenuProviders: [],
            tableSelectionRange: null,
            imageSelectionRange: null,
            mouseDownX: 100,
            mouseDownY: 200,
            mouseUpEventListerAdded: true,
        });
        expect(addEventListener).toHaveBeenCalled();

        onMouseUp(mockedEvent);

        expect(removeEventListener).toHaveBeenCalled();
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.MouseUp, {
            rawEvent: mockedEvent,
            isClicking: true,
        });
        expect(plugin.getState()).toEqual({
            isInIME: false,
            scrollContainer: scrollContainer,
            selectionRange: null,
            contextMenuProviders: [],
            tableSelectionRange: null,
            imageSelectionRange: null,
            mouseDownX: 100,
            mouseDownY: 200,
            mouseUpEventListerAdded: false,
        });
    });

    it('Trigger mouse up event, isClicking = false', () => {
        expect(eventMap.mouseup).toBeUndefined();
        const mockedEvent1 = {
            pageX: 100,
            pageY: 200,
        };
        const mockedEvent2 = {
            pageX: 100,
            pageY: 300,
        };
        eventMap.mousedown(mockedEvent1);

        expect(eventMap.mouseup).toBeUndefined();
        expect(plugin.getState()).toEqual({
            isInIME: false,
            scrollContainer: scrollContainer,
            selectionRange: null,
            contextMenuProviders: [],
            tableSelectionRange: null,
            imageSelectionRange: null,
            mouseDownX: 100,
            mouseDownY: 200,
            mouseUpEventListerAdded: true,
        });
        expect(addEventListener).toHaveBeenCalled();

        onMouseUp(mockedEvent2);

        expect(removeEventListener).toHaveBeenCalled();
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.MouseUp, {
            rawEvent: mockedEvent2,
            isClicking: false,
        });
        expect(plugin.getState()).toEqual({
            isInIME: false,
            scrollContainer: scrollContainer,
            selectionRange: null,
            contextMenuProviders: [],
            tableSelectionRange: null,
            imageSelectionRange: null,
            mouseDownX: 100,
            mouseDownY: 200,
            mouseUpEventListerAdded: false,
        });
    });
});

describe('DOMEventPlugin handle other event', () => {
    let plugin: PluginWithState<DOMEventPluginState>;
    let addEventListener: jasmine.Spy;
    let removeEventListener: jasmine.Spy;
    let triggerPluginEvent: jasmine.Spy;
    let eventMap: Record<string, any>;
    let scrollContainer: HTMLElement;
    let getElementAtCursorSpy: jasmine.Spy;
    let editor: IEditor;

    beforeEach(() => {
        addEventListener = jasmine.createSpy('addEventListener');
        removeEventListener = jasmine.createSpy('.removeEventListener');
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        getElementAtCursorSpy = jasmine.createSpy('getElementAtCursor');

        scrollContainer = {
            addEventListener: () => {},
            removeEventListener: () => {},
        } as any;
        plugin = createDOMEventPlugin(
            {
                scrollContainer,
            },
            null!
        );

        editor = <IEditor>(<any>{
            getDocument: () => ({
                addEventListener,
                removeEventListener,
            }),
            triggerPluginEvent,
            getEnvironment: () => ({}),
            addDomEventHandler: (map: Record<string, any>) => {
                eventMap = map;
                return jasmine.createSpy('disposer');
            },
            getElementAtCursor: getElementAtCursorSpy,
        });
        plugin.initialize(editor);
    });

    afterEach(() => {
        plugin.dispose();
    });

    it('Trigger compositionstart and compositionend event', () => {
        eventMap.compositionstart();
        expect(plugin.getState()).toEqual({
            isInIME: true,
            scrollContainer: scrollContainer,
            selectionRange: null,
            contextMenuProviders: [],
            tableSelectionRange: null,
            imageSelectionRange: null,
            mouseDownX: null,
            mouseDownY: null,
            mouseUpEventListerAdded: false,
        });

        expect(triggerPluginEvent).not.toHaveBeenCalled();

        const mockedEvent = 'EVENT' as any;
        eventMap.compositionend(mockedEvent);
        expect(plugin.getState()).toEqual({
            isInIME: false,
            scrollContainer: scrollContainer,
            selectionRange: null,
            contextMenuProviders: [],
            tableSelectionRange: null,
            imageSelectionRange: null,
            mouseDownX: null,
            mouseDownY: null,
            mouseUpEventListerAdded: false,
        });
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.CompositionEnd, {
            rawEvent: mockedEvent,
        });
    });

    it('Trigger onDragStart event', () => {
        const preventDefaultSpy = jasmine.createSpy('preventDefault');
        const mockedEvent = {
            preventDefault: preventDefaultSpy,
        } as any;

        getElementAtCursorSpy.and.returnValue({
            isContentEditable: true,
        });
        eventMap.dragstart(mockedEvent);
        expect(plugin.getState()).toEqual({
            isInIME: false,
            scrollContainer: scrollContainer,
            selectionRange: null,
            contextMenuProviders: [],
            tableSelectionRange: null,
            imageSelectionRange: null,
            mouseDownX: null,
            mouseDownY: null,
            mouseUpEventListerAdded: false,
        });

        expect(triggerPluginEvent).not.toHaveBeenCalled();
        expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('Trigger onDragStart event on readonly element', () => {
        const preventDefaultSpy = jasmine.createSpy('preventDefault');
        const mockedEvent = {
            preventDefault: preventDefaultSpy,
        } as any;

        getElementAtCursorSpy.and.returnValue({
            isContentEditable: false,
        });
        eventMap.dragstart(mockedEvent);
        expect(plugin.getState()).toEqual({
            isInIME: false,
            scrollContainer: scrollContainer,
            selectionRange: null,
            contextMenuProviders: [],
            tableSelectionRange: null,
            imageSelectionRange: null,
            mouseDownX: null,
            mouseDownY: null,
            mouseUpEventListerAdded: false,
        });

        expect(triggerPluginEvent).not.toHaveBeenCalled();
        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('Trigger onDrop event', () => {
        const addUndoSnapshotSpy = jasmine.createSpy('addUndoSnapshot');
        editor.runAsync = (callback: Function) => callback(editor);
        editor.addUndoSnapshot = addUndoSnapshotSpy;

        eventMap.drop();
        expect(plugin.getState()).toEqual({
            isInIME: false,
            scrollContainer: scrollContainer,
            selectionRange: null,
            contextMenuProviders: [],
            tableSelectionRange: null,
            imageSelectionRange: null,
            mouseDownX: null,
            mouseDownY: null,
            mouseUpEventListerAdded: false,
        });
        expect(addUndoSnapshotSpy).toHaveBeenCalledWith(jasmine.anything(), ChangeSource.Drop);
    });

    it('Trigger onFocus event', () => {
        const selectSpy = jasmine.createSpy('select');
        editor.select = selectSpy;

        const state = plugin.getState();
        const mockedRange = 'RANGE' as any;

        state.skipReselectOnFocus = false;
        state.selectionRange = mockedRange;

        eventMap.focus();
        expect(plugin.getState()).toEqual({
            isInIME: false,
            scrollContainer: scrollContainer,
            selectionRange: null,
            contextMenuProviders: [],
            tableSelectionRange: null,
            imageSelectionRange: null,
            mouseDownX: null,
            mouseDownY: null,
            mouseUpEventListerAdded: false,
            skipReselectOnFocus: false,
        });
        expect(selectSpy).toHaveBeenCalledWith(mockedRange);
    });

    it('Trigger onFocus event, skip reselect', () => {
        const selectSpy = jasmine.createSpy('select');
        editor.select = selectSpy;

        const state = plugin.getState();
        const mockedRange = 'RANGE' as any;

        state.skipReselectOnFocus = true;
        state.selectionRange = mockedRange;

        eventMap.focus();
        expect(plugin.getState()).toEqual({
            isInIME: false,
            scrollContainer: scrollContainer,
            selectionRange: null,
            contextMenuProviders: [],
            tableSelectionRange: null,
            imageSelectionRange: null,
            mouseDownX: null,
            mouseDownY: null,
            mouseUpEventListerAdded: false,
            skipReselectOnFocus: true,
        });
        expect(selectSpy).not.toHaveBeenCalled();
    });

    it('Trigger contextmenu event, skip reselect', () => {
        editor.getContentSearcherOfCursor = () => null!;
        const state = plugin.getState();
        const mockedItems1 = ['Item1', 'Item2'];
        const mockedItems2 = ['Item3', 'Item4'];

        state.contextMenuProviders = [
            {
                getContextMenuItems: () => mockedItems1,
            } as any,
            {
                getContextMenuItems: () => mockedItems2,
            } as any,
        ];

        const mockedEvent = {
            target: {},
        };

        eventMap.contextmenu(mockedEvent);

        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.ContextMenu, {
            rawEvent: mockedEvent,
            items: ['Item1', 'Item2', null, 'Item3', 'Item4'],
        });
    });
});
