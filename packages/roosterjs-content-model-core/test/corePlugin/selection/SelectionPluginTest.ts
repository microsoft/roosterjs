import * as findTableCellElement from '../../../lib/coreApi/setDOMSelection/findTableCellElement';
import * as getDOMInsertPointRectFile from 'roosterjs-content-model-dom/lib/domUtils/selection/getDOMInsertPointRect';
import * as getNodePositionFromEventFile from 'roosterjs-content-model-dom/lib/domUtils/event/getNodePositionFromEvent';
import * as isSingleImageInSelection from '../../../lib/corePlugin/selection/isSingleImageInSelection';
import * as parseTableCells from 'roosterjs-content-model-dom/lib/domUtils/table/parseTableCells';
import { createDOMHelper } from '../../../lib/editor/core/DOMHelperImpl';
import { getDOMSelection } from '../../../lib/coreApi/getDOMSelection/getDOMSelection';
import {
    createSelectionPlugin,
    DEFAULT_SELECTION_BORDER_COLOR,
    DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
} from '../../../lib/corePlugin/selection/SelectionPlugin';
import {
    DOMEventRecord,
    DOMSelection,
    EditorPlugin,
    IEditor,
    PluginWithState,
    SelectionPluginState,
} from 'roosterjs-content-model-types';

