import * as getNodePositionFromEventFile from 'roosterjs-content-model-dom/lib/domUtils/event/getNodePositionFromEvent';
import { TouchPlugin } from '../../lib/touch/TouchPlugin';
import { IEditor, PluginEvent } from 'roosterjs-content-model-types';

describe('TouchPlugin', () => {
    let plugin: TouchPlugin;
    let editor: IEditor;

    let focusSpy: jasmine.Spy;
    let setDOMSelectionSpy: jasmine.Spy;
    let getDOMHelperSpy: jasmine.Spy;
    let createRangeSpy: jasmine.Spy;
    let setStartSpy: jasmine.Spy;
    let setEndSpy: jasmine.Spy;
    let setTimeoutSpy: jasmine.Spy;
    let clearTimeoutSpy: jasmine.Spy;
    let getNodePositionFromEventSpy: jasmine.Spy;

    let mockedRange: any;
    let mockedDOMHelper: any;
    let mockedWindow: any;
    let mockedDocument: any;
    let timerCallback: (() => void) | null;

    const TIMER_ID = 123;

    beforeEach(() => {
        focusSpy = jasmine.createSpy('focus');
        setDOMSelectionSpy = jasmine.createSpy('setDOMSelection');
        setStartSpy = jasmine.createSpy('setStart');
        setEndSpy = jasmine.createSpy('setEnd');
        timerCallback = null;

        mockedRange = {
            setStart: setStartSpy,
            setEnd: setEndSpy,
        };

        createRangeSpy = jasmine.createSpy('createRange').and.returnValue(mockedRange);
        clearTimeoutSpy = jasmine.createSpy('clearTimeout');
        setTimeoutSpy = jasmine.createSpy('setTimeout').and.callFake((callback: () => void) => {
            timerCallback = callback;
            return TIMER_ID;
        });

        mockedDOMHelper = {};
        getDOMHelperSpy = jasmine.createSpy('getDOMHelper').and.returnValue(mockedDOMHelper);

        mockedWindow = {
            setTimeout: setTimeoutSpy,
            clearTimeout: clearTimeoutSpy,
        };

        mockedDocument = {
            defaultView: mockedWindow,
            createRange: createRangeSpy,
        };

        getNodePositionFromEventSpy = spyOn(
            getNodePositionFromEventFile,
            'getNodePositionFromEvent'
        );

        editor = <IEditor>(<any>{
            getDocument: () => mockedDocument,
            getDOMHelper: getDOMHelperSpy,
            focus: focusSpy,
            setDOMSelection: setDOMSelectionSpy,
        });

        plugin = new TouchPlugin();
        plugin.initialize(editor);
    });

    afterEach(() => {
        plugin.dispose();
    });

    function pointerDownEvent(x: number = 10, y: number = 20): PluginEvent {
        return <PluginEvent>(<any>{
            eventType: 'pointerDown',
            originalEvent: {
                preventDefault: jasmine.createSpy('preventDefault'),
            },
            rawEvent: { x, y },
        });
    }

    function doubleClickEvent(x: number = 10, y: number = 20): PluginEvent {
        return <PluginEvent>(<any>{
            eventType: 'doubleClick',
            rawEvent: {
                x,
                y,
                preventDefault: jasmine.createSpy('preventDefault'),
            },
        });
    }

    function runTimer() {
        expect(timerCallback).not.toBeNull();
        timerCallback!();
    }

    it('getName', () => {
        expect(plugin.getName()).toBe('Touch');
    });

    it('does nothing when editor is not set (disposed)', () => {
        plugin.dispose();

        plugin.onPluginEvent(pointerDownEvent());

        expect(setTimeoutSpy).not.toHaveBeenCalled();
    });

    it('ignores unrelated event types', () => {
        plugin.onPluginEvent(<PluginEvent>(<any>{ eventType: 'keyDown', rawEvent: {} }));

        expect(setTimeoutSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
    });

    describe('pointerDown', () => {
        it('prevents default and schedules the detection timer', () => {
            const event = pointerDownEvent();

            plugin.onPluginEvent(event);

            expect((event as any).originalEvent.preventDefault).toHaveBeenCalled();
            expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
            expect(setTimeoutSpy.calls.argsFor(0)[1]).toBe(150);
        });

        it('does not schedule a timer when there is no default view', () => {
            mockedDocument.defaultView = null;

            plugin.onPluginEvent(pointerDownEvent());

            expect(setTimeoutSpy).not.toHaveBeenCalled();
        });

        it('clears a pending timer when a second pointerDown happens', () => {
            plugin.onPluginEvent(pointerDownEvent());
            plugin.onPluginEvent(pointerDownEvent());

            expect(clearTimeoutSpy).toHaveBeenCalledWith(TIMER_ID);
            expect(setTimeoutSpy).toHaveBeenCalledTimes(2);
        });

        it('sets a collapsed selection at the caret when caret position is null', () => {
            getNodePositionFromEventSpy.and.returnValue(null);

            plugin.onPluginEvent(pointerDownEvent());
            runTimer();

            expect(focusSpy).toHaveBeenCalled();
            expect(setStartSpy).not.toHaveBeenCalled();
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
        });

        it('keeps caret at clicked position when character is a space', () => {
            const node = document.createTextNode('a b');
            getNodePositionFromEventSpy.and.returnValue({ node, offset: 1 }); // space at index 1

            plugin.onPluginEvent(pointerDownEvent());
            runTimer();

            expect(setStartSpy).toHaveBeenCalledTimes(1);
            expect(setStartSpy).toHaveBeenCalledWith(node, 1);
            expect(setEndSpy).toHaveBeenCalledWith(node, 1);
            expect(setDOMSelectionSpy).toHaveBeenCalled();
        });

        it('keeps caret at clicked position when character is punctuation', () => {
            const node = document.createTextNode('hi.there');
            getNodePositionFromEventSpy.and.returnValue({ node, offset: 2 }); // '.' at index 2

            plugin.onPluginEvent(pointerDownEvent());
            runTimer();

            expect(setStartSpy).toHaveBeenCalledTimes(1);
            expect(setStartSpy).toHaveBeenCalledWith(node, 2);
        });

        it('does not adjust caret for non-text nodes', () => {
            const node = document.createElement('div');
            getNodePositionFromEventSpy.and.returnValue({ node, offset: 0 });

            plugin.onPluginEvent(pointerDownEvent());
            runTimer();

            expect(setStartSpy).toHaveBeenCalledTimes(1);
            expect(setStartSpy).toHaveBeenCalledWith(node, 0);
        });

        it('moves caret towards the nearer word boundary (right side closer)', () => {
            // 'hello world', offset 4 ('o'); left=4, right=1 -> move +1 to position 5
            const node = document.createTextNode('hello world');
            getNodePositionFromEventSpy.and.returnValue({ node, offset: 4 });

            plugin.onPluginEvent(pointerDownEvent());
            runTimer();

            // First a collapsed range at the original offset, then moved to the boundary
            expect(setStartSpy).toHaveBeenCalledWith(node, 4);
            expect(setStartSpy).toHaveBeenCalledWith(node, 5);
            expect(setEndSpy).toHaveBeenCalledWith(node, 5);
        });

        it('moves caret towards the nearer word boundary (left side closer)', () => {
            // 'hello world', offset 2 ('l'); left=2, right=3 -> move -2 to position 0
            const node = document.createTextNode('hello world');
            getNodePositionFromEventSpy.and.returnValue({ node, offset: 2 });

            plugin.onPluginEvent(pointerDownEvent());
            runTimer();

            expect(setStartSpy).toHaveBeenCalledWith(node, 0);
            expect(setEndSpy).toHaveBeenCalledWith(node, 0);
        });

        it('does not move caret when nearest boundary exceeds the max move distance', () => {
            // 14-char word, offset 7; both sides 7 > MAX(6) -> movingOffset becomes 0, no move
            const node = document.createTextNode('abcdefghijklmn');
            getNodePositionFromEventSpy.and.returnValue({ node, offset: 7 });

            plugin.onPluginEvent(pointerDownEvent());
            runTimer();

            // Only the original collapsed range is set, never adjusted
            expect(setStartSpy).toHaveBeenCalledTimes(1);
            expect(setStartSpy).toHaveBeenCalledWith(node, 7);
        });

        it('does nothing in the timer when a double click happened in between', () => {
            const node = document.createTextNode('hello');
            getNodePositionFromEventSpy.and.returnValue({ node, offset: 1 });

            plugin.onPluginEvent(pointerDownEvent());
            // Simulate a double click marking isDblClicked = true before the timer fires
            plugin.onPluginEvent(doubleClickEvent());
            setDOMSelectionSpy.calls.reset();

            runTimer();

            expect(focusSpy).not.toHaveBeenCalled();
            expect(setDOMSelectionSpy).not.toHaveBeenCalled();
        });

        it('does nothing in the timer when the editor was disposed before it fired', () => {
            plugin.onPluginEvent(pointerDownEvent());
            const callback = timerCallback!;

            plugin.dispose();
            callback();

            expect(focusSpy).not.toHaveBeenCalled();
            expect(setDOMSelectionSpy).not.toHaveBeenCalled();
        });
    });

    describe('doubleClick', () => {
        // A doubleClick only acts when preceded by a touch/pen pointerDown
        function primeTouchPointer() {
            plugin.onPluginEvent(pointerDownEvent());
        }

        it('does nothing when not preceded by a touch/pen pointer event', () => {
            plugin.onPluginEvent(doubleClickEvent());

            expect(getNodePositionFromEventSpy).not.toHaveBeenCalled();
            expect(setDOMSelectionSpy).not.toHaveBeenCalled();
        });

        it('prevents default and does nothing when caret position is null', () => {
            primeTouchPointer();
            getNodePositionFromEventSpy.and.returnValue(null);

            const event = doubleClickEvent();
            plugin.onPluginEvent(event);

            expect((event as any).rawEvent.preventDefault).toHaveBeenCalled();
            expect(setDOMSelectionSpy).not.toHaveBeenCalled();
        });

        it('returns early for non-text nodes', () => {
            primeTouchPointer();
            const node = document.createElement('div');
            getNodePositionFromEventSpy.and.returnValue({ node, offset: 0 });

            plugin.onPluginEvent(doubleClickEvent());

            expect(setDOMSelectionSpy).not.toHaveBeenCalled();
        });

        it('selects a single punctuation character', () => {
            primeTouchPointer();
            const node = document.createTextNode('hi.there');
            getNodePositionFromEventSpy.and.returnValue({ node, offset: 2 }); // '.'

            plugin.onPluginEvent(doubleClickEvent());

            expect(setStartSpy).toHaveBeenCalledWith(node, 2);
            expect(setEndSpy).toHaveBeenCalledWith(node, 3);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
        });

        it('selects the first trailing space when the rest of the node is spaces', () => {
            primeTouchPointer();
            const node = document.createTextNode('word   '); // trailing spaces
            getNodePositionFromEventSpy.and.returnValue({ node, offset: 5 }); // a space, all-spaces to the right

            plugin.onPluginEvent(doubleClickEvent());

            // walks back to the first space (index 4) and selects one character
            expect(setStartSpy).toHaveBeenCalledWith(node, 4);
            expect(setEndSpy).toHaveBeenCalledWith(node, 5);
            expect(setDOMSelectionSpy).toHaveBeenCalled();
        });

        it('does nothing for a space that has a word to its right', () => {
            primeTouchPointer();
            const node = document.createTextNode('a b');
            getNodePositionFromEventSpy.and.returnValue({ node, offset: 1 }); // space, 'b' to the right

            plugin.onPluginEvent(doubleClickEvent());

            expect(setDOMSelectionSpy).not.toHaveBeenCalled();
        });

        it('selects the whole word when double clicking inside a word', () => {
            primeTouchPointer();
            const node = document.createTextNode('hello world');
            getNodePositionFromEventSpy.and.returnValue({ node, offset: 2 }); // inside 'hello'

            plugin.onPluginEvent(doubleClickEvent());

            expect(setStartSpy).toHaveBeenCalledWith(node, 0);
            expect(setEndSpy).toHaveBeenCalledWith(node, 5);
            expect(setDOMSelectionSpy).toHaveBeenCalled();
        });
    });

    describe('dispose', () => {
        it('clears a pending timer on dispose', () => {
            plugin.onPluginEvent(pointerDownEvent());

            plugin.dispose();

            expect(clearTimeoutSpy).toHaveBeenCalledWith(TIMER_ID);
        });

        it('does not clear a timer when none is pending', () => {
            plugin.dispose();

            expect(clearTimeoutSpy).not.toHaveBeenCalled();
        });
    });
});
