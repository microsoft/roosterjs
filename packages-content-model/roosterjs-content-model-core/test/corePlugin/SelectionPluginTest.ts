import { createSelectionPlugin } from '../../lib/corePlugin/SelectionPlugin';
import {
    EditorPlugin,
    IEditor,
    PluginWithState,
    SelectionPluginState,
} from 'roosterjs-content-model-types';

const MockedStyleNode = 'STYLENODE' as any;

describe('SelectionPlugin', () => {
    it('init and dispose', () => {
        const plugin = createSelectionPlugin({});
        const disposer = jasmine.createSpy('disposer');
        const createElementSpy = jasmine
            .createSpy('createElement')
            .and.returnValue(MockedStyleNode);
        const appendChildSpy = jasmine.createSpy('appendChild');
        const attachDomEvent = jasmine.createSpy('attachDomEvent').and.returnValue(disposer);
        const removeEventListenerSpy = jasmine.createSpy('removeEventListener');
        const getDocumentSpy = jasmine.createSpy('getDocument').and.returnValue({
            createElement: createElementSpy,
            head: {
                appendChild: appendChildSpy,
            },
            removeEventListener: removeEventListenerSpy,
        });
        const state = plugin.getState();
        const editor = ({
            getDocument: getDocumentSpy,
            attachDomEvent,
            getEnvironment: () => ({}),
        } as any) as IEditor;

        plugin.initialize(editor);

        expect(state).toEqual({
            selection: null,
            selectionStyleNode: MockedStyleNode,
            imageSelectionBorderColor: undefined,
        });
        expect(attachDomEvent).toHaveBeenCalled();
        expect(removeEventListenerSpy).not.toHaveBeenCalled();
        expect(disposer).not.toHaveBeenCalled();

        plugin.dispose();

        expect(removeEventListenerSpy).toHaveBeenCalled();
        expect(disposer).toHaveBeenCalled();
    });

    it('init with different options', () => {
        const plugin = createSelectionPlugin({
            imageSelectionBorderColor: 'red',
        });
        const state = plugin.getState();

        const attachDomEvent = jasmine
            .createSpy('attachDomEvent')
            .and.returnValue(jasmine.createSpy('disposer'));
        const createElementSpy = jasmine
            .createSpy('createElement')
            .and.returnValue(MockedStyleNode);
        const appendChildSpy = jasmine.createSpy('appendChild');
        const removeEventListenerSpy = jasmine.createSpy('removeEventListener');
        const getDocumentSpy = jasmine.createSpy('getDocument').and.returnValue({
            createElement: createElementSpy,
            head: {
                appendChild: appendChildSpy,
            },
            removeEventListener: removeEventListenerSpy,
        });

        plugin.initialize(<IEditor>(<any>{
            getDocument: getDocumentSpy,
            attachDomEvent,
            getEnvironment: () => ({}),
        }));

        expect(state).toEqual({
            selection: null,
            selectionStyleNode: MockedStyleNode,
            imageSelectionBorderColor: 'red',
        });

        expect(attachDomEvent).toHaveBeenCalled();

        plugin.dispose();
    });
});