const DEFAULT_DARK_COLOR_SUFFIX_COLOR = 'DarkColorMock-';

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
            getColorManager: () => ({
                getDarkColor: (color: string) => `${DEFAULT_DARK_COLOR_SUFFIX_COLOR}${color}`,
            }),
        } as any) as IEditor;

        plugin.initialize(editor);

        expect(state).toEqual({
            selection: null,
            imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
            imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
            tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
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
            tableCellSelectionBackgroundColor: 'blue',
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
            getColorManager: () => ({
                getDarkColor: (color: string) => `${DEFAULT_DARK_COLOR_SUFFIX_COLOR}${color}`,
            }),
        }));

        expect(state).toEqual({
            selection: null,
            imageSelectionBorderColor: 'red',
            tableCellSelectionBackgroundColor: 'blue',
            imageSelectionBorderColorDark: `${DEFAULT_DARK_COLOR_SUFFIX_COLOR}red`,
            tableCellSelectionBackgroundColorDark: `${DEFAULT_DARK_COLOR_SUFFIX_COLOR}blue`,
            tableSelection: null,
        });

        expect(attachDomEvent).toHaveBeenCalled();

        plugin.dispose();
    });

    it('init with different options - transparent colors', () => {
        const plugin = createSelectionPlugin({
            imageSelectionBorderColor: 'transparent',
            tableCellSelectionBackgroundColor: 'transparent',
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
            getColorManager: () => ({
                getDarkColor: (color: string) => `${DEFAULT_DARK_COLOR_SUFFIX_COLOR}${color}`,
            }),
        }));

        expect(state).toEqual({
            selection: null,
            imageSelectionBorderColor: 'transparent',
            tableCellSelectionBackgroundColor: 'transparent',
            imageSelectionBorderColorDark: `${DEFAULT_DARK_COLOR_SUFFIX_COLOR}transparent`,
            tableCellSelectionBackgroundColorDark: `${DEFAULT_DARK_COLOR_SUFFIX_COLOR}transparent`,
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
            getColorManager: () => ({
                getDarkColor: (color: string) => `${DEFAULT_DARK_COLOR_SUFFIX_COLOR}${color}`,
            }),
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
            imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
            imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
            tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
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
            imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
            imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
            tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
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
            getColorManager: () => ({
                getDarkColor: (color: string) => `${DEFAULT_DARK_COLOR_SUFFIX_COLOR}${color}`,
            }),
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
    let findClosestElementAncestor: jasmine.Spy;

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
        findClosestElementAncestor = jasmine.createSpy('findClosestElementAncestor');
        domHelperSpy = jasmine.createSpy('domHelperSpy').and.returnValue({
            findClosestElementAncestor: findClosestElementAncestor,
        });

        editor = {
            getDOMHelper: domHelperSpy,
            getDOMSelection: getDOMSelectionSpy,
            setDOMSelection: setDOMSelectionSpy,
            getDocument: getDocumentSpy,
            getEnvironment: () => ({}),
            attachDomEvent: (map: Record<string, any>) => {
                return jasmine.createSpy('disposer');
            },
            getColorManager: () => ({
                getDarkColor: (color: string) => `${DEFAULT_DARK_COLOR_SUFFIX_COLOR}${color}`,
            }),
            isExperimentalFeatureEnabled: () => {
                return false;
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
                button: 0,
            } as any,
        });

        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith(null);
    });

    it('Image selection, mouse down with right click to div', () => {
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
                button: 2,
            } as any,
        });

        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith(null);
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
                button: 0,
            } as any,
        });

        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith(null);
    });

    it('Image selection, mouse down to a image', () => {
        const mockedImage = {
            parentNode: { childNodes: [] },
            isContentEditable: true,
            nodeType: 1,
            tagName: 'IMG',
            dispatchEvent: jasmine.createSpy('dispatchEvent'),
        } as any;
        getDOMSelectionSpy.and.returnValue(null);

        plugin.onPluginEvent!({
            eventType: 'mouseDown',
            rawEvent: {
                target: mockedImage,
                button: 0,
            } as any,
        });

        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'image',
            image: mockedImage,
        });
    });

    it('Image selection, mouse down to same image', () => {
        const mockedImage = {
            parentNode: { childNodes: [] },
            isContentEditable: true,
            nodeType: 1,
            tagName: 'IMG',
            dispatchEvent: jasmine.createSpy('dispatchEvent'),
        } as any;
        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: mockedImage,
        });

        plugin.onPluginEvent!({
            eventType: 'mouseDown',
            rawEvent: {
                target: mockedImage,
                button: 0,
            } as any,
        });

        expect(setDOMSelectionSpy).toHaveBeenCalledTimes(2);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith(null);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'image',
            image: mockedImage,
        });
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
            shiftKey: false,
        } as any;

        const mockedImage = {
            parentNode: { childNodes: [] },
            ownerDocument: {
                createRange: () => {
                    return {
                        selectNode: (node: any) => {},
                    };
                },
            },
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
        expect(setDOMSelectionSpy).toHaveBeenCalled();
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
    let announceSpy: jasmine.Spy;
    let createTreeWalkerSpy: jasmine.Spy;

    beforeEach(() => {
        contentDiv = document.createElement('div');
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        setDOMSelectionSpy = jasmine.createSpy('setDOMSelection');
        createRangeSpy = jasmine.createSpy('createRange');
        requestAnimationFrameSpy = jasmine.createSpy('requestAnimationFrame');
        getComputedStyleSpy = jasmine.createSpy('getComputedStyle');
        addEventListenerSpy = jasmine.createSpy('addEventListener');
        announceSpy = jasmine.createSpy('announce');
        createTreeWalkerSpy = jasmine
            .createSpy('createTreeWalker')
            .and.callFake((root: Node, whatToShow?: number) =>
                document.createTreeWalker(root, whatToShow)
            );
        getDocumentSpy = jasmine.createSpy('getDocument').and.returnValue({
            createRange: createRangeSpy,
            createTreeWalker: createTreeWalkerSpy,
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
            getColorManager: () => ({
                getDarkColor: (color: string) => `${DEFAULT_DARK_COLOR_SUFFIX_COLOR}${color}`,
            }),
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
            announce: announceSpy,
            isExperimentalFeatureEnabled: () => {
                return false;
            },
            getSnapshotsManager: () => {
                return { hasNewContent: false };
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
            imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
            imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
            tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
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
            imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
            imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
            tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
        });
        expect(mouseDispatcher).toBeUndefined();
    });

    it('MouseDown - save a table selection when left click', () => {
        const state = plugin.getState();
        const table = document.createElement('table');
        table.setAttribute('contenteditable', 'true');
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
            imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
            imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
            tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
        });

        plugin.onPluginEvent!({
            eventType: 'mouseDown',
            rawEvent: {
                button: 0,
                target: td,
            } as any,
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
            imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
            imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
            tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
        });
        expect(mouseDispatcher).toBeDefined();
    });

    it('MouseDown - clean and re-attach mouse move event handler if mouseDown event triggered twice', () => {
        const state = plugin.getState();
        const table = document.createElement('table');
        table.setAttribute('contenteditable', 'true');
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        const div = document.createElement('div');

        tr.appendChild(td);
        table.appendChild(tr);
        contentDiv.appendChild(table);
        contentDiv.appendChild(div);

        spyOn(editor, 'attachDomEvent').and.callThrough();

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
            imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
            imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
            tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
        });

        plugin.onPluginEvent!({
            eventType: 'mouseDown',
            rawEvent: {
                button: 0,
                target: td,
            } as any,
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
            imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
            imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
            tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
        });
        expect(mouseDispatcher).toBeDefined();
        expect(mouseMoveDisposer).toHaveBeenCalledTimes(1);
        expect(editor.attachDomEvent).toHaveBeenCalledTimes(2);
    });

    it('MouseDown - do not save a table selection when left click, table is not editable', () => {
        const state = plugin.getState();
        const table = document.createElement('table');
        table.setAttribute('contenteditable', 'false');
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
            imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
            imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
            tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
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
            tableSelection: null,
            imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
            imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
            tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
        });
        expect(mouseDispatcher).toBeUndefined();
    });

    it('MouseDown - triple click', () => {
        const state = plugin.getState();
        const table = document.createElement('table');
        table.setAttribute('contenteditable', 'true');
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
            imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
            imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
            tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
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
            tableSelectionInfo: jasmine.any(Object),
        });
    });

    it('MouseMove - in same table', () => {
        const state = plugin.getState();
        const table = document.createElement('table');
        table.setAttribute('contenteditable', 'true');
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
            tableSelectionInfo: jasmine.any(Object),
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
            tableSelectionInfo: jasmine.any(Object),
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
        table1.setAttribute('contenteditable', 'true');
        table2.setAttribute('contenteditable', 'true');
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
            tableSelectionInfo: jasmine.any(Object),
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
            tableSelectionInfo: jasmine.any(Object),
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
        let td1_text: Node;
        let td2_text: Node;
        let td3_text: Node;
        let td4_text: Node;
        let table: HTMLTableElement;
        let div: HTMLElement;

        beforeEach(() => {
            table = document.createElement('table');
            table.setAttribute('contenteditable', 'true');
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

            // Craete text nodes
            td1_text = document.createTextNode('1');
            td2_text = document.createTextNode('2');
            td3_text = document.createTextNode('3');
            td4_text = document.createTextNode('4');

            // Add Text to each cell
            td1.appendChild(td1_text);
            td2.appendChild(td2_text);
            td3.appendChild(td3_text);
            td4.appendChild(td4_text);

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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
                tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            });
            expect(setDOMSelectionSpy).not.toHaveBeenCalled();
            expect(announceSpy).not.toHaveBeenCalled();
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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
                tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(0);
            expect(announceSpy).not.toHaveBeenCalled();
        });

        it('From Range, Press Tab', () => {
            let time = 0;
            getDOMSelectionSpy.and.callFake(() => {
                time++;

                return time == 1
                    ? {
                          type: 'range',
                          range: {
                              startContainer: td1,
                              startOffset: 0,
                              endContainer: td1,
                              endOffset: 0,
                              commonAncestorContainer: tr1,
                          },
                          isReverted: false,
                      }
                    : {
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
                      };
            });

            const setStartSpy = jasmine.createSpy('setStart');
            const setEndSpy = jasmine.createSpy('setEnd');
            const collapseSpy = jasmine.createSpy('collapse');
            const preventDefaultSpy = jasmine.createSpy('preventDefault');
            const mockedRange = {
                setStart: setStartSpy,
                setEnd: setEndSpy,
                collapse: collapseSpy,
            } as any;

            createRangeSpy.and.returnValue(mockedRange);

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Tab',
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: null,
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
                tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
            expect(setStartSpy).toHaveBeenCalledWith(td2_text, 0);
            expect(setEndSpy).toHaveBeenCalledWith(td2_text, 0);
            expect(collapseSpy).not.toHaveBeenCalled();
            expect(announceSpy).not.toHaveBeenCalled();
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            expect(time).toBe(2);
        });

        it('From Range, Press Shift+Tab', () => {
            let time = 0;
            getDOMSelectionSpy.and.callFake(() => {
                time++;

                return time == 1
                    ? {
                          type: 'range',
                          range: {
                              startContainer: td2,
                              startOffset: 0,
                              endContainer: td2,
                              endOffset: 0,
                              commonAncestorContainer: tr1,
                          },
                          isReverted: false,
                      }
                    : {
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
                      };
            });

            const setStartSpy = jasmine.createSpy('setStart');
            const setEndSpy = jasmine.createSpy('setEnd');
            const collapseSpy = jasmine.createSpy('collapse');
            const preventDefaultSpy = jasmine.createSpy('preventDefault');
            const mockedRange = {
                setStart: setStartSpy,
                setEnd: setEndSpy,
                collapse: collapseSpy,
            } as any;

            createRangeSpy.and.returnValue(mockedRange);

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Tab',
                    shiftKey: true,
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: null,
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
                tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
            expect(setStartSpy).toHaveBeenCalledWith(td1_text, 0);
            expect(setEndSpy).toHaveBeenCalledWith(td1_text, 0);
            expect(collapseSpy).not.toHaveBeenCalled();
            expect(announceSpy).not.toHaveBeenCalled();
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            expect(time).toBe(2);
        });

        it('From Range, Press Tab - Next Row', () => {
            let time = 0;
            getDOMSelectionSpy.and.callFake(() => {
                time++;

                return time == 1
                    ? {
                          type: 'range',
                          range: {
                              startContainer: td2,
                              startOffset: 0,
                              endContainer: td2,
                              endOffset: 0,
                              commonAncestorContainer: tr1,
                          },
                          isReverted: false,
                      }
                    : {
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
                      };
            });

            const setStartSpy = jasmine.createSpy('setStart');
            const setEndSpy = jasmine.createSpy('setEnd');
            const collapseSpy = jasmine.createSpy('collapse');
            const preventDefaultSpy = jasmine.createSpy('preventDefault');
            const mockedRange = {
                setStart: setStartSpy,
                setEnd: setEndSpy,
                collapse: collapseSpy,
            } as any;

            createRangeSpy.and.returnValue(mockedRange);

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Tab',
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: null,
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
                tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
            expect(setStartSpy).toHaveBeenCalledWith(td3_text, 0);
            expect(setEndSpy).toHaveBeenCalledWith(td3_text, 0);
            expect(collapseSpy).not.toHaveBeenCalled();
            expect(announceSpy).not.toHaveBeenCalled();
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            expect(time).toBe(2);
        });

        it('From Range, First cell - Press Shift+Tab', () => {
            let time = 0;

            getDOMSelectionSpy.and.callFake(() => {
                time++;

                td1.appendChild(document.createTextNode('1'));
                return time == 1
                    ? {
                          type: 'range',
                          range: {
                              startContainer: td1,
                              startOffset: 0,
                              endContainer: td1,
                              endOffset: 0,
                              commonAncestorContainer: tr1,
                          },
                          isReverted: false,
                      }
                    : {
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
                      };
            });

            const setStartSpy = jasmine.createSpy('setStart');
            const collapseSpy = jasmine.createSpy('collapse');
            const preventDefaultSpy = jasmine.createSpy('preventDefault');
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
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: null,
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
                tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
            expect(setStartSpy).toHaveBeenCalledWith(table.parentNode, 0);
            expect(announceSpy).not.toHaveBeenCalled();
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            expect(time).toBe(2);
        });

        it('From Range, Last cell - Press Tab', () => {
            let time = 0;

            getDOMSelectionSpy.and.callFake(() => {
                time++;

                return time == 1
                    ? {
                          type: 'range',
                          range: {
                              startContainer: td4,
                              startOffset: 0,
                              endContainer: td4,
                              endOffset: 0,
                              commonAncestorContainer: tr2,
                          },
                          isReverted: false,
                      }
                    : {
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
                      };
            });

            const setStartSpy = jasmine.createSpy('setStart');
            const collapseSpy = jasmine.createSpy('collapse');
            const preventDefaultSpy = jasmine.createSpy('preventDefault');
            const mockedRange = {
                setStart: setStartSpy,
                collapse: collapseSpy,
            } as any;

            createRangeSpy.and.returnValue(mockedRange);

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Tab',
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: null,
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
                tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
            expect(setStartSpy).toHaveBeenCalledWith(table.parentNode, 1);
            expect(announceSpy).not.toHaveBeenCalled();
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            expect(time).toBe(2);
        });

        it('From Range, Press Tab - take undo snapshot when hasNewContent', () => {
            let time = 0;
            getDOMSelectionSpy.and.callFake(() => {
                time++;

                return time == 1
                    ? {
                          type: 'range',
                          range: {
                              startContainer: td1,
                              startOffset: 0,
                              endContainer: td1,
                              endOffset: 0,
                              commonAncestorContainer: tr1,
                          },
                          isReverted: false,
                      }
                    : {
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
                      };
            });

            const setStartSpy = jasmine.createSpy('setStart');
            const setEndSpy = jasmine.createSpy('setEnd');
            const collapseSpy = jasmine.createSpy('collapse');
            const preventDefaultSpy = jasmine.createSpy('preventDefault');
            const mockedRange = {
                setStart: setStartSpy,
                setEnd: setEndSpy,
                collapse: collapseSpy,
            } as any;
            const takeSnapshotSpy = jasmine.createSpy('takeSnapshot');
            const getSnapshotsManagerSpy = jasmine
                .createSpy('getSnapshotsManager')
                .and.returnValue({
                    hasNewContent: true,
                });

            (editor as any).getSnapshotsManager = getSnapshotsManagerSpy;
            (editor as any).takeSnapshot = takeSnapshotSpy;

            createRangeSpy.and.returnValue(mockedRange);

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Tab',
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(1);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
        });

        it('From Range, Press Tab - do not take undo snapshot when no new content', () => {
            let time = 0;
            getDOMSelectionSpy.and.callFake(() => {
                time++;

                return time == 1
                    ? {
                          type: 'range',
                          range: {
                              startContainer: td1,
                              startOffset: 0,
                              endContainer: td1,
                              endOffset: 0,
                              commonAncestorContainer: tr1,
                          },
                          isReverted: false,
                      }
                    : {
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
                      };
            });

            const setStartSpy = jasmine.createSpy('setStart');
            const setEndSpy = jasmine.createSpy('setEnd');
            const collapseSpy = jasmine.createSpy('collapse');
            const preventDefaultSpy = jasmine.createSpy('preventDefault');
            const mockedRange = {
                setStart: setStartSpy,
                setEnd: setEndSpy,
                collapse: collapseSpy,
            } as any;
            const takeSnapshotSpy = jasmine.createSpy('takeSnapshot');
            const getSnapshotsManagerSpy = jasmine
                .createSpy('getSnapshotsManager')
                .and.returnValue({
                    hasNewContent: false,
                });

            (editor as any).getSnapshotsManager = getSnapshotsManagerSpy;
            (editor as any).takeSnapshot = takeSnapshotSpy;

            createRangeSpy.and.returnValue(mockedRange);

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Tab',
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(takeSnapshotSpy).not.toHaveBeenCalled();
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
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
            const setEndSpy = jasmine.createSpy('setEnd');
            const collapseSpy = jasmine.createSpy('collapse');
            const getBoundingClientRectSpy = jasmine
                .createSpy('getBoundingClientRect')
                .and.returnValue({ left: 10, right: 20, top: 10, bottom: 20 });
            const mockedRange = {
                setStart: setStartSpy,
                setEnd: setEndSpy,
                collapse: collapseSpy,
                getBoundingClientRect: getBoundingClientRectSpy,
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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
                tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
            expect(setStartSpy).toHaveBeenCalledWith(td4_text, 0);
            expect(announceSpy).toHaveBeenCalledWith({
                defaultStrings: 'announceOnFocusLastCell',
            });
        });

        it('From Range, Press Down - preserves cursor horizontal position', () => {
            // Setup: cursor is at position in td2, moving down to td4
            // The test verifies that the position returned by getNodePositionFromEvent is used for setStart

            // Mock getDOMInsertPointRect to return a cursor rect so getNodePositionFromEvent gets called
            spyOn(getDOMInsertPointRectFile, 'getDOMInsertPointRect').and.returnValue({
                left: 50,
                right: 60,
                top: 10,
                bottom: 20,
            });

            // Mock getNodePositionFromEvent to return a specific position
            const targetNode = td4_text;
            const targetOffset = 1;
            spyOn(getNodePositionFromEventFile, 'getNodePositionFromEvent').and.returnValue({
                node: targetNode,
                offset: targetOffset,
            });

            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: {
                    startContainer: td2_text,
                    startOffset: 1,
                    endContainer: td2_text,
                    endOffset: 1,
                    commonAncestorContainer: tr1,
                    collapsed: true,
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
            const setEndSpy = jasmine.createSpy('setEnd');
            const collapseSpy = jasmine.createSpy('collapse');
            const getBoundingClientRectSpy = jasmine
                .createSpy('getBoundingClientRect')
                .and.returnValue({ left: 50, right: 60, top: 10, bottom: 20 });
            const mockedRange = {
                setStart: setStartSpy,
                setEnd: setEndSpy,
                collapse: collapseSpy,
                getBoundingClientRect: getBoundingClientRectSpy,
                startContainer: td2_text,
                startOffset: 1,
            } as any;

            createRangeSpy.and.returnValue(mockedRange);

            // Mock td4's getBoundingClientRect to return cell position
            spyOn(td4, 'getBoundingClientRect').and.returnValue({
                left: 40,
                right: 100,
                top: 30,
                bottom: 50,
            } as DOMRect);

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'ArrowDown',
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            // Verify that setStart is called with the position returned by getNodePositionFromEvent
            expect(setStartSpy).toHaveBeenCalledWith(targetNode, targetOffset);
        });

        it('From Range, Press Up - preserves cursor horizontal position', () => {
            // Setup: cursor is at position in td4, moving up to td2

            // Mock getDOMInsertPointRect to return a cursor rect so getNodePositionFromEvent gets called
            spyOn(getDOMInsertPointRectFile, 'getDOMInsertPointRect').and.returnValue({
                left: 50,
                right: 60,
                top: 30,
                bottom: 40,
            });

            // Mock getNodePositionFromEvent to return a specific position
            const targetNode = td2_text;
            const targetOffset = 1;
            spyOn(getNodePositionFromEventFile, 'getNodePositionFromEvent').and.returnValue({
                node: targetNode,
                offset: targetOffset,
            });

            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: {
                    startContainer: td4_text,
                    startOffset: 1,
                    endContainer: td4_text,
                    endOffset: 1,
                    commonAncestorContainer: tr2,
                    collapsed: true,
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
            const setEndSpy = jasmine.createSpy('setEnd');
            const collapseSpy = jasmine.createSpy('collapse');
            const getBoundingClientRectSpy = jasmine
                .createSpy('getBoundingClientRect')
                .and.returnValue({ left: 50, right: 60, top: 30, bottom: 40 });
            const mockedRange = {
                setStart: setStartSpy,
                setEnd: setEndSpy,
                collapse: collapseSpy,
                getBoundingClientRect: getBoundingClientRectSpy,
                startContainer: td4_text,
                startOffset: 1,
            } as any;

            createRangeSpy.and.returnValue(mockedRange);

            // Mock td2's getBoundingClientRect
            spyOn(td2, 'getBoundingClientRect').and.returnValue({
                left: 40,
                right: 100,
                top: 5,
                bottom: 25,
            } as DOMRect);

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'ArrowUp',
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            // Verify that setStart is called with the position returned by getNodePositionFromEvent
            expect(setStartSpy).toHaveBeenCalledWith(targetNode, targetOffset);
        });

        it('From Range, Press Down - falls back to offset 0 when getNodePositionFromEvent returns null', () => {
            // When getNodePositionFromEvent returns null, fall back to offset 0

            // Mock getNodePositionFromEvent to return null
            const getNodePositionFromEventSpy = spyOn(
                getNodePositionFromEventFile,
                'getNodePositionFromEvent'
            ).and.returnValue(null);

            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: {
                    startContainer: td2_text,
                    startOffset: 1,
                    endContainer: td2_text,
                    endOffset: 1,
                    commonAncestorContainer: tr1,
                    collapsed: true,
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
            const setEndSpy = jasmine.createSpy('setEnd');
            const collapseSpy = jasmine.createSpy('collapse');
            const getBoundingClientRectSpy = jasmine
                .createSpy('getBoundingClientRect')
                .and.returnValue({ left: 50, right: 60, top: 10, bottom: 20 });
            const mockedRange = {
                setStart: setStartSpy,
                setEnd: setEndSpy,
                collapse: collapseSpy,
                getBoundingClientRect: getBoundingClientRectSpy,
            } as any;

            createRangeSpy.and.returnValue(mockedRange);

            // Mock td4's getBoundingClientRect to return cell position
            spyOn(td4, 'getBoundingClientRect').and.returnValue({
                left: 40,
                right: 100,
                top: 30,
                bottom: 50,
            } as DOMRect);

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'ArrowDown',
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(getNodePositionFromEventSpy).toHaveBeenCalled();
            // When getNodePositionFromEvent returns null, fall back to offset 0
            expect(setStartSpy).toHaveBeenCalledWith(td4_text, 0);
        });

        it('From Range, Press Left - does not use cursor position preservation', () => {
            // ArrowLeft should NOT use getNodePositionFromEvent, only ArrowUp/ArrowDown do

            // Spy on getNodePositionFromEvent to verify it's not called
            const getNodePositionFromEventSpy = spyOn(
                getNodePositionFromEventFile,
                'getNodePositionFromEvent'
            );

            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: {
                    startContainer: td2_text,
                    startOffset: 0,
                    endContainer: td2_text,
                    endOffset: 0,
                    commonAncestorContainer: tr1,
                    collapsed: true,
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

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'ArrowLeft',
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
            // For ArrowLeft within the same row, getNodePositionFromEvent should NOT be called
            expect(getNodePositionFromEventSpy).not.toHaveBeenCalled();
            // setDOMSelection is not called for ArrowLeft within same row - browser handles it
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(0);
        });

        it('From Range, Press Down in the last row and move focus outside of table.', () => {
            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: {
                    startContainer: td3,
                    startOffset: 0,
                    endContainer: td3,
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
            const setEndSpy = jasmine.createSpy('setEnd');
            const collapseSpy = jasmine.createSpy('collapse');
            const getBoundingClientRectSpy = jasmine
                .createSpy('getBoundingClientRect')
                .and.returnValue({ left: 10, right: 20, top: 10, bottom: 20 });
            const mockedRange = {
                setStart: setStartSpy,
                setEnd: setEndSpy,
                collapse: collapseSpy,
                getBoundingClientRect: getBoundingClientRectSpy,
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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
                tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
            expect(setStartSpy).toHaveBeenCalledWith(table.parentElement, 1);
        });

        it('From Range, Press Up in the first row and move focus outside of table, select before table as there are no elements before table.', () => {
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
            const setEndSpy = jasmine.createSpy('setEnd');
            const collapseSpy = jasmine.createSpy('collapse');
            const getBoundingClientRectSpy = jasmine
                .createSpy('getBoundingClientRect')
                .and.returnValue({ left: 10, right: 20, top: 10, bottom: 20 });
            const mockedRange = {
                setStart: setStartSpy,
                setEnd: setEndSpy,
                collapse: collapseSpy,
                getBoundingClientRect: getBoundingClientRectSpy,
            } as any;

            createRangeSpy.and.returnValue(mockedRange);

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'ArrowUp',
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: null,
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
                tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
            expect(setStartSpy).toHaveBeenCalledWith(table.parentElement, 0);
        });

        it('From Range, Press Up in the first row and move focus outside of table, select before table as there are no elements before table.', () => {
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
            const setEndSpy = jasmine.createSpy('setEnd');
            const collapseSpy = jasmine.createSpy('collapse');
            const selectNodeContentsSpy = jasmine.createSpy('selectNodeContents');
            const getBoundingClientRectSpy = jasmine
                .createSpy('getBoundingClientRect')
                .and.returnValue({ left: 10, right: 20, top: 10, bottom: 20 });

            const mockedRange = {
                setStart: setStartSpy,
                setEnd: setEndSpy,
                collapse: collapseSpy,
                selectNodeContents: selectNodeContentsSpy,
                getBoundingClientRect: getBoundingClientRectSpy,
            } as any;

            const div = document.createElement('div');
            table.parentElement?.insertBefore(div, table);
            createRangeSpy.and.returnValue(mockedRange);

            plugin.onPluginEvent!({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'ArrowUp',
                } as any,
            });

            expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
            expect(plugin.getState()).toEqual({
                selection: null,
                tableSelection: null,
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
                tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
            expect(setStartSpy).not.toHaveBeenCalledWith(table.parentElement, 0);
            expect(selectNodeContentsSpy).toHaveBeenCalledWith(div);
            expect(collapseSpy).toHaveBeenCalledWith(false);
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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
                tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'table',
                table,
                firstRow: 1,
                firstColumn: 1,
                lastRow: 0,
                lastColumn: 1,
                tableSelectionInfo: jasmine.any(Object),
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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
                tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'table',
                table,
                firstRow: 0,
                firstColumn: 1,
                lastRow: 1,
                lastColumn: 1,
                tableSelectionInfo: jasmine.any(Object),
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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
                tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(0);
            expect(announceSpy).not.toHaveBeenCalled();
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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
                tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            });
            expect(setDOMSelectionSpy).not.toHaveBeenCalled();
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            expect(announceSpy).not.toHaveBeenCalled();
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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
                tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith(null);
            expect(preventDefaultSpy).not.toHaveBeenCalled();
            expect(announceSpy).not.toHaveBeenCalled();
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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
                tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'table',
                table,
                firstRow: 0,
                firstColumn: 1,
                lastRow: 1,
                lastColumn: 0,
                tableSelectionInfo: jasmine.any(Object),
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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
                tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'table',
                table,
                firstRow: 1,
                firstColumn: 0,
                lastRow: 0,
                lastColumn: 1,
                tableSelectionInfo: jasmine.any(Object),
            });
            expect(preventDefaultSpy).toHaveBeenCalled();
        });

        it('From Table, Format, Press Shift+Left', () => {
            (getDOMSelectionSpy as jasmine.Spy<typeof getDOMSelection>).and.returnValue({
                type: 'table',
                firstColumn: 1,
                firstRow: 0,
                lastColumn: 1,
                lastRow: 1,
                table,
                tableSelectionInfo: {
                    table,
                    parsedTable: [
                        [td1, td2],
                        [td3, td4],
                    ],
                    startNode: td2,
                    firstCo: { row: 0, col: 1 },
                    lastCo: { row: 1, col: 1 },
                },
            });

            spyOn(parseTableCells, 'parseTableCells').and.returnValue([
                [td1, td2],
                [td3, td4],
            ]);
            spyOn(findTableCellElement, 'findTableCellElement').and.returnValue({
                cell: td2,
                row: 0,
                col: 1,
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
                eventType: 'contentChanged',
                source: 'Test',
            });

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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
                tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'table',
                table,
                firstRow: 0,
                firstColumn: 1,
                lastRow: 1,
                lastColumn: 0,
                tableSelectionInfo: jasmine.any(Object),
            });
            expect(preventDefaultSpy).toHaveBeenCalled();
        });

        it('From Table, Format, Press Shift+Up', () => {
            (getDOMSelectionSpy as jasmine.Spy<typeof getDOMSelection>).and.returnValue({
                type: 'table',
                firstColumn: 0,
                firstRow: 1,
                lastColumn: 1,
                lastRow: 1,
                table,
                tableSelectionInfo: {
                    table,
                    parsedTable: [
                        [td1, td2],
                        [td3, td4],
                    ],
                    startNode: td3,
                    firstCo: { row: 1, col: 0 },
                    lastCo: { row: 1, col: 1 },
                },
            });

            spyOn(parseTableCells, 'parseTableCells').and.returnValue([
                [td1, td2],
                [td3, td4],
            ]);
            spyOn(findTableCellElement, 'findTableCellElement').and.returnValue({
                cell: td3,
                row: 1,
                col: 0,
            } as any);

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
                eventType: 'contentChanged',
                source: 'Test',
            });

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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
                tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            });
            expect(setDOMSelectionSpy).toHaveBeenCalledTimes(1);
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'table',
                table,
                firstRow: 1,
                firstColumn: 0,
                lastRow: 0,
                lastColumn: 1,
                tableSelectionInfo: jasmine.any(Object),
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
            getColorManager: () => ({
                getDarkColor: (color: string) => `${DEFAULT_DARK_COLOR_SUFFIX_COLOR}${color}`,
            }),
            isExperimentalFeatureEnabled: () => {
                return false;
            },
        } as any) as IEditor;
    });

    it('init and dispose', () => {
        const plugin = createSelectionPlugin({});
        const state = plugin.getState();

        plugin.initialize(editor);

        expect(state).toEqual({
            selection: null,
            imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
            imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
            tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
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
            imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
            imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
            tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
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
            imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
            imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
            tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
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
            imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
            imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
            tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
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
            imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
            imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
            tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
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
            imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
            imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
            tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
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
            imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
            imageSelectionBorderColorDark: DEFAULT_SELECTION_BORDER_COLOR,
            tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            tableCellSelectionBackgroundColorDark: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
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
            focusNode: {
                nodeName: 'SPAN',
            },
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
            isReverted: true,
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

        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'image',
            image,
        });
        expect(getDOMSelectionSpy).toHaveBeenCalledTimes(1);
    });
});

