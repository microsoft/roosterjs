import * as isSingleImageInSelection from '../../../lib/corePlugin/selection/isSingleImageInSelection';
import { createDOMHelper } from '../../../lib/editor/core/DOMHelperImpl';
import { createSelectionPlugin } from '../../../lib/corePlugin/selection/SelectionPlugin';
import {
    DOMEventRecord,
    DOMSelection,
    EditorPlugin,
    IEditor,
    PluginWithState,
    SelectionPluginState,
} from 'roosterjs-content-model-types';

describe('SelectionPlugin', () => {
    it('init and dispose', () => {
        const plugin = createSelectionPlugin({});
        const disposer = jasmine.createSpy('disposer');
        const attachDomEvent = jasmine.createSpy('attachDomEvent').and.returnValue(disposer);
        const removeEventListenerSpy = jasmine.createSpy('removeEventListener');
        const addEventListenerSpy = jasmine.createSpy('addEventListener');
        const getDocumentSpy = jasmine.createSpy('getDocument').and.returnValue({
            removeEventListener: removeEventListenerSpy,
            addEventListener: addEventListenerSpy,
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
            imageSelectionBorderColor: undefined,
            tableSelection: null,
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
        const addEventListenerSpy = jasmine.createSpy('addEventListener');
        const attachDomEvent = jasmine
            .createSpy('attachDomEvent')
            .and.returnValue(jasmine.createSpy('disposer'));
        const removeEventListenerSpy = jasmine.createSpy('removeEventListener');
        const getDocumentSpy = jasmine.createSpy('getDocument').and.returnValue({
            removeEventListener: removeEventListenerSpy,
            addEventListener: addEventListenerSpy,
        });

        plugin.initialize(<IEditor>(<any>{
            getDocument: getDocumentSpy,
            attachDomEvent,
            getEnvironment: () => ({}),
        }));

        expect(state).toEqual({
            selection: null,
            imageSelectionBorderColor: 'red',
            tableSelection: null,
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
    let getDocumentSpy: jasmine.Spy;
    let setDOMSelectionSpy: jasmine.Spy;
    let removeEventListenerSpy: jasmine.Spy;
    let addEventListenerSpy: jasmine.Spy;
    let getScrollContainerSpy: jasmine.Spy;

    let editor: IEditor;

    beforeEach(() => {
        triggerEvent = jasmine.createSpy('triggerEvent');
        getElementAtCursorSpy = jasmine.createSpy('getElementAtCursor');
        removeEventListenerSpy = jasmine.createSpy('removeEventListener');
        addEventListenerSpy = jasmine.createSpy('addEventListener');
        getDocumentSpy = jasmine.createSpy('getDocument').and.returnValue({
            removeEventListener: removeEventListenerSpy,
            addEventListener: addEventListenerSpy,
        });
        setDOMSelectionSpy = jasmine.createSpy('setDOMSelection');
        getScrollContainerSpy = jasmine.createSpy('getScrollContainer');

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
            getScrollContainer: getScrollContainerSpy,
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
            imageSelectionBorderColor: undefined,
            skipReselectOnFocus: false,
            tableSelection: null,
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
            imageSelectionBorderColor: undefined,
            skipReselectOnFocus: true,
            tableSelection: null,
        });
    });

    it('Trigger onFocusEvent, use cached scrollTop', () => {
        const scMock: any = {};
        const scrollTop = 5;
        getScrollContainerSpy.and.returnValue(scMock);
        (plugin as any).scrollTopCache = scrollTop;

        eventMap.focus.beforeDispatch();

        expect(scMock.scrollTop).toEqual(scrollTop);
        expect((plugin as any).scrollTopCache).toEqual(0);
    });

    it('onBlur cache scrollTop', () => {
        const scrollTop = 5;
        const scMock: any = { scrollTop };
        getScrollContainerSpy.and.returnValue(scMock);
        plugin.getState().selection = <any>true;

        eventMap.blur.beforeDispatch();

        expect((plugin as any).scrollTopCache).toEqual(scrollTop);
    });
});

describe('SelectionPlugin scroll event ', () => {
    let plugin: PluginWithState<SelectionPluginState>;
    let triggerEvent: jasmine.Spy;
    let getElementAtCursorSpy: jasmine.Spy;
    let getDocumentSpy: jasmine.Spy;
    let setDOMSelectionSpy: jasmine.Spy;
    let removeEventListenerSpy: jasmine.Spy;
    let addEventListenerSpy: jasmine.Spy;
    let getScrollContainerSpy: jasmine.Spy;
    let hasFocusSpy: jasmine.Spy;

    let editor: IEditor;

    beforeEach(() => {
        triggerEvent = jasmine.createSpy('triggerEvent');
        getElementAtCursorSpy = jasmine.createSpy('getElementAtCursor');
        removeEventListenerSpy = jasmine.createSpy('removeEventListener');
        addEventListenerSpy = jasmine.createSpy('addEventListener');
        getDocumentSpy = jasmine.createSpy('getDocument').and.returnValue({
            removeEventListener: removeEventListenerSpy,
            addEventListener: addEventListenerSpy,
        });
        setDOMSelectionSpy = jasmine.createSpy('setDOMSelection');
        getScrollContainerSpy = jasmine.createSpy('getScrollContainer');
        hasFocusSpy = jasmine.createSpy('hasFocus');

        plugin = createSelectionPlugin({});

        editor = <IEditor>(<any>{
            getDocument: getDocumentSpy,
            triggerEvent,
            getEnvironment: () => ({}),
            attachDomEvent: () => {
                return jasmine.createSpy('disposer');
            },
            getElementAtCursor: getElementAtCursorSpy,
            setDOMSelection: setDOMSelectionSpy,
            getScrollContainer: getScrollContainerSpy,
            hasFocus: hasFocusSpy,
        });
        plugin.initialize(editor);
    });

    afterEach(() => {
        plugin.dispose();
    });

    it('Cache scrollTop', () => {
        hasFocusSpy.and.returnValue(false);
        const scrollTop = 5;
        const scMock: any = { scrollTop };
        getScrollContainerSpy.and.returnValue(scMock);
        (plugin as any).scrollTopCache = undefined;

        plugin.onPluginEvent?.({
            eventType: 'scroll',
            rawEvent: <any>{},
            scrollContainer: scMock,
        });

        expect((plugin as any).scrollTopCache).toEqual(scrollTop);
    });

    it('Do not cache scrollTop', () => {
        hasFocusSpy.and.returnValue(true);
        const scrollTop = 5;
        const scMock: any = { scrollTop };
        getScrollContainerSpy.and.returnValue(scMock);
        (plugin as any).scrollTopCache = undefined;

        plugin.onPluginEvent?.({
            eventType: 'scroll',
            rawEvent: <any>{},
            scrollContainer: scMock,
        });

        expect((plugin as any).scrollTopCache).toEqual(undefined);
    });
});

describe('SelectionPlugin handle image selection', () => {
    let plugin: EditorPlugin;
    let editor: IEditor;
    let getDOMSelectionSpy: jasmine.Spy;
    let setDOMSelectionSpy: jasmine.Spy;
    let getDocumentSpy: jasmine.Spy;
    let createRangeSpy: jasmine.Spy;
    let domHelperSpy: jasmine.Spy;
    let requestAnimationFrameSpy: jasmine.Spy;
    let addEventListenerSpy: jasmine.Spy;

    beforeEach(() => {
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        setDOMSelectionSpy = jasmine.createSpy('setDOMSelection');
        createRangeSpy = jasmine.createSpy('createRange');
        requestAnimationFrameSpy = jasmine.createSpy('requestAnimationFrame');
        addEventListenerSpy = jasmine.createSpy('addEventListener');
        getDocumentSpy = jasmine.createSpy('getDocument').and.returnValue({
            createRange: createRangeSpy,
            addEventListener: addEventListenerSpy,
            defaultView: {
                requestAnimationFrame: requestAnimationFrameSpy,
            },
        });
        domHelperSpy = jasmine.createSpy('domHelperSpy');

        editor = {
            getDOMHelper: domHelperSpy,
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
        plugin.onPluginEvent!({
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
        plugin.onPluginEvent!({
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
        plugin.onPluginEvent!({
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

        plugin.onPluginEvent!({
            eventType: 'mouseDown',
            rawEvent: {
                target: mockedImage,
            } as any,
        });

        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(0);
    });

    it('Image selection, mouse down to same image right click', () => {
        const parent = document.createElement('div');
        const mockedImage = document.createElement('img');
        parent.appendChild(mockedImage);
        const range = document.createRange();
        range.selectNode(mockedImage);

        const preventDefaultSpy = jasmine.createSpy('preventDefault');

        mockedImage.contentEditable = 'true';

        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: mockedImage,
        });

        plugin.onPluginEvent!({
            eventType: 'mouseDown',
            rawEvent: (<Partial<Event>>{
                target: mockedImage,
                button: 2,
                preventDefault: preventDefaultSpy,
            }) as any,
        });

        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(0);
        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('Image selection, mouse down to image right click', () => {
        const parent = document.createElement('div');
        const mockedImage = document.createElement('img');
        parent.appendChild(mockedImage);

        mockedImage.contentEditable = 'true';
        plugin.onPluginEvent!({
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

        plugin.onPluginEvent!({
            eventType: 'mouseDown',
            rawEvent: {
                target: node,
                button: 2,
            } as any,
        });

        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(0);
    });

    it('no selection, mouse up to image, is clicking, isEditable', () => {
        const parent = document.createElement('div');
        const mockedImage = document.createElement('img');
        parent.appendChild(mockedImage);
        const range = document.createRange();
        range.selectNode(mockedImage);

        mockedImage.contentEditable = 'true';

        plugin.onPluginEvent!({
            eventType: 'mouseUp',
            isClicking: true,
            rawEvent: {
                target: mockedImage,
            } as any,
        });

        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'range',
            range,
            isReverted: false,
        });
    });

    it('no selection, mouse up to image, is clicking, not isEditable', () => {
        const mockedImage = document.createElement('img');

        mockedImage.contentEditable = 'false';

        plugin.onPluginEvent!({
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

        plugin.onPluginEvent!({
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

        plugin.onPluginEvent!({
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

        plugin.onPluginEvent!({
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

        plugin.onPluginEvent!({
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

        plugin.onPluginEvent!({
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

    it('key down - other key with modifier key', () => {
        const stopPropagationSpy = jasmine.createSpy('stopPropagation');
        const rawEvent = {
            key: 'A',
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

        plugin.onPluginEvent!({
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

        plugin.onPluginEvent!({
            eventType: 'keyDown',
            rawEvent,
        });

        expect(stopPropagationSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
    });
});

describe('SelectionPlugin handle table selection', () => {
    let plugin: PluginWithState<SelectionPluginState>;
    let editor: IEditor;
    let contentDiv: HTMLElement;
    let getDOMSelectionSpy: jasmine.Spy;
    let setDOMSelectionSpy: jasmine.Spy;
    let getDocumentSpy: jasmine.Spy;
    let createRangeSpy: jasmine.Spy;
    let mouseDispatcher: Record<string, DOMEventRecord>;
    let focusDispatcher: Record<string, DOMEventRecord>;
    let focusDisposer: jasmine.Spy;
    let mouseMoveDisposer: jasmine.Spy;
    let requestAnimationFrameSpy: jasmine.Spy;
    let getComputedStyleSpy: jasmine.Spy;
    let addEventListenerSpy: jasmine.Spy;

    beforeEach(() => {
        contentDiv = document.createElement('div');
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        setDOMSelectionSpy = jasmine.createSpy('setDOMSelection');
        createRangeSpy = jasmine.createSpy('createRange');
        requestAnimationFrameSpy = jasmine.createSpy('requestAnimationFrame');
        getComputedStyleSpy = jasmine.createSpy('getComputedStyle');
        addEventListenerSpy = jasmine.createSpy('addEventListener');
        getDocumentSpy = jasmine.createSpy('getDocument').and.returnValue({
            createRange: createRangeSpy,
            defaultView: {
                requestAnimationFrame: requestAnimationFrameSpy,
                getComputedStyle: getComputedStyleSpy,
            },
            addEventListener: addEventListenerSpy,
        });
        focusDisposer = jasmine.createSpy('focus');
        mouseMoveDisposer = jasmine.createSpy('mouseMove');

        const domHelper = createDOMHelper(contentDiv);

        editor = {
            getDOMSelection: getDOMSelectionSpy,
            setDOMSelection: setDOMSelectionSpy,
            getDocument: getDocumentSpy,
            getEnvironment: () => ({}),
            getDOMHelper: () => domHelper,
            attachDomEvent: (map: Record<string, Record<string, DOMEventRecord>>) => {
                if (map.mousemove) {
                    mouseDispatcher = map;
                    return mouseMoveDisposer;
                } else {
                    focusDispatcher = map;
                    return focusDisposer;
                }
            },
        } as any;
        plugin = createSelectionPlugin({});
        plugin.initialize(editor);
    });

    afterEach(() => {
        focusDispatcher = undefined!;
        mouseDispatcher = undefined!;
    });

    it('MouseDown - has tableSelection, clear it when left click', () => {
        const state = plugin.getState();
        const mockedTableSelection = 'TableSelection' as any;

        state.tableSelection = mockedTableSelection;
        getDOMSelectionSpy.and.returnValue({
            type: 'table',
        });

        plugin.onPluginEvent!({
            eventType: 'mouseDown',
            rawEvent: {
                button: 2,
            } as any,
        });

        expect(state).toEqual({
            selection: null,
            tableSelection: mockedTableSelection,
            imageSelectionBorderColor: undefined,
        });

        plugin.onPluginEvent!({
            eventType: 'mouseDown',
            rawEvent: {
                button: 0,
            } as any,
        });

        expect(state).toEqual({
            selection: null,
            tableSelection: null,
            imageSelectionBorderColor: undefined,
        });
        expect(mouseDispatcher).toBeUndefined();
    });

    it('MouseDown - save a table selection when left click', () => {
        const state = plugin.getState();
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        const div = document.createElement('div');

        tr.appendChild(td);
        table.appendChild(tr);
        contentDiv.appendChild(table);
        contentDiv.appendChild(div);

        getDOMSelectionSpy.and.returnValue({
            type: 'table',
        });

        plugin.onPluginEvent!({
            eventType: 'mouseDown',
            rawEvent: {
                button: 0,
                target: div,
            } as any,
        });

        expect(state).toEqual({
            selection: null,
            tableSelection: null,
            imageSelectionBorderColor: undefined,
        });

        plugin.onPluginEvent!({
            eventType: 'mouseDown',
            rawEvent: {
                button: 0,
                target: td,
            } as any,
        });

        expect(state).toEqual({
            selection: null,
            tableSelection: {
                table: table,
                parsedTable: [[td]],
                firstCo: { row: 0, col: 0 },
                startNode: td,
            },
            mouseDisposer: mouseMoveDisposer,
            imageSelectionBorderColor: undefined,
        });
        expect(mouseDispatcher).toBeDefined();
    });

    it('MouseDown - triple click', () => {
        const state = plugin.getState();
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        const td = document.createElement('td');

        const preventDefaultSpy = jasmine.createSpy('preventDefault');

        tr.appendChild(td);
        table.appendChild(tr);
        contentDiv.appendChild(table);

        plugin.onPluginEvent!({
            eventType: 'mouseDown',
            rawEvent: {
                button: 0,
                target: td,
                detail: 3,
                preventDefault: preventDefaultSpy,
            } as any,
        });

        expect(state).toEqual({
            selection: null,
            tableSelection: {
                table: table,
                parsedTable: [[td]],
                firstCo: { row: 0, col: 0 },
                lastCo: { row: 0, col: 0 },
                startNode: td,
            },
            mouseDisposer: mouseMoveDisposer,
            imageSelectionBorderColor: undefined,
        });
        expect(mouseDispatcher).toBeDefined();
        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'table',
            table: table,
            firstRow: 0,
            firstColumn: 0,
            lastRow: 0,
            lastColumn: 0,
        });
    });

    it('MouseMove - in same table', () => {
        const state = plugin.getState();
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const div = document.createElement('div');

        td1.id = 'td1';
        td2.id = 'td2';

        tr.appendChild(td1);
        tr.appendChild(td2);
        table.appendChild(tr);
        contentDiv.appendChild(table);
        contentDiv.appendChild(div);

        getDOMSelectionSpy.and.returnValue({
            type: 'table',
        });

        plugin.onPluginEvent!({
            eventType: 'mouseDown',
            rawEvent: {
                button: 0,
                target: td1,
            } as any,
        });

        expect(mouseDispatcher.mousemove).toBeDefined();
        expect(state.tableSelection).toEqual({
            table,
            parsedTable: [[td1, td2]],
            firstCo: { row: 0, col: 0 },
            startNode: td1,
        });
        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);

        const preventDefaultSpy = jasmine.createSpy('preventDefault');
        const setStartSpy = jasmine.createSpy('setStart');
        const setEndSpy = jasmine.createSpy('setEnd');

        createRangeSpy.and.returnValue({
            setStart: setStartSpy,
            setEnd: setEndSpy,
            commonAncestorContainer: table,
        });

        mouseDispatcher.mousemove.beforeDispatch!({
            target: td1,
            preventDefault: preventDefaultSpy,
        } as any);

        expect(preventDefaultSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
        expect(state.tableSelection).toEqual({
            table,
            parsedTable: [[td1, td2]],
            firstCo: { row: 0, col: 0 },
            startNode: td1,
        });
        expect(setStartSpy).toHaveBeenCalledWith(td1, 0);
        expect(setEndSpy).toHaveBeenCalledWith(td1, 0);

        mouseDispatcher.mousemove.beforeDispatch!({
            target: td2,
            preventDefault: preventDefaultSpy,
        } as any);

        expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(2);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'table',
            table: table,
            firstRow: 0,
            firstColumn: 0,
            lastRow: 0,
            lastColumn: 1,
        });
        expect(state.tableSelection).toEqual({
            table,
            parsedTable: [[td1, td2]],
            firstCo: { row: 0, col: 0 },
            lastCo: { row: 0, col: 1 },
            startNode: td1,
        });

        mouseDispatcher.mousemove.beforeDispatch!({
            target: div,
            preventDefault: preventDefaultSpy,
        } as any);

        expect(preventDefaultSpy).toHaveBeenCalledTimes(2);
        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(2);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'table',
            table: table,
            firstRow: 0,
            firstColumn: 0,
            lastRow: 0,
            lastColumn: 1,
        });
        expect(state.tableSelection).toEqual({
            table,
            parsedTable: [[td1, td2]],
            firstCo: { row: 0, col: 0 },
            lastCo: { row: 0, col: 1 },
            startNode: td1,
        });
    });

    it('MouseMove - move to outer table', () => {
        const state = plugin.getState();
        const table1 = document.createElement('table');
        const table2 = document.createElement('table');
        const tr1 = document.createElement('tr');
        const tr2 = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const div = document.createElement('div');

        td1.id = 'td1';
        td2.id = 'td2';

        tr1.appendChild(td1);
        tr2.appendChild(td2);
        table1.appendChild(tr1);
        table2.appendChild(tr2);

        td1.appendChild(table2);

        contentDiv.appendChild(table1);
        contentDiv.appendChild(div);

        getDOMSelectionSpy.and.returnValue({
            type: 'table',
        });

        plugin.onPluginEvent!({
            eventType: 'mouseDown',
            rawEvent: {
                button: 0,
                target: td2,
            } as any,
        });

        expect(mouseDispatcher.mousemove).toBeDefined();
        expect(state.tableSelection).toEqual({
            table: table2,
            parsedTable: [[td2]],
            firstCo: { row: 0, col: 0 },
            startNode: td2,
        });
        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith(null);

        const preventDefaultSpy = jasmine.createSpy('preventDefault');
        const setStartSpy = jasmine.createSpy('setStart');
        const setEndSpy = jasmine.createSpy('setEnd');

        createRangeSpy.and.returnValue({
            setStart: setStartSpy,
            setEnd: setEndSpy,
            commonAncestorContainer: table1,
        });

        mouseDispatcher.mousemove.beforeDispatch!({
            target: td1,
            preventDefault: preventDefaultSpy,
        } as any);

        expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(2);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'table',
            table: table1,
            firstRow: 0,
            firstColumn: 0,
            lastRow: 0,
            lastColumn: 0,
        });
        expect(state.tableSelection).toEqual({
            table: table1,
            parsedTable: [[td1]],
            firstCo: { row: 0, col: 0 },
            lastCo: { row: 0, col: 0 },
            startNode: td2,
        });
        expect(setStartSpy).toHaveBeenCalledWith(td2, 0);
        expect(setEndSpy).toHaveBeenCalledWith(td1, 0);

        createRangeSpy.and.returnValue({
            setStart: setStartSpy,
            setEnd: setEndSpy,
            commonAncestorContainer: table2,
        });

        mouseDispatcher.mousemove.beforeDispatch!({
            target: td2,
            preventDefault: preventDefaultSpy,
        } as any);

        expect(preventDefaultSpy).toHaveBeenCalledTimes(2);
        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(3);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'table',
            table: table2,
            firstRow: 0,
            firstColumn: 0,
            lastRow: 0,
            lastColumn: 0,
        });
        expect(state.tableSelection).toEqual({
            table: table2,
            parsedTable: [[td2]],
            firstCo: { row: 0, col: 0 },
            lastCo: { row: 0, col: 0 },
            startNode: td2,
        });

        const mockedRange = {
            setStart: setStartSpy,
            setEnd: setEndSpy,
            commonAncestorContainer: contentDiv,
        } as any;

        createRangeSpy.and.returnValue(mockedRange);

        mouseDispatcher.mousemove.beforeDispatch!({
            target: div,
            preventDefault: preventDefaultSpy,
        } as any);

        expect(preventDefaultSpy).toHaveBeenCalledTimes(2);
        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(4);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'range',
            range: mockedRange,
            isReverted: false,
        });
        expect(state.tableSelection).toEqual({
            table: table2,
            parsedTable: [[td2]],
            firstCo: { row: 0, col: 0 },
            lastCo: { row: 0, col: 0 },
            startNode: td2,
        });
    });

    it('OnDrop', () => {
        expect(focusDispatcher.drop).toBeDefined();

        const state = plugin.getState();
        const disposer = jasmine.createSpy('disposer');

        state.mouseDisposer = disposer;

        focusDispatcher.drop.beforeDispatch!(null!);

        expect(disposer).toHaveBeenCalledTimes(1);
        expect(state.mouseDisposer).toBeUndefined();

        focusDispatcher.drop.beforeDispatch!(null!);

        expect(disposer).toHaveBeenCalledTimes(1);
        expect(state.mouseDisposer).toBeUndefined();
    });

    describe('OnKeyDown', () => {
        let td1: HTMLTableCellElement;
        let td2: HTMLTableCellElement;
        let td3: HTMLTableCellElement;
        let td4: HTMLTableCellElement;
        let tr1: HTMLElement;
        let tr2: HTMLElement;
        let table: HTMLTableElement;
        let div: HTMLElement;

        beforeEach(() => {
            table = document.createElement('table');
            tr1 = document.createElement('tr');
            tr2 = document.createElement('tr');
            td1 = document.createElement('td');
            td2 = document.createElement('td');
            td3 = document.createElement('td');
            td4 = document.createElement('td');
            div = document.createElement('div');

            td1.id = 'td1';
            td2.id = 'td2';
            td3.id = 'td3';
            td4.id = 'td4';

            tr1.appendChild(td1);
            tr1.appendChild(td2);
            tr2.appendChild(td3);
            tr2.appendChild(td4);
            table.appendChild(tr1);
            table.appendChild(tr2);
            contentDiv.appendChild(table);
            contentDiv.appendChild(div);
        });

        it('From Range, Press A', () => {
            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: { startContainer: td1, startOffset: 0, endContainer: td1, endOffset: 0 },
                isReverted: false,
            });

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'a',
                } as any,
            });

            expect(requestAnimationFrameSpy).not.toHaveBeenCalled();
            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: null,
                imageSelectionBorderColor: undefined,
            });
            expect(setDOMSelectionSpy).not.toHaveBeenCalled();
        });

        it('From Range, Press Right', () => {
            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: { startContainer: td1, startOffset: 0, endContainer: td1, endOffset: 0 },
                isReverted: false,
            });

            requestAnimationFrameSpy.and.callFake((func: Function) => {
                getDOMSelectionSpy.and.returnValue({
                    type: 'range',
                    range: {
                        startContainer: td2,
                        startOffset: 0,
                        endContainer: td2,
                        endOffset: 0,
                        commonAncestorContainer: tr1,
                        collapsed: true,
                    },
                    isReverted: false,
                });

                func();
            });

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'ArrowRight',
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: null,
                imageSelectionBorderColor: undefined,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(0);
        });

        it('From Range, Press Tab', () => {
            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: {
                    startContainer: td1,
                    startOffset: 0,
                    endContainer: td1,
                    endOffset: 0,
                    commonAncestorContainer: tr1,
                },
                isReverted: false,
            });

            requestAnimationFrameSpy.and.callFake((func: Function) => {
                getDOMSelectionSpy.and.returnValue({
                    type: 'range',
                    range: {
                        startContainer: td1,
                        startOffset: 0,
                        endContainer: td1,
                        endOffset: 0,
                        commonAncestorContainer: tr1,
                        collapsed: true,
                    },
                    isReverted: false,
                });

                func();
            });

            const setStartSpy = jasmine.createSpy('setStart');
            const collapseSpy = jasmine.createSpy('collapse');
            const mockedRange = {
                setStart: setStartSpy,
                collapse: collapseSpy,
            } as any;

            createRangeSpy.and.returnValue(mockedRange);

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Tab',
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: null,
                imageSelectionBorderColor: undefined,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
            expect(setStartSpy).toHaveBeenCalledWith(td2, 0);
        });

        it('From Range, Press Shift+Tab', () => {
            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: {
                    startContainer: td2,
                    startOffset: 0,
                    endContainer: td2,
                    endOffset: 0,
                    commonAncestorContainer: tr1,
                },
                isReverted: false,
            });

            requestAnimationFrameSpy.and.callFake((func: Function) => {
                getDOMSelectionSpy.and.returnValue({
                    type: 'range',
                    range: {
                        startContainer: td2,
                        startOffset: 0,
                        endContainer: td2,
                        endOffset: 0,
                        commonAncestorContainer: tr1,
                        collapsed: true,
                    },
                    isReverted: false,
                });

                func();
            });

            const setStartSpy = jasmine.createSpy('setStart');
            const collapseSpy = jasmine.createSpy('collapse');
            const mockedRange = {
                setStart: setStartSpy,
                collapse: collapseSpy,
            } as any;

            createRangeSpy.and.returnValue(mockedRange);

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Tab',
                    shiftKey: true,
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: null,
                imageSelectionBorderColor: undefined,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
            expect(setStartSpy).toHaveBeenCalledWith(td1, 0);
        });

        it('From Range, Press Tab - Next Row', () => {
            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: {
                    startContainer: td2,
                    startOffset: 0,
                    endContainer: td2,
                    endOffset: 0,
                    commonAncestorContainer: tr1,
                },
                isReverted: false,
            });

            requestAnimationFrameSpy.and.callFake((func: Function) => {
                getDOMSelectionSpy.and.returnValue({
                    type: 'range',
                    range: {
                        startContainer: td2,
                        startOffset: 0,
                        endContainer: td2,
                        endOffset: 0,
                        commonAncestorContainer: tr1,
                        collapsed: true,
                    },
                    isReverted: false,
                });

                func();
            });

            const setStartSpy = jasmine.createSpy('setStart');
            const collapseSpy = jasmine.createSpy('collapse');
            const mockedRange = {
                setStart: setStartSpy,
                collapse: collapseSpy,
            } as any;

            createRangeSpy.and.returnValue(mockedRange);

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Tab',
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: null,
                imageSelectionBorderColor: undefined,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
            expect(setStartSpy).toHaveBeenCalledWith(td3, 0);
        });

        it('From Range, First cell - Press Shift+Tab', () => {
            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: {
                    startContainer: td1,
                    startOffset: 0,
                    endContainer: td1,
                    endOffset: 0,
                    commonAncestorContainer: tr1,
                },
                isReverted: false,
            });

            requestAnimationFrameSpy.and.callFake((func: Function) => {
                getDOMSelectionSpy.and.returnValue({
                    type: 'range',
                    range: {
                        startContainer: td1,
                        startOffset: 0,
                        endContainer: td1,
                        endOffset: 0,
                        commonAncestorContainer: tr1,
                        collapsed: true,
                    },
                    isReverted: false,
                });

                func();
            });

            const setStartSpy = jasmine.createSpy('setStart');
            const collapseSpy = jasmine.createSpy('collapse');
            const mockedRange = {
                setStart: setStartSpy,
                collapse: collapseSpy,
            } as any;

            createRangeSpy.and.returnValue(mockedRange);

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Tab',
                    shiftKey: true,
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: null,
                imageSelectionBorderColor: undefined,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
            expect(setStartSpy).toHaveBeenCalledWith(table.parentNode, 0);
        });

        it('From Range, Last cell - Press Tab', () => {
            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: {
                    startContainer: td4,
                    startOffset: 0,
                    endContainer: td4,
                    endOffset: 0,
                    commonAncestorContainer: tr2,
                },
                isReverted: false,
            });

            requestAnimationFrameSpy.and.callFake((func: Function) => {
                getDOMSelectionSpy.and.returnValue({
                    type: 'range',
                    range: {
                        startContainer: td4,
                        startOffset: 0,
                        endContainer: td4,
                        endOffset: 0,
                        commonAncestorContainer: tr2,
                        collapsed: true,
                    },
                    isReverted: false,
                });

                func();
            });

            const setStartSpy = jasmine.createSpy('setStart');
            const collapseSpy = jasmine.createSpy('collapse');
            const mockedRange = {
                setStart: setStartSpy,
                collapse: collapseSpy,
            } as any;

            createRangeSpy.and.returnValue(mockedRange);

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Tab',
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: null,
                imageSelectionBorderColor: undefined,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
            expect(setStartSpy).toHaveBeenCalledWith(table.parentNode, 1);
        });

        it('From Range, Press Down', () => {
            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: {
                    startContainer: td2,
                    startOffset: 0,
                    endContainer: td2,
                    endOffset: 0,
                    commonAncestorContainer: tr1,
                },
                isReverted: false,
            });

            requestAnimationFrameSpy.and.callFake((func: Function) => {
                getDOMSelectionSpy.and.returnValue({
                    type: 'range',
                    range: {
                        startContainer: td3,
                        startOffset: 0,
                        endContainer: td3,
                        endOffset: 0,
                        commonAncestorContainer: tr2,
                        collapsed: true,
                    },
                    isReverted: false,
                });

                func();
            });

            const setStartSpy = jasmine.createSpy('setStart');
            const collapseSpy = jasmine.createSpy('collapse');
            const mockedRange = {
                setStart: setStartSpy,
                collapse: collapseSpy,
            } as any;

            createRangeSpy.and.returnValue(mockedRange);

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'ArrowDown',
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: null,
                imageSelectionBorderColor: undefined,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
            expect(setStartSpy).toHaveBeenCalledWith(td4, 0);
        });

        it('From Range, Press Shift+Up', () => {
            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: {
                    startContainer: td4,
                    startOffset: 0,
                    endContainer: td4,
                    endOffset: 0,
                    commonAncestorContainer: tr2,
                },
                isReverted: false,
            });

            requestAnimationFrameSpy.and.callFake((func: Function) => {
                getDOMSelectionSpy.and.returnValue({
                    type: 'range',
                    range: {
                        startContainer: td3,
                        startOffset: 0,
                        endContainer: td4,
                        endOffset: 0,
                        commonAncestorContainer: tr2,
                        collapsed: false,
                    },
                    isReverted: true,
                });

                func();
            });

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'ArrowUp',
                    shiftKey: true,
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: {
                    table,
                    parsedTable: [
                        [td1, td2],
                        [td3, td4],
                    ],
                    firstCo: { row: 1, col: 1 },
                    lastCo: { row: 0, col: 1 },
                    startNode: td4,
                },
                imageSelectionBorderColor: undefined,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'table',
                table,
                firstRow: 1,
                firstColumn: 1,
                lastRow: 0,
                lastColumn: 1,
            });
        });

        it('From Range, Press Shift+Down', () => {
            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: {
                    startContainer: td2,
                    startOffset: 0,
                    endContainer: td2,
                    endOffset: 0,
                    commonAncestorContainer: tr1,
                },
                isReverted: false,
            });

            requestAnimationFrameSpy.and.callFake((func: Function) => {
                getDOMSelectionSpy.and.returnValue({
                    type: 'range',
                    range: {
                        startContainer: td2,
                        startOffset: 0,
                        endContainer: td3,
                        endOffset: 0,
                        commonAncestorContainer: table,
                        collapsed: false,
                    },
                    isReverted: false,
                });

                func();
            });

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'ArrowDown',
                    shiftKey: true,
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: {
                    table,
                    parsedTable: [
                        [td1, td2],
                        [td3, td4],
                    ],
                    firstCo: { row: 0, col: 1 },
                    lastCo: { row: 1, col: 1 },
                    startNode: td2,
                },
                imageSelectionBorderColor: undefined,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'table',
                table,
                firstRow: 0,
                firstColumn: 1,
                lastRow: 1,
                lastColumn: 1,
            });
        });

        it('From Range, Press Shift+Down to ouside of table', () => {
            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: {
                    startContainer: td2,
                    startOffset: 0,
                    endContainer: td2,
                    endOffset: 0,
                    commonAncestorContainer: tr1,
                },
                isReverted: false,
            });

            requestAnimationFrameSpy.and.callFake((func: Function) => {
                getDOMSelectionSpy.and.returnValue({
                    type: 'range',
                    range: {
                        startContainer: td2,
                        startOffset: 0,
                        endContainer: div,
                        endOffset: 0,
                        commonAncestorContainer: contentDiv,
                        collapsed: false,
                    },
                    isReverted: false,
                });

                func();
            });

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'ArrowDown',
                    shiftKey: true,
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: {
                    table,
                    parsedTable: [
                        [td1, td2],
                        [td3, td4],
                    ],
                    firstCo: { row: 0, col: 1 },
                    startNode: td2,
                },
                imageSelectionBorderColor: undefined,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(0);
        });

        it('From Table, Press A', () => {
            getDOMSelectionSpy.and.returnValue({
                type: 'table',
            });
            plugin.getState().tableSelection = {
                table,
                parsedTable: [
                    [td1, td2],
                    [td3, td4],
                ],
                firstCo: { row: 0, col: 1 },
                lastCo: { row: 1, col: 1 },
                startNode: td2,
            };

            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'a',
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(requestAnimationFrameSpy).not.toHaveBeenCalled();
            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: {
                    table,
                    parsedTable: [
                        [td1, td2],
                        [td3, td4],
                    ],
                    firstCo: { row: 0, col: 1 },
                    lastCo: { row: 1, col: 1 },
                    startNode: td2,
                },
                imageSelectionBorderColor: undefined,
            });
            expect(setDOMSelectionSpy).not.toHaveBeenCalled();
            expect(preventDefaultSpy).not.toHaveBeenCalled();
        });

        it('From Table, Press Left', () => {
            getDOMSelectionSpy.and.returnValue({
                type: 'table',
            });
            plugin.getState().tableSelection = {
                table,
                parsedTable: [
                    [td1, td2],
                    [td3, td4],
                ],
                firstCo: { row: 0, col: 1 },
                lastCo: { row: 1, col: 1 },
                startNode: td2,
            };

            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            requestAnimationFrameSpy.and.callFake((func: Function) => {
                getDOMSelectionSpy.and.returnValue({
                    type: 'range',
                    range: {
                        startContainer: td2,
                        startOffset: 0,
                        endContainer: td2,
                        endOffset: 0,
                        commonAncestorContainer: tr1,
                        collapsed: true,
                    },
                    isReverted: false,
                });

                func();
            });

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'ArrowLeft',
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: null,
                imageSelectionBorderColor: undefined,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith(null);
            expect(preventDefaultSpy).not.toHaveBeenCalled();
        });

        it('From Table, Press Shift+Left', () => {
            getDOMSelectionSpy.and.returnValue({
                type: 'table',
            });

            plugin.getState().tableSelection = {
                table,
                parsedTable: [
                    [td1, td2],
                    [td3, td4],
                ],
                firstCo: { row: 0, col: 1 },
                lastCo: { row: 1, col: 1 },
                startNode: td2,
            };

            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            getComputedStyleSpy.and.returnValue({});

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'ArrowLeft',
                    shiftKey: true,
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: {
                    table,
                    parsedTable: [
                        [td1, td2],
                        [td3, td4],
                    ],
                    firstCo: { row: 0, col: 1 },
                    lastCo: { row: 1, col: 0 },
                    startNode: td2,
                },
                imageSelectionBorderColor: undefined,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'table',
                table,
                firstRow: 0,
                firstColumn: 1,
                lastRow: 1,
                lastColumn: 0,
            });
            expect(preventDefaultSpy).toHaveBeenCalled();
        });

        it('From Table, Press Shift+Up', () => {
            getDOMSelectionSpy.and.returnValue({
                type: 'table',
            });

            plugin.getState().tableSelection = {
                table,
                parsedTable: [
                    [td1, td2],
                    [td3, td4],
                ],
                firstCo: { row: 1, col: 0 },
                lastCo: { row: 1, col: 1 },
                startNode: td3,
            };

            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            getComputedStyleSpy.and.returnValue({});

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'ArrowUp',
                    shiftKey: true,
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: {
                    table,
                    parsedTable: [
                        [td1, td2],
                        [td3, td4],
                    ],
                    firstCo: { row: 1, col: 0 },
                    lastCo: { row: 0, col: 1 },
                    startNode: td3,
                },
                imageSelectionBorderColor: undefined,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'table',
                table,
                firstRow: 1,
                firstColumn: 0,
                lastRow: 0,
                lastColumn: 1,
            });
            expect(preventDefaultSpy).toHaveBeenCalled();
        });
    });
});