describe('SelectionPlugin handle onFocus and onBlur event', () => {
    let plugin: PluginWithState<SelectionPluginState>;
    let triggerEvent: jasmine.Spy;
    let eventMap: Record<string, any>;
    let getElementAtCursorSpy: jasmine.Spy;
    let createElementSpy: jasmine.Spy;
    let getDocumentSpy: jasmine.Spy;
    let appendChildSpy: jasmine.Spy;
    let setDOMSelectionSpy: jasmine.Spy;
    let removeEventListenerSpy: jasmine.Spy;

    let editor: IEditor;

    beforeEach(() => {
        triggerEvent = jasmine.createSpy('triggerEvent');
        getElementAtCursorSpy = jasmine.createSpy('getElementAtCursor');
        createElementSpy = jasmine.createSpy('createElement').and.returnValue(MockedStyleNode);
        appendChildSpy = jasmine.createSpy('appendChild');
        removeEventListenerSpy = jasmine.createSpy('removeEventListener');
        getDocumentSpy = jasmine.createSpy('getDocument').and.returnValue({
            createElement: createElementSpy,
            head: {
                appendChild: appendChildSpy,
            },
            removeEventListener: removeEventListenerSpy,
        });
        setDOMSelectionSpy = jasmine.createSpy('setDOMSelection');

        plugin = createSelectionPlugin({});

        editor = <IEditor>(<any>{
            getDocument: getDocumentSpy,
            triggerEvent,
            getEnvironment: () => ({}),
            attachDomEvent: (map: Record<string, any>) => {
                eventMap = map;
                return jasmine.createSpy('disposer');
            },
            getElementAtCursor: getElementAtCursorSpy,
            setDOMSelection: setDOMSelectionSpy,
        });
        plugin.initialize(editor);
    });

    afterEach(() => {
        plugin.dispose();
    });

    it('Trigger onFocus event', () => {
        const state = plugin.getState();
        const mockedRange = 'RANGE' as any;

        state.skipReselectOnFocus = false;
        state.selection = mockedRange;

        eventMap.focus.beforeDispatch();
        expect(plugin.getState()).toEqual({
            selection: mockedRange,
            selectionStyleNode: MockedStyleNode,
            imageSelectionBorderColor: undefined,
            skipReselectOnFocus: false,
        });
    });

    it('Trigger onFocus event, skip reselect', () => {
        const state = plugin.getState();
        const mockedRange = 'RANGE' as any;

        state.skipReselectOnFocus = true;
        state.selection = mockedRange;

        eventMap.focus.beforeDispatch();
        expect(plugin.getState()).toEqual({
            selection: mockedRange,
            selectionStyleNode: MockedStyleNode,
            imageSelectionBorderColor: undefined,
            skipReselectOnFocus: true,
        });
    });
});

