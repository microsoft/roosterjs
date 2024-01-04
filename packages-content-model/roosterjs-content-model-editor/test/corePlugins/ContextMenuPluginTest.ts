import { ContextMenuPluginState } from '../../lib/publicTypes/ContextMenuPluginState';
import { createContextMenuPlugin } from '../../lib/corePlugins/ContextMenuPlugin';
import { IEditor, PluginEventType, PluginWithState } from 'roosterjs-editor-types';
import { IStandaloneEditor } from 'roosterjs-content-model-types';

describe('ContextMenu handle other event', () => {
    let plugin: PluginWithState<ContextMenuPluginState>;
    let addEventListener: jasmine.Spy;
    let removeEventListener: jasmine.Spy;
    let triggerPluginEvent: jasmine.Spy;
    let eventMap: Record<string, any>;
    let getElementAtCursorSpy: jasmine.Spy;
    let triggerContentChangedEventSpy: jasmine.Spy;
    let editor: IEditor & IStandaloneEditor;

    beforeEach(() => {
        addEventListener = jasmine.createSpy('addEventListener');
        removeEventListener = jasmine.createSpy('.removeEventListener');
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        getElementAtCursorSpy = jasmine.createSpy('getElementAtCursor');
        triggerContentChangedEventSpy = jasmine.createSpy('triggerContentChangedEvent');

        editor = <IEditor & IStandaloneEditor>(<any>{
            getDocument: () => ({
                addEventListener,
                removeEventListener,
            }),
            triggerPluginEvent,
            getEnvironment: () => ({}),
            addDomEventHandler: (name: string, handler: Function) => {
                eventMap = {
                    [name]: {
                        beforeDispatch: handler,
                    },
                };
            },
            getElementAtCursor: getElementAtCursorSpy,
            triggerContentChangedEvent: triggerContentChangedEventSpy,
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

        eventMap.contextmenu.beforeDispatch(mockedEvent);

        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.ContextMenu, {
            rawEvent: mockedEvent,
            items: ['Item1', 'Item2', null, 'Item3', 'Item4'],
        });
    });
});
