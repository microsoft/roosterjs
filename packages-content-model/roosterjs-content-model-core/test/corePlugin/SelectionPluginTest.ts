import { createSelectionPlugin } from '../../lib/corePlugin/SelectionPlugin';
import { EditorPlugin, IEditor, PluginEventType, PluginWithState } from 'roosterjs-editor-types';
import { IStandaloneEditor, SelectionPluginState } from 'roosterjs-content-model-types';

const MockedStyleNode = 'STYLENODE' as any;

describe('SelectionPlugin', () => {
    it('init and dispose', () => {
        const plugin = createSelectionPlugin({});
        const disposer = jasmine.createSpy('disposer');
        const createElementSpy = jasmine
            .createSpy('createElement')
            .and.returnValue(MockedStyleNode);
        const appendChildSpy = jasmine.createSpy('appendChild');
        const addDomEventHandler = jasmine
            .createSpy('addDomEventHandler')
            .and.returnValue(disposer);
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
            addDomEventHandler,
            getEnvironment: () => ({}),
        } as any) as IStandaloneEditor & IEditor;

        plugin.initialize(editor);

        expect(state).toEqual({
            selection: null,
            selectionStyleNode: MockedStyleNode,
            imageSelectionBorderColor: undefined,
        });
        expect(addDomEventHandler).toHaveBeenCalled();
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

        const addDomEventHandler = jasmine
            .createSpy('addDomEventHandler')
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
            addDomEventHandler,
            getEnvironment: () => ({}),
        }));

        expect(state).toEqual({
            selection: null,
            selectionStyleNode: MockedStyleNode,
            imageSelectionBorderColor: 'red',
        });

        expect(addDomEventHandler).toHaveBeenCalled();

        plugin.dispose();
    });
});