describe('SelectionPlugin handle image selection', () => {
    let plugin: EditorPlugin;
    let editor: IEditor;
    let getDOMSelectionSpy: jasmine.Spy;
    let setDOMSelectionSpy: jasmine.Spy;
    let getDocumentSpy: jasmine.Spy;
    let createElementSpy: jasmine.Spy;
    let createRangeSpy: jasmine.Spy;

    beforeEach(() => {
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        setDOMSelectionSpy = jasmine.createSpy('setDOMSelection');
        createElementSpy = jasmine.createSpy('createElement').and.returnValue(MockedStyleNode);
        createRangeSpy = jasmine.createSpy('createRange');
        getDocumentSpy = jasmine.createSpy('getDocument').and.returnValue({
            createElement: createElementSpy,
            createRange: createRangeSpy,
            head: {
                appendChild: () => {},
            },
        });

        editor = {
            getDOMSelection: getDOMSelectionSpy,
            setDOMSelection: setDOMSelectionSpy,
            getDocument: getDocumentSpy,
            getEnvironment: () => ({}),
            attachDomEvent: (map: Record<string, any>) => {
                return jasmine.createSpy('disposer');
            },
        } as any;
        plugin = createSelectionPlugin({});
        plugin.initialize(editor);
    });

    it('No selection, mouse down to div', () => {
        const node = document.createElement('div');
        plugin.onPluginEvent({
            eventType: 'mouseDown',
            rawEvent: {
                target: node,
            } as any,
        });

        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
    });

    it('Image selection, mouse down to div', () => {
        const mockedImage = {
            parentNode: { childNodes: [] },
        } as any;

        mockedImage.parentNode.childNodes.push(mockedImage);

        const mockedRange = {
            setStart: jasmine.createSpy('setStart'),
            collapse: jasmine.createSpy('collapse'),
        };

        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: mockedImage,
        });

        createRangeSpy.and.returnValue(mockedRange);

        const node = document.createElement('div');
        plugin.onPluginEvent({
            eventType: 'mouseDown',
            rawEvent: {
                target: node,
            } as any,
        });

        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'range',
            range: mockedRange,
            isReverted: false,
        });
    });

    it('Image selection, mouse down to div, no parent of image', () => {
        const mockedImage = {
            parentNode: { childNodes: [] },
        } as any;
        const mockedRange = {
            setStart: jasmine.createSpy('setStart'),
            collapse: jasmine.createSpy('collapse'),
        };

        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: mockedImage,
        });

        createRangeSpy.and.returnValue(mockedRange);

        const node = document.createElement('div');
        plugin.onPluginEvent({
            eventType: 'mouseDown',
            rawEvent: {
                target: node,
            } as any,
        });

        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(0);
    });

    it('Image selection, mouse down to same image', () => {
        const mockedImage = {
            parentNode: { childNodes: [] },
        } as any;
        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: mockedImage,
        });

        plugin.onPluginEvent({
            eventType: 'mouseDown',
            rawEvent: {
                target: mockedImage,
            } as any,
        });

        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(0);
    });

    it('Image selection, mouse down to same image right click', () => {
        const mockedImage = document.createElement('img');

        mockedImage.contentEditable = 'true';

        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: mockedImage,
        });

        plugin.onPluginEvent({
            eventType: 'mouseDown',
            rawEvent: {
                target: mockedImage,
                button: 2,
            } as any,
        });

        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
    });

    it('Image selection, mouse down to image right click', () => {
        const mockedImage = document.createElement('img');

        mockedImage.contentEditable = 'true';
        plugin.onPluginEvent({
            eventType: 'mouseDown',
            rawEvent: {
                target: mockedImage,
                button: 2,
            } as any,
        });

        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
    });

    it('Image selection, mouse down to div right click', () => {
        const node = document.createElement('div');

        plugin.onPluginEvent({
            eventType: 'mouseDown',
            rawEvent: {
                target: node,
                button: 2,
            } as any,
        });

        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(0);
    });

    it('no selection, mouse up to image, is clicking, isEditable', () => {
        const mockedImage = document.createElement('img');

        mockedImage.contentEditable = 'true';

        plugin.onPluginEvent({
            eventType: 'mouseUp',
            isClicking: true,
            rawEvent: {
                target: mockedImage,
            } as any,
        });

        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'image',
            image: mockedImage,
        });
    });

    it('no selection, mouse up to image, is clicking, not isEditable', () => {
        const mockedImage = document.createElement('img');

        mockedImage.contentEditable = 'false';

        plugin.onPluginEvent({
            eventType: 'mouseUp',
            isClicking: true,
            rawEvent: {
                target: mockedImage,
            } as any,
        });

        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(0);
    });

    it('no selection, mouse up to image, is not clicking, isEditable', () => {
        const mockedImage = document.createElement('img');

        mockedImage.contentEditable = 'true';

        plugin.onPluginEvent({
            eventType: 'mouseUp',
            isClicking: false,
            rawEvent: {
                target: mockedImage,
            } as any,
        });

        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(0);
    });

    it('key down - ESCAPE, no selection', () => {
        const rawEvent = {
            key: 'Escape',
        } as any;
        getDOMSelectionSpy.and.returnValue(null);

        plugin.onPluginEvent({
            eventType: 'keyDown',
            rawEvent,
        });

        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(0);
    });

    it('key down - ESCAPE, range selection', () => {
        const rawEvent = {
            key: 'Escape',
        } as any;
        getDOMSelectionSpy.and.returnValue({
            type: 'range',
        });

        plugin.onPluginEvent({
            eventType: 'keyDown',
            rawEvent,
        });

        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(0);
    });

    it('key down - ESCAPE, image selection', () => {
        const stopPropagationSpy = jasmine.createSpy('stopPropagation');
        const rawEvent = {
            key: 'Escape',
            stopPropagation: stopPropagationSpy,
        } as any;

        const mockedImage = {
            parentNode: { childNodes: [] },
        } as any;

        mockedImage.parentNode.childNodes.push(mockedImage);
        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: mockedImage,
        });

        const mockedRange = {
            setStart: jasmine.createSpy('setStart'),
            collapse: jasmine.createSpy('collapse'),
        };

        createRangeSpy.and.returnValue(mockedRange);

        plugin.onPluginEvent({
            eventType: 'keyDown',
            rawEvent,
        });

        expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'range',
            range: mockedRange,
            isReverted: false,
        });
    });

    it('key down - other key', () => {
        const stopPropagationSpy = jasmine.createSpy('stopPropagation');
        const rawEvent = {
            key: 'A',
            stopPropagation: stopPropagationSpy,
        } as any;

        const mockedImage = {
            parentNode: { childNodes: [] },
        } as any;

        mockedImage.parentNode.childNodes.push(mockedImage);
        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: mockedImage,
        });

        const mockedRange = {
            setStart: jasmine.createSpy('setStart'),
            collapse: jasmine.createSpy('collapse'),
        };

        createRangeSpy.and.returnValue(mockedRange);

        plugin.onPluginEvent({
            eventType: 'keyDown',
            rawEvent,
        });

        expect(stopPropagationSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'range',
            range: mockedRange,
            isReverted: false,
        });
    });

    it('key down - Escape key with modifier key', () => {
        const stopPropagationSpy = jasmine.createSpy('stopPropagation');
        const rawEvent = {
            key: 'Escape',
            stopPropagation: stopPropagationSpy,
            ctrlKey: true,
        } as any;

        const mockedImage = {
            parentNode: { childNodes: [] },
        } as any;

        mockedImage.parentNode.childNodes.push(mockedImage);
        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: mockedImage,
        });

        const mockedRange = {
            setStart: jasmine.createSpy('setStart'),
            collapse: jasmine.createSpy('collapse'),
        };

        createRangeSpy.and.returnValue(mockedRange);

        plugin.onPluginEvent({
            eventType: 'keyDown',
            rawEvent,
        });

        expect(stopPropagationSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
    });

    it('key down - other key, image has no parent', () => {
        const stopPropagationSpy = jasmine.createSpy('stopPropagation');
        const rawEvent = {
            key: 'A',
            stopPropagation: stopPropagationSpy,
        } as any;

        const mockedImage = {
            parentNode: { childNodes: [] },
        } as any;

        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: mockedImage,
        });

        const mockedRange = {
            setStart: jasmine.createSpy('setStart'),
            collapse: jasmine.createSpy('collapse'),
        };

        createRangeSpy.and.returnValue(mockedRange);

        plugin.onPluginEvent({
            eventType: 'keyDown',
            rawEvent,
        });

        expect(stopPropagationSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
    });

    it('key down - select all', () => {
        const stopPropagationSpy = jasmine.createSpy('stopPropagation');
        const rawEvent = {
            key: 'a',
            ctrlKey: true,
            stopPropagation: stopPropagationSpy,
        } as any;

        const mockedImage = {
            parentNode: { childNodes: [] },
        } as any;

        mockedImage.parentNode.childNodes.push(mockedImage);

        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: mockedImage,
        });

        const mockedRange = {
            setStart: jasmine.createSpy('setStart'),
            collapse: jasmine.createSpy('collapse'),
        };

        createRangeSpy.and.returnValue(mockedRange);

        plugin.onPluginEvent({
            eventType: 'keyDown',
            rawEvent,
        });

        expect(stopPropagationSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'range',
            range: mockedRange,
            isReverted: false,
        });
    });
});

