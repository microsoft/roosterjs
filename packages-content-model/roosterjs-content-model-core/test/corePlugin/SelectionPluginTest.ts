import { createSelectionPlugin } from '../../lib/corePlugin/SelectionPlugin';
import { IEditor, PluginWithState } from 'roosterjs-editor-types';
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

describe('DOMEventPlugin handle onFocus and onBlur event', () => {
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
