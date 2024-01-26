import { createContextMenuPlugin } from '../../lib/corePlugin/ContextMenuPlugin';
import {
    ContextMenuPluginState,
    DOMEventRecord,
    IStandaloneEditor,
    PluginWithState,
} from 'roosterjs-content-model-types';

describe('ContextMenu handle other event', () => {
    let plugin: PluginWithState<ContextMenuPluginState>;
    let addEventListener: jasmine.Spy;
    let removeEventListener: jasmine.Spy;
    let eventMap: Record<string, any>;
    let getElementAtCursorSpy: jasmine.Spy;
    let triggerEventSpy: jasmine.Spy;
    let editor: IStandaloneEditor;

    beforeEach(() => {
        addEventListener = jasmine.createSpy('addEventListener');
        removeEventListener = jasmine.createSpy('.removeEventListener');
        getElementAtCursorSpy = jasmine.createSpy('getElementAtCursor');
        triggerEventSpy = jasmine.createSpy('triggerEvent');

        editor = <IStandaloneEditor>(<any>{
            getDocument: () => ({
                addEventListener,
                removeEventListener,
            }),
            getEnvironment: () => ({}),
            getDOMSelection: () => ({} as any),
            attachDomEvent: (handlers: Record<string, DOMEventRecord>) => {
                eventMap = handlers;
            },
            getElementAtCursor: getElementAtCursorSpy,
            triggerEvent: triggerEventSpy,
        });
    });

    afterEach(() => {
        plugin.dispose();
    });

    it('Ctor with parameter', () => {
        const mockedPlugin1 = {} as any;
        const mockedPlugin2 = {
            getContextMenuItems: () => {},
        } as any;

        plugin = createContextMenuPlugin({
            plugins: [mockedPlugin1, mockedPlugin2],
        });
        plugin.initialize(editor);

        const state = plugin.getState();

        expect(state).toEqual({
            contextMenuProviders: [mockedPlugin2],
        });
    });

    it('Trigger contextmenu event, skip reselect', () => {
        plugin = createContextMenuPlugin({});
        plugin.initialize(editor);

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
            button: 2,
            target: {},
        };

        eventMap.contextmenu.beforeDispatch(mockedEvent);

        expect(triggerEventSpy).toHaveBeenCalledWith('contextMenu', {
            rawEvent: mockedEvent,
            items: ['Item1', 'Item2', null, 'Item3', 'Item4'],
        });
    });
});