describe('SelectionPlugin on Safari', () => {
    let disposer: jasmine.Spy;
    let createElementSpy: jasmine.Spy;
    let appendChildSpy: jasmine.Spy;
    let attachDomEvent: jasmine.Spy;
    let removeEventListenerSpy: jasmine.Spy;
    let addEventListenerSpy: jasmine.Spy;
    let getDocumentSpy: jasmine.Spy;
    let hasFocusSpy: jasmine.Spy;
    let isInShadowEditSpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;
    let editor: IEditor;

    beforeEach(() => {
        disposer = jasmine.createSpy('disposer');
        createElementSpy = jasmine.createSpy('createElement').and.returnValue(MockedStyleNode);
        appendChildSpy = jasmine.createSpy('appendChild');
        attachDomEvent = jasmine.createSpy('attachDomEvent').and.returnValue(disposer);
        removeEventListenerSpy = jasmine.createSpy('removeEventListener');
        addEventListenerSpy = jasmine.createSpy('addEventListener');
        getDocumentSpy = jasmine.createSpy('getDocument').and.returnValue({
            createElement: createElementSpy,
            head: {
                appendChild: appendChildSpy,
            },
            addEventListener: addEventListenerSpy,
            removeEventListener: removeEventListenerSpy,
        });
        hasFocusSpy = jasmine.createSpy('hasFocus');
        isInShadowEditSpy = jasmine.createSpy('isInShadowEdit');
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');

        editor = ({
            getDocument: getDocumentSpy,
            attachDomEvent,
            getEnvironment: () => ({
                isSafari: true,
            }),
            hasFocus: hasFocusSpy,
            isInShadowEdit: isInShadowEditSpy,
            getDOMSelection: getDOMSelectionSpy,
        } as any) as IEditor;
    });

    it('init and dispose', () => {
        const plugin = createSelectionPlugin({});
        const state = plugin.getState();

        plugin.initialize(editor);

        expect(state).toEqual({
            selection: null,
            selectionStyleNode: MockedStyleNode,
            imageSelectionBorderColor: undefined,
        });
        expect(attachDomEvent).toHaveBeenCalled();
        expect(addEventListenerSpy).toHaveBeenCalledWith('selectionchange', jasmine.anything());
        expect(removeEventListenerSpy).not.toHaveBeenCalled();
        expect(disposer).not.toHaveBeenCalled();

        const onSelectionChange = addEventListenerSpy.calls.argsFor(0)[1] as Function;

        plugin.dispose();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('selectionchange', onSelectionChange);
        expect(disposer).toHaveBeenCalled();
    });

    it('onSelectionChange when editor has focus, no selection, not in shadow edit', () => {
        const plugin = createSelectionPlugin({});
        const state = plugin.getState();
        const mockedOldSelection = 'OLDSELECTION' as any;

        state.selection = mockedOldSelection;

        plugin.initialize(editor);

        const onSelectionChange = addEventListenerSpy.calls.argsFor(0)[1] as Function;

        hasFocusSpy.and.returnValue(true);
        isInShadowEditSpy.and.returnValue(false);
        getDOMSelectionSpy.and.returnValue(null);

        onSelectionChange();

        expect(state).toEqual({
            selection: mockedOldSelection,
            selectionStyleNode: MockedStyleNode,
            imageSelectionBorderColor: undefined,
        });
        expect(getDOMSelectionSpy).toHaveBeenCalledTimes(1);
    });

    it('onSelectionChange when editor has focus, range selection, not in shadow edit', () => {
        const plugin = createSelectionPlugin({});
        const state = plugin.getState();
        const mockedOldSelection = 'OLDSELECTION' as any;

        state.selection = mockedOldSelection;

        plugin.initialize(editor);

        const onSelectionChange = addEventListenerSpy.calls.argsFor(0)[1] as Function;
        const mockedNewSelection = {
            type: 'range',
        } as any;

        hasFocusSpy.and.returnValue(true);
        isInShadowEditSpy.and.returnValue(false);
        getDOMSelectionSpy.and.returnValue(mockedNewSelection);

        onSelectionChange();

        expect(state).toEqual({
            selection: mockedNewSelection,
            selectionStyleNode: MockedStyleNode,
            imageSelectionBorderColor: undefined,
        });
        expect(getDOMSelectionSpy).toHaveBeenCalledTimes(1);
    });

    it('onSelectionChange when editor has focus, table selection, not in shadow edit', () => {
        const plugin = createSelectionPlugin({});
        const state = plugin.getState();
        const mockedOldSelection = 'OLDSELECTION' as any;

        state.selection = mockedOldSelection;

        plugin.initialize(editor);

        const onSelectionChange = addEventListenerSpy.calls.argsFor(0)[1] as Function;
        const mockedNewSelection = {
            type: 'table',
        } as any;

        hasFocusSpy.and.returnValue(true);
        isInShadowEditSpy.and.returnValue(false);
        getDOMSelectionSpy.and.returnValue(mockedNewSelection);

        onSelectionChange();

        expect(state).toEqual({
            selection: mockedOldSelection,
            selectionStyleNode: MockedStyleNode,
            imageSelectionBorderColor: undefined,
        });
        expect(getDOMSelectionSpy).toHaveBeenCalledTimes(1);
    });

    it('onSelectionChange when editor has focus, image selection, not in shadow edit', () => {
        const plugin = createSelectionPlugin({});
        const state = plugin.getState();
        const mockedOldSelection = 'OLDSELECTION' as any;

        state.selection = mockedOldSelection;

        plugin.initialize(editor);

        const onSelectionChange = addEventListenerSpy.calls.argsFor(0)[1] as Function;
        const mockedNewSelection = {
            type: 'image',
        } as any;

        hasFocusSpy.and.returnValue(true);
        isInShadowEditSpy.and.returnValue(false);
        getDOMSelectionSpy.and.returnValue(mockedNewSelection);

        onSelectionChange();

        expect(state).toEqual({
            selection: mockedOldSelection,
            selectionStyleNode: MockedStyleNode,
            imageSelectionBorderColor: undefined,
        });
        expect(getDOMSelectionSpy).toHaveBeenCalledTimes(1);
    });

    it('onSelectionChange when editor has focus, is in shadow edit', () => {
        const plugin = createSelectionPlugin({});
        const state = plugin.getState();
        const mockedOldSelection = 'OLDSELECTION' as any;

        state.selection = mockedOldSelection;

        plugin.initialize(editor);

        const onSelectionChange = addEventListenerSpy.calls.argsFor(0)[1] as Function;
        const mockedNewSelection = {
            type: 'range',
        } as any;

        hasFocusSpy.and.returnValue(true);
        isInShadowEditSpy.and.returnValue(true);
        getDOMSelectionSpy.and.returnValue(mockedNewSelection);

        onSelectionChange();

        expect(state).toEqual({
            selection: mockedOldSelection,
            selectionStyleNode: MockedStyleNode,
            imageSelectionBorderColor: undefined,
        });
        expect(getDOMSelectionSpy).toHaveBeenCalledTimes(0);
    });

    it('onSelectionChange when editor does not have focus', () => {
        const plugin = createSelectionPlugin({});
        const state = plugin.getState();
        const mockedOldSelection = 'OLDSELECTION' as any;

        state.selection = mockedOldSelection;

        plugin.initialize(editor);

        const onSelectionChange = addEventListenerSpy.calls.argsFor(0)[1] as Function;
        const mockedNewSelection = {
            type: 'range',
        } as any;

        hasFocusSpy.and.returnValue(false);
        isInShadowEditSpy.and.returnValue(false);
        getDOMSelectionSpy.and.returnValue(mockedNewSelection);

        onSelectionChange();

        expect(state).toEqual({
            selection: mockedOldSelection,
            selectionStyleNode: MockedStyleNode,
            imageSelectionBorderColor: undefined,
        });
        expect(getDOMSelectionSpy).toHaveBeenCalledTimes(0);
    });
});
