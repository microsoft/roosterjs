import * as getSelectionRootNode from '../../lib/publicApi/selection/getSelectionRootNode';
import { createContextMenuPlugin } from '../../lib/corePlugin/ContextMenuPlugin';
import {
    ContextMenuPluginState,
    DOMEventRecord,
    IStandaloneEditor,
    PluginWithState,
} from 'roosterjs-content-model-types';

describe('ContextMenu handle other event', () => {
    let plugin: PluginWithState<ContextMenuPluginState>;
    let eventMap: Record<string, any>;
    let triggerEventSpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;
    let attachDOMEventSpy: jasmine.Spy;
    let getSelectionRootNodeSpy: jasmine.Spy;
    let editor: IStandaloneEditor;

    beforeEach(() => {
        triggerEventSpy = jasmine.createSpy('triggerEvent');
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        getSelectionRootNodeSpy = spyOn(getSelectionRootNode, 'getSelectionRootNode');
        attachDOMEventSpy = jasmine
            .createSpy('attachDOMEvent')
            .and.callFake((handlers: Record<string, DOMEventRecord>) => {
                eventMap = handlers;
            });

        editor = <IStandaloneEditor>(<any>{
            getDOMSelection: getDOMSelectionSpy,
            attachDomEvent: attachDOMEventSpy,
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

        expect(attachDOMEventSpy).toHaveBeenCalledTimes(1);

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

        const getContextMenuItemSpy1 = jasmine
            .createSpy('getContextMenu 1')
            .and.returnValue(mockedItems1);
        const getContextMenuItemSpy2 = jasmine
            .createSpy('getContextMenu 2')
            .and.returnValue(mockedItems2);

        state.contextMenuProviders = [
            {
                getContextMenuItems: getContextMenuItemSpy1,
            } as any,
            {
                getContextMenuItems: getContextMenuItemSpy2,
            } as any,
        ];

        const mockedTarget = 'TARGET' as any;
        const mockedEvent = {
            button: 2,
            target: mockedTarget,
        };
        const collapseSpy = jasmine.createSpy('collapse');
        const mockedRange = {
            collapse: collapseSpy,
        };
        const mockedSelection = {
            type: 'range',
            range: mockedRange,
        };
        const mockedNode = 'NODE';

        getDOMSelectionSpy.and.returnValue(mockedSelection);
        getSelectionRootNodeSpy.and.returnValue(mockedNode);

        eventMap.contextmenu.beforeDispatch(mockedEvent);

        expect(collapseSpy).not.toHaveBeenCalled();
        expect(getDOMSelectionSpy).not.toHaveBeenCalled();
        expect(getSelectionRootNodeSpy).not.toHaveBeenCalled();
        expect(getContextMenuItemSpy1).toHaveBeenCalledWith(mockedTarget);
        expect(getContextMenuItemSpy2).toHaveBeenCalledWith(mockedTarget);
        expect(triggerEventSpy).toHaveBeenCalledWith('contextMenu', {
            rawEvent: mockedEvent,
            items: ['Item1', 'Item2', null, 'Item3', 'Item4'],
        });
    });

    it('Trigger contextmenu event using keyboard', () => {
        plugin = createContextMenuPlugin({});
        plugin.initialize(editor);

        const state = plugin.getState();
        const mockedItems1 = ['Item1', 'Item2'];
        const mockedItems2 = ['Item3', 'Item4'];
        const getContextMenuItemSpy1 = jasmine
            .createSpy('getContextMenu 1')
            .and.returnValue(mockedItems1);
        const getContextMenuItemSpy2 = jasmine
            .createSpy('getContextMenu 2')
            .and.returnValue(mockedItems2);

        state.contextMenuProviders = [
            {
                getContextMenuItems: getContextMenuItemSpy1,
            } as any,
            {
                getContextMenuItems: getContextMenuItemSpy2,
            } as any,
        ];

        const mockedTarget = 'TARGET' as any;
        const mockedEvent = {
            button: -1,
            target: mockedTarget,
        };
        const collapseSpy = jasmine.createSpy('collapse');
        const mockedRange = {
            collapse: collapseSpy,
        };
        const mockedSelection = {
            type: 'range',
            range: mockedRange,
        };
        const mockedNode = 'NODE';

        getDOMSelectionSpy.and.returnValue(mockedSelection);
        getSelectionRootNodeSpy.and.returnValue(mockedNode);

        eventMap.contextmenu.beforeDispatch(mockedEvent);

        expect(collapseSpy).toHaveBeenCalledWith(true);
        expect(getDOMSelectionSpy).toHaveBeenCalledWith();
        expect(getSelectionRootNodeSpy).toHaveBeenCalledWith(mockedSelection);
        expect(getContextMenuItemSpy1).toHaveBeenCalledWith(mockedNode);
        expect(getContextMenuItemSpy2).toHaveBeenCalledWith(mockedNode);
        expect(triggerEventSpy).toHaveBeenCalledWith('contextMenu', {
            rawEvent: mockedEvent,
            items: ['Item1', 'Item2', null, 'Item3', 'Item4'],
        });
    });
});