describe('SelectionPlugin handle logical root change', () => {
    let plugin: PluginWithState<SelectionPluginState>;
    let disposer: jasmine.Spy;
    let logicalRootDisposer: jasmine.Spy;
    let attachDomEvent: jasmine.Spy;
    let removeEventListenerSpy: jasmine.Spy;
    let addEventListenerSpy: jasmine.Spy;
    let getDocumentSpy: jasmine.Spy;
    let editor: IEditor;

    beforeEach(() => {
        plugin = createSelectionPlugin({});
        disposer = jasmine.createSpy('disposer');
        logicalRootDisposer = jasmine.createSpy('logicalRootDisposer');
        attachDomEvent = jasmine.createSpy('attachDomEvent').and.returnValue(disposer);
        removeEventListenerSpy = jasmine.createSpy('removeEventListener');
        addEventListenerSpy = jasmine.createSpy('addEventListener');
        getDocumentSpy = jasmine.createSpy('getDocument').and.returnValue({
            removeEventListener: removeEventListenerSpy,
            addEventListener: addEventListenerSpy,
        });
    });

    it('handles logical root change - non Safari', () => {
        // Setup
        editor = ({
            getDocument: getDocumentSpy,
            attachDomEvent,
            getEnvironment: () => ({
                isSafari: false,
            }),
            getColorManager: () => ({
                getDarkColor: (color: string) => `${DEFAULT_DARK_COLOR_SUFFIX_COLOR}${color}`,
            }),
        } as any) as IEditor;

        plugin.initialize(editor);

        // Reset the spy calls before the logicalRootChanged event
        attachDomEvent.calls.reset();
        attachDomEvent.and.returnValue(logicalRootDisposer);

        // Trigger logicalRootChanged event
        plugin.onPluginEvent?.({
            eventType: 'logicalRootChanged',
            logicalRoot: document.createElement('div'), // Mock logical root element
        });

        // Verify that attachDomEvent was called for logical root with correct events
        expect(attachDomEvent).toHaveBeenCalledTimes(1);
        expect(attachDomEvent).toHaveBeenCalledWith({
            focus: { beforeDispatch: jasmine.any(Function) },
            blur: { beforeDispatch: jasmine.any(Function) },
            drop: { beforeDispatch: jasmine.any(Function) },
        });

        // Dispose should clean up all event listeners including logicalRoot disposers
        plugin.dispose();
        expect(logicalRootDisposer).toHaveBeenCalled();
        expect(disposer).toHaveBeenCalled();
        expect(removeEventListenerSpy).toHaveBeenCalled();
    });

    it('handles logical root change - Safari', () => {
        // Setup
        editor = ({
            getDocument: getDocumentSpy,
            attachDomEvent,
            getEnvironment: () => ({
                isSafari: true,
            }),
            getColorManager: () => ({
                getDarkColor: (color: string) => `${DEFAULT_DARK_COLOR_SUFFIX_COLOR}${color}`,
            }),
        } as any) as IEditor;

        plugin.initialize(editor);

        // Reset the spy calls before the logicalRootChanged event
        attachDomEvent.calls.reset();
        attachDomEvent.and.returnValue(logicalRootDisposer);

        // Trigger logicalRootChanged event
        plugin.onPluginEvent?.({
            eventType: 'logicalRootChanged',
            logicalRoot: document.createElement('div'), // Mock logical root element
        });

        // Verify that attachDomEvent was called for logical root with correct events
        expect(attachDomEvent).toHaveBeenCalledTimes(1);
        expect(attachDomEvent).toHaveBeenCalledWith({
            focus: { beforeDispatch: jasmine.any(Function) },
            drop: { beforeDispatch: jasmine.any(Function) },
        });

        // Dispose should clean up all event listeners including logicalRoot disposers
        plugin.dispose();
        expect(logicalRootDisposer).toHaveBeenCalled();
        expect(disposer).toHaveBeenCalled();
        expect(removeEventListenerSpy).toHaveBeenCalled();
    });

    it('calls previous logical root disposer when logicalRootChanged is triggered again', () => {
        // Setup
        editor = ({
            getDocument: getDocumentSpy,
            attachDomEvent,
            getEnvironment: () => ({
                isSafari: false,
            }),
            getColorManager: () => ({
                getDarkColor: (color: string) => `${DEFAULT_DARK_COLOR_SUFFIX_COLOR}${color}`,
            }),
        } as any) as IEditor;

        plugin.initialize(editor);

        // First logical root change
        attachDomEvent.calls.reset();
        attachDomEvent.and.returnValue(logicalRootDisposer);
        plugin.onPluginEvent?.({
            eventType: 'logicalRootChanged',
            logicalRoot: document.createElement('div'), // Mock logical root element
        });

        // Second logical root change
        const newLogicalRootDisposer = jasmine.createSpy('newLogicalRootDisposer');
        attachDomEvent.and.returnValue(newLogicalRootDisposer);
        plugin.onPluginEvent?.({
            eventType: 'logicalRootChanged',
            logicalRoot: document.createElement('div'), // Mock logical root element
        });

        // Verify that the old logical root disposer was called
        expect(logicalRootDisposer).toHaveBeenCalled();

        // Dispose should clean up all event listeners including the new logicalRoot disposer
        plugin.dispose();
        expect(newLogicalRootDisposer).toHaveBeenCalled();
        expect(disposer).toHaveBeenCalled();
    });
});