describe('SelectionPlugin on Safari', () => {
    let disposer: jasmine.Spy;
    let appendChildSpy: jasmine.Spy;
    let attachDomEvent: jasmine.Spy;
    let removeEventListenerSpy: jasmine.Spy;
    let addEventListenerSpy: jasmine.Spy;
    let getDocumentSpy: jasmine.Spy;
    let hasFocusSpy: jasmine.Spy;
    let isInShadowEditSpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;
    let editor: IEditor;
    let getSelectionSpy: jasmine.Spy;

    beforeEach(() => {
        disposer = jasmine.createSpy('disposer');
        appendChildSpy = jasmine.createSpy('appendChild');
        attachDomEvent = jasmine.createSpy('attachDomEvent').and.returnValue(disposer);
        removeEventListenerSpy = jasmine.createSpy('removeEventListener');
        addEventListenerSpy = jasmine.createSpy('addEventListener');
        getSelectionSpy = jasmine.createSpy('getSelection');
        getDocumentSpy = jasmine.createSpy('getDocument').and.returnValue({
            head: {
                appendChild: appendChildSpy,
            },
            addEventListener: addEventListenerSpy,
            removeEventListener: removeEventListenerSpy,
            getSelection: getSelectionSpy,
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
            imageSelectionBorderColor: undefined,
            tableSelection: null,
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
            imageSelectionBorderColor: undefined,
            tableSelection: null,
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
            range: <Partial<Range>>{
                collapsed: true,
            },
        } as any;

        hasFocusSpy.and.returnValue(true);
        isInShadowEditSpy.and.returnValue(false);
        getDOMSelectionSpy.and.returnValue(mockedNewSelection);

        onSelectionChange();

        expect(state).toEqual({
            selection: mockedNewSelection,
            imageSelectionBorderColor: undefined,
            tableSelection: null,
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
            imageSelectionBorderColor: undefined,
            tableSelection: null,
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
            imageSelectionBorderColor: undefined,
            tableSelection: null,
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
            imageSelectionBorderColor: undefined,
            tableSelection: null,
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
            imageSelectionBorderColor: undefined,
            tableSelection: null,
        });
        expect(getDOMSelectionSpy).toHaveBeenCalledTimes(0);
    });

    it('', () => {});
});

describe('SelectionPlugin selectionChange on image selected', () => {
    let disposer: jasmine.Spy;
    let appendChildSpy: jasmine.Spy;
    let attachDomEvent: jasmine.Spy;
    let removeEventListenerSpy: jasmine.Spy;
    let addEventListenerSpy: jasmine.Spy;
    let getDocumentSpy: jasmine.Spy;
    let hasFocusSpy: jasmine.Spy;
    let isInShadowEditSpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;
    let editor: IEditor;
    let setDOMSelectionSpy: jasmine.Spy;
    let getRangeAtSpy: jasmine.Spy;
    let getSelectionSpy: jasmine.Spy;

    beforeEach(() => {
        disposer = jasmine.createSpy('disposer');
        appendChildSpy = jasmine.createSpy('appendChild');
        attachDomEvent = jasmine.createSpy('attachDomEvent').and.returnValue(disposer);
        removeEventListenerSpy = jasmine.createSpy('removeEventListener');
        addEventListenerSpy = jasmine.createSpy('addEventListener');
        getRangeAtSpy = jasmine.createSpy('getRangeAt');
        getSelectionSpy = jasmine.createSpy('getSelection').and.returnValue({
            getRangeAt: getRangeAtSpy,
        });
        getDocumentSpy = jasmine.createSpy('getDocument').and.returnValue({
            head: {
                appendChild: appendChildSpy,
            },
            addEventListener: addEventListenerSpy,
            removeEventListener: removeEventListenerSpy,
            getSelection: getSelectionSpy,
        });
        hasFocusSpy = jasmine.createSpy('hasFocus');
        isInShadowEditSpy = jasmine.createSpy('isInShadowEdit');
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        setDOMSelectionSpy = jasmine.createSpy('setDOMSelection');

        editor = ({
            getDocument: getDocumentSpy,
            attachDomEvent,
            getEnvironment: () => ({
                isSafari: true,
            }),
            hasFocus: hasFocusSpy,
            isInShadowEdit: isInShadowEditSpy,
            getDOMSelection: getDOMSelectionSpy,
            setDOMSelection: setDOMSelectionSpy,
        } as any) as IEditor;
    });

    it('onSelectionChange on image | 1', () => {
        spyOn(isSingleImageInSelection, 'isSingleImageInSelection').and.returnValue(null);
        const plugin = createSelectionPlugin({});
        const state = plugin.getState();
        const mockedOldSelection = {
            type: 'image',
            image: {} as any,
        } as DOMSelection;

        state.selection = mockedOldSelection;

        plugin.initialize(editor);

        const onSelectionChange = addEventListenerSpy.calls.argsFor(0)[1] as Function;
        const mockedNewSelection = {
            type: 'image',
            image: {} as any,
        } as any;

        hasFocusSpy.and.returnValue(true);
        isInShadowEditSpy.and.returnValue(false);
        getDOMSelectionSpy.and.returnValue(mockedNewSelection);
        getRangeAtSpy.and.returnValue({ startContainer: {} });

        onSelectionChange();

        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'range',
            range: { startContainer: {} } as Range,
            isReverted: false,
        });
        expect(getDOMSelectionSpy).toHaveBeenCalledTimes(1);
    });

    it('onSelectionChange on image | 2', () => {
        const image = document.createElement('img');
        spyOn(isSingleImageInSelection, 'isSingleImageInSelection').and.returnValue(image);

        const plugin = createSelectionPlugin({});
        const state = plugin.getState();
        const mockedOldSelection = {
            type: 'image',
            image: {} as any,
        } as DOMSelection;

        state.selection = mockedOldSelection;

        plugin.initialize(editor);

        const onSelectionChange = addEventListenerSpy.calls.argsFor(0)[1] as Function;
        const mockedNewSelection = {
            type: 'image',
            image: {} as any,
        } as any;

        hasFocusSpy.and.returnValue(true);
        isInShadowEditSpy.and.returnValue(false);
        getDOMSelectionSpy.and.returnValue(mockedNewSelection);
        getRangeAtSpy.and.returnValue({ startContainer: {} });

        onSelectionChange();

        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
        expect(getDOMSelectionSpy).toHaveBeenCalledTimes(1);
    });

    it('onSelectionChange on image | 3', () => {
        spyOn(isSingleImageInSelection, 'isSingleImageInSelection').and.returnValue(null);

        const plugin = createSelectionPlugin({});
        const state = plugin.getState();
        const mockedOldSelection = {
            type: 'image',
            image: {} as any,
        } as DOMSelection;

        state.selection = mockedOldSelection;

        plugin.initialize(editor);

        const onSelectionChange = addEventListenerSpy.calls.argsFor(0)[1] as Function;
        const mockedNewSelection = {
            type: 'range',
            range: {} as any,
        } as any;

        hasFocusSpy.and.returnValue(true);
        isInShadowEditSpy.and.returnValue(false);
        getDOMSelectionSpy.and.returnValue(mockedNewSelection);
        getRangeAtSpy.and.returnValue({ startContainer: {} });

        onSelectionChange();

        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
        expect(getDOMSelectionSpy).toHaveBeenCalledTimes(1);
    });

    it('onSelectionChange on image | 4', () => {
        const image = document.createElement('img');
        spyOn(isSingleImageInSelection, 'isSingleImageInSelection').and.returnValue(image);

        const plugin = createSelectionPlugin({});
        const state = plugin.getState();
        const mockedOldSelection = {
            type: 'image',
            image: {} as any,
        } as DOMSelection;

        state.selection = mockedOldSelection;

        plugin.initialize(editor);

        const onSelectionChange = addEventListenerSpy.calls.argsFor(0)[1] as Function;
        const mockedNewSelection = {
            type: 'range',
            range: {} as any,
        } as any;

        hasFocusSpy.and.returnValue(true);
        isInShadowEditSpy.and.returnValue(false);
        getDOMSelectionSpy.and.returnValue(mockedNewSelection);
        getRangeAtSpy.and.returnValue({ startContainer: {} });

        onSelectionChange();

        expect(setDOMSelectionSpy).toHaveBeenCalled();
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'image',
            image,
        });
        expect(getDOMSelectionSpy).toHaveBeenCalledTimes(1);
    });
});