describe('SelectionPlugin handle onFocus and onBlur event', () => {
    let plugin: PluginWithState<SelectionPluginState>;
    let triggerPluginEvent: jasmine.Spy;
    let eventMap: Record<string, any>;
    let getElementAtCursorSpy: jasmine.Spy;
    let createElementSpy: jasmine.Spy;
    let getDocumentSpy: jasmine.Spy;
    let appendChildSpy: jasmine.Spy;
    let setDOMSelectionSpy: jasmine.Spy;
    let removeEventListenerSpy: jasmine.Spy;

    let editor: IEditor;

    beforeEach(() => {
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
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
            triggerPluginEvent,
            getEnvironment: () => ({}),
            addDomEventHandler: (map: Record<string, any>) => {
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

        eventMap.focus();
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

        eventMap.focus();
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

    beforeEach(() => {
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        setDOMSelectionSpy = jasmine.createSpy('setDOMSelection');
        createElementSpy = jasmine.createSpy('createElement').and.returnValue(MockedStyleNode);
        getDocumentSpy = jasmine.createSpy('getDocument').and.returnValue({
            createElement: createElementSpy,
            head: {
                appendChild: () => {},
            },
        });

        editor = {
            getDOMSelection: getDOMSelectionSpy,
            setDOMSelection: setDOMSelectionSpy,
            getDocument: getDocumentSpy,
            getEnvironment: () => ({}),
            addDomEventHandler: (map: Record<string, any>) => {
                return jasmine.createSpy('disposer');
            },
        } as any;
        plugin = createSelectionPlugin({});
        plugin.initialize(editor);
    });

    it('No selection, mouse down to image', () => {
        const node = document.createElement('div');
        plugin.onPluginEvent({
            eventType: PluginEventType.MouseDown,
            rawEvent: {
                target: node,
            } as any,
        });

        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
    });
});

// describe('SelectionPlugin select image', () => {
//     let editor: IEditor;
//     let id = 'imageSelectionContainerId';
//     let imageId = 'imageSelectionId';
//     let imageId2 = 'imageSelectionId2';
//     let imageSelection: ImageSelection;
//     let editorIsFeatureEnabled: any;

//     beforeEach(() => {
//         let node = document.createElement('div');
//         node.id = id;
//         document.body.insertBefore(node, document.body.childNodes[0]);
//         imageSelection = new ImageSelection();

//         let options: EditorOptions = {
//             plugins: [imageSelection],
//             defaultFormat: {
//                 fontFamily: 'Calibri,Arial,Helvetica,sans-serif',
//                 fontSize: '11pt',
//                 textColor: '#000000',
//             },
//             corePluginOverride: {},
//         };

//         editor = new Editor(node as HTMLDivElement, options);

//         editor.runAsync = callback => {
//             callback(editor);
//             return null;
//         };
//         editorIsFeatureEnabled = spyOn(editor, 'isFeatureEnabled');
//     });

//     afterEach(() => {
//         editor.dispose();
//         editor = null;
//         const div = document.getElementById(id);
//         div.parentNode.removeChild(div);
//     });

//     it('should be triggered in mouse up left click', () => {
//         editor.setContent(`<img id=${imageId}></img>`);
//         const target = document.getElementById(imageId);
//         editorIsFeatureEnabled.and.returnValue(true);
//         imageSelection.onPluginEvent(mouseDown(target!, 0));
//         imageSelection.onPluginEvent(mouseup(target!, 0, true));
//         editor.focus();

//         const selection = editor.getSelectionRangeEx();
//         expect(selection.type).toBe(SelectionRangeTypes.ImageSelection);
//         expect(selection.areAllCollapsed).toBe(false);
//     });

//     it('should not be triggered in mouse up left click', () => {
//         editor.setContent(`<img id=${imageId}></img>`);
//         const target = document.getElementById(imageId);
//         editorIsFeatureEnabled.and.returnValue(true);
//         imageSelection.onPluginEvent(mouseDown(target!, 0));
//         imageSelection.onPluginEvent(mouseup(target!, 0, false));
//         editor.focus();

//         const selection = editor.getSelectionRangeEx();
//         expect(selection.type).toBe(SelectionRangeTypes.Normal);
//         expect(selection.areAllCollapsed).toBe(true);
//     });

//     it('should handle a ESCAPE KEY in a image', () => {
//         editor.setContent(`<img id=${imageId}></img>`);
//         const target = document.getElementById(imageId);
//         editorIsFeatureEnabled.and.returnValue(true);
//         editor.focus();
//         editor.select(target);
//         const range = document.createRange();
//         range.selectNode(target!);
//         imageSelection.onPluginEvent(keyDown(Escape));
//         imageSelection.onPluginEvent(keyUp(Escape));
//         const selection = editor.getSelectionRangeEx();
//         expect(selection.type).toBe(SelectionRangeTypes.Normal);
//         expect(selection.areAllCollapsed).toBe(true);
//     });

//     it('should handle a DELETE KEY in a image', () => {
//         editor.setContent(`<img id=${imageId}></img>`);
//         const target = document.getElementById(imageId);
//         editorIsFeatureEnabled.and.returnValue(true);
//         editor.focus();
//         editor.select(target);
//         const range = document.createRange();
//         range.selectNode(target!);
//         imageSelection.onPluginEvent(keyDown(Delete));
//         imageSelection.onPluginEvent(keyUp(Delete));
//         expect(editor.getContent()).toBe('');
//     });

//     it('should handle any key in a image', () => {
//         editor.setContent(`<img id=${imageId}></img>`);
//         const target = document.getElementById(imageId);
//         editorIsFeatureEnabled.and.returnValue(true);
//         editor.focus();
//         editor.select(target);
//         const range = document.createRange();
//         range.selectNode(target!);
//         imageSelection.onPluginEvent(keyDown(Space));
//         imageSelection.onPluginEvent(keyUp(Space));
//         const selection = editor.getSelectionRangeEx();
//         expect(selection.type).toBe(SelectionRangeTypes.Normal);
//         expect(selection.areAllCollapsed).toBe(true);
//     });

//     it('should not handle any key in a image in ctrl', () => {
//         editor.setContent(`<img id=${imageId}></img>`);
//         const target = document.getElementById(imageId);
//         editorIsFeatureEnabled.and.returnValue(true);
//         editor.focus();
//         editor.select(target);
//         const range = document.createRange();
//         range.selectNode(target!);
//         imageSelection.onPluginEvent(keyDown(Space, true));
//         imageSelection.onPluginEvent(keyUp(Space, true));
//         const selection = editor.getSelectionRangeEx();
//         expect(selection.type).toBe(SelectionRangeTypes.ImageSelection);
//         expect(selection.areAllCollapsed).toBe(false);
//     });

//     it('should handle contextMenu', () => {
//         editor.setContent(`<img id=${imageId}></img>`);
//         const target = document.getElementById(imageId);
//         editorIsFeatureEnabled.and.returnValue(true);
//         editor.focus();
//         const contextMenuEvent = contextMenu(target!);
//         imageSelection.onPluginEvent(contextMenuEvent);
//         const selection = editor.getSelectionRangeEx();
//         expect(selection.type).toBe(SelectionRangeTypes.ImageSelection);
//         expect(selection.areAllCollapsed).toBe(false);
//     });

//     it('should change image selection contextMenu', () => {
//         editor.setContent(`<img id=${imageId}></img><img id=${imageId2}></img>`);
//         const target = document.getElementById(imageId);
//         const secondTarget = document.getElementById(imageId2);
//         editorIsFeatureEnabled.and.returnValue(true);
//         editor.focus();
//         editor.select(secondTarget);
//         const contextMenuEvent = contextMenu(target!);
//         imageSelection.onPluginEvent(contextMenuEvent);
//         const selection = editor.getSelectionRangeEx() as ImageSelectionRange;
//         expect(selection.type).toBe(SelectionRangeTypes.ImageSelection);

//         expect(selection.image.id).toBe(imageId);
//     });

//     it('should not change image selection contextMenu', () => {
//         editor.setContent(`<img id=${imageId}></img>`);
//         const target = document.getElementById(imageId);
//         editorIsFeatureEnabled.and.returnValue(true);
//         editor.focus();
//         editor.select(target);
//         const contextMenuEvent = contextMenu(target!);
//         imageSelection.onPluginEvent(contextMenuEvent);
//         spyOn(editor, 'select');
//         expect(editor.select).not.toHaveBeenCalled();
//     });

//     const keyDown = (key: string, ctrlKey: boolean = false): PluginEvent => {
//         return {
//             eventType: PluginEventType.KeyDown,
//             rawEvent: <KeyboardEvent>{
//                 key: key,
//                 preventDefault: () => {},
//                 stopPropagation: () => {},
//                 shiftKey: false,
//                 ctrlKey: ctrlKey,
//                 altKey: false,
//                 metaKey: false,
//             },
//         };
//     };

//     const keyUp = (key: string, ctrlKey: boolean = false): PluginEvent => {
//         return {
//             eventType: PluginEventType.KeyUp,
//             rawEvent: <KeyboardEvent>{
//                 key: key,
//                 preventDefault: () => {},
//                 stopPropagation: () => {},
//                 shiftKey: false,
//                 ctrlKey: ctrlKey,
//                 altKey: false,
//                 metaKey: false,
//             },
//         };
//     };

//     const contextMenu = (target: HTMLElement): PluginEvent => {
//         return {
//             eventType: PluginEventType.ContextMenu,
//             rawEvent: <any>{
//                 target: target,
//             },
//             items: [],
//         };
//     };

//     const mouseup = (
//         target: HTMLElement,
//         keyNumber: number,
//         isClicking: boolean
//     ): PluginMouseUpEvent => {
//         const rect = target.getBoundingClientRect();
//         return {
//             eventType: PluginEventType.MouseUp,
//             rawEvent: <any>{
//                 target: target,
//                 view: window,
//                 bubbles: true,
//                 cancelable: true,
//                 clientX: rect.left,
//                 clientY: rect.top,
//                 shiftKey: false,
//                 button: keyNumber,
//             },
//             isClicking,
//         };
//     };

//     const mouseDown = (target: HTMLElement, keyNumber: number): PluginMouseDownEvent => {
//         const rect = target.getBoundingClientRect();
//         return {
//             eventType: PluginEventType.MouseDown,
//             rawEvent: <any>{
//                 target: target,
//                 view: window,
//                 bubbles: true,
//                 cancelable: true,
//                 clientX: rect.left,
//                 clientY: rect.top,
//                 shiftKey: false,
//                 button: keyNumber,
//             },
//         };
//     };
// });
