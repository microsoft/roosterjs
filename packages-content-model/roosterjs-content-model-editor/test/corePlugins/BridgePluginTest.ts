import * as ContextMenuPlugin from '../../lib/corePlugins/ContextMenuPlugin';
import * as EditPlugin from '../../lib/corePlugins/EditPlugin';
import * as eventConverter from '../../lib/editor/utils/eventConverter';
import * as NormalizeTablePlugin from '../../lib/corePlugins/NormalizeTablePlugin';
import { BridgePlugin } from '../../lib/corePlugins/BridgePlugin';
import { PluginEventType } from 'roosterjs-editor-types';

describe('BridgePlugin', () => {
    function createMockedPlugin(name: string) {
        return {
            initialize: () => {},
            dispose: () => {},
            getState: () => name,
        } as any;
    }
    beforeEach(() => {
        spyOn(ContextMenuPlugin, 'createContextMenuPlugin').and.returnValue(
            createMockedPlugin('contextMenu')
        );
        spyOn(EditPlugin, 'createEditPlugin').and.returnValue(createMockedPlugin('edit'));
        spyOn(NormalizeTablePlugin, 'createNormalizeTablePlugin').and.returnValue(
            createMockedPlugin('normalizeTable')
        );
    });

    it('Ctor and init', () => {
        const initializeSpy = jasmine.createSpy('initialize');
        const onPluginEventSpy1 = jasmine.createSpy('onPluginEvent1');
        const onPluginEventSpy2 = jasmine.createSpy('onPluginEvent2');
        const disposeSpy = jasmine.createSpy('dispose');
        const queryElementsSpy = jasmine.createSpy('queryElement').and.returnValue([]);

        const mockedPlugin1 = {
            initialize: initializeSpy,
            onPluginEvent: onPluginEventSpy1,
            dispose: disposeSpy,
        } as any;
        const mockedPlugin2 = {
            initialize: initializeSpy,
            onPluginEvent: onPluginEventSpy2,
            dispose: disposeSpy,
        } as any;
        const mockedEditor = {
            queryElements: queryElementsSpy,
        } as any;

        const plugin = new BridgePlugin({
            legacyPlugins: [mockedPlugin1, mockedPlugin2],
        });
        expect(initializeSpy).not.toHaveBeenCalled();
        expect(onPluginEventSpy1).not.toHaveBeenCalled();
        expect(onPluginEventSpy2).not.toHaveBeenCalled();
        expect(disposeSpy).not.toHaveBeenCalled();

        expect(plugin.getCorePluginState()).toEqual({
            edit: 'edit',
            contextMenu: 'contextMenu',
        } as any);

        plugin.setOuterEditor(mockedEditor);

        expect(initializeSpy).toHaveBeenCalledTimes(0);
        expect(onPluginEventSpy1).toHaveBeenCalledTimes(0);
        expect(onPluginEventSpy2).toHaveBeenCalledTimes(0);
        expect(disposeSpy).not.toHaveBeenCalled();

        plugin.initialize();

        expect(initializeSpy).toHaveBeenCalledTimes(2);
        expect(onPluginEventSpy1).toHaveBeenCalledTimes(1);
        expect(onPluginEventSpy2).toHaveBeenCalledTimes(1);
        expect(disposeSpy).not.toHaveBeenCalled();

        expect(initializeSpy).toHaveBeenCalledWith(mockedEditor);
        expect(onPluginEventSpy1).toHaveBeenCalledWith({
            eventType: PluginEventType.EditorReady,
        });
        expect(onPluginEventSpy2).toHaveBeenCalledWith({
            eventType: PluginEventType.EditorReady,
        });

        plugin.dispose();

        expect(disposeSpy).toHaveBeenCalledTimes(2);
    });

    it('willHandleEventExclusively', () => {
        const initializeSpy = jasmine.createSpy('initialize');
        const onPluginEventSpy1 = jasmine.createSpy('onPluginEvent1');
        const onPluginEventSpy2 = jasmine.createSpy('onPluginEvent2');
        const disposeSpy = jasmine.createSpy('dispose');
        const willHandleEventExclusivelySpy = jasmine
            .createSpy('willHandleEventExclusively')
            .and.returnValue(true);

        const mockedPlugin1 = {
            initialize: initializeSpy,
            onPluginEvent: onPluginEventSpy1,
            dispose: disposeSpy,
        } as any;
        const mockedPlugin2 = {
            initialize: initializeSpy,
            onPluginEvent: onPluginEventSpy2,
            willHandleEventExclusively: willHandleEventExclusivelySpy,
            dispose: disposeSpy,
        } as any;
        const mockedEditor = 'EDITOR' as any;
        const plugin = new BridgePlugin({
            legacyPlugins: [mockedPlugin1, mockedPlugin2],
        });

        spyOn(eventConverter, 'newEventToOldEvent').and.callFake(newEvent => {
            return ('NEW_' + newEvent) as any;
        });

        plugin.setOuterEditor(mockedEditor);

        const mockedEvent = {} as any;
        const result = plugin.willHandleEventExclusively(mockedEvent);

        expect(result).toBeTrue();
        expect(mockedEvent).toEqual({
            eventDataCache: {
                __ExclusivelyHandleEventPlugin: mockedPlugin2,
            },
        });
        expect(eventConverter.newEventToOldEvent).toHaveBeenCalledTimes(1);
        expect(eventConverter.newEventToOldEvent).toHaveBeenCalledWith(mockedEvent);

        plugin.dispose();
    });

    it('onPluginEvent without exclusive handling', () => {
        const initializeSpy = jasmine.createSpy('initialize');
        const onPluginEventSpy1 = jasmine.createSpy('onPluginEvent1').and.callFake(event => {
            event.data = 'plugin1';
        });
        const onPluginEventSpy2 = jasmine.createSpy('onPluginEvent2').and.callFake(event => {
            event.data = 'plugin2';
        });
        const disposeSpy = jasmine.createSpy('dispose');

        const mockedPlugin1 = {
            initialize: initializeSpy,
            onPluginEvent: onPluginEventSpy1,
            dispose: disposeSpy,
        } as any;
        const mockedPlugin2 = {
            initialize: initializeSpy,
            onPluginEvent: onPluginEventSpy2,
            dispose: disposeSpy,
        } as any;

        const mockedEditor = 'EDITOR' as any;
        const plugin = new BridgePlugin({
            legacyPlugins: [mockedPlugin1, mockedPlugin2],
        });

        spyOn(eventConverter, 'newEventToOldEvent').and.callFake(newEvent => {
            return {
                eventType: 'old_' + newEvent.eventType,
            } as any;
        });
        spyOn(eventConverter, 'oldEventToNewEvent').and.callFake((oldEvent: any) => {
            return {
                eventType: 'new_' + oldEvent.eventType,
                data: oldEvent.data,
            } as any;
        });

        plugin.setOuterEditor(mockedEditor);

        const mockedEvent = {
            eventType: 'newEvent',
        } as any;

        plugin.onPluginEvent(mockedEvent);

        expect(onPluginEventSpy1).toHaveBeenCalledTimes(1);
        expect(onPluginEventSpy1).toHaveBeenCalledWith({
            eventType: 'old_newEvent',
            data: 'plugin2',
        });
        expect(onPluginEventSpy2).toHaveBeenCalledTimes(1);
        expect(onPluginEventSpy2).toHaveBeenCalledWith({
            eventType: 'old_newEvent',
            data: 'plugin2',
        });
        expect(eventConverter.newEventToOldEvent).toHaveBeenCalledTimes(1);
        expect(eventConverter.newEventToOldEvent).toHaveBeenCalledWith(mockedEvent);
        expect(eventConverter.oldEventToNewEvent).toHaveBeenCalledTimes(1);
        expect(eventConverter.oldEventToNewEvent).toHaveBeenCalledWith(
            {
                eventType: 'old_newEvent' as any,
                data: 'plugin2',
            },
            {
                eventType: 'new_old_newEvent' as any,
                data: 'plugin2',
            }
        );

        expect(mockedEvent).toEqual({
            eventType: 'new_old_newEvent',
            data: 'plugin2',
        });

        plugin.dispose();
    });

    it('onPluginEvent with exclusive handling', () => {
        const initializeSpy = jasmine.createSpy('initialize');
        const onPluginEventSpy1 = jasmine.createSpy('onPluginEvent1');
        const onPluginEventSpy2 = jasmine.createSpy('onPluginEvent2');
        const disposeSpy = jasmine.createSpy('dispose');

        const mockedPlugin1 = {
            initialize: initializeSpy,
            onPluginEvent: onPluginEventSpy1,
            dispose: disposeSpy,
        } as any;
        const mockedPlugin2 = {
            initialize: initializeSpy,
            onPluginEvent: onPluginEventSpy2,
            dispose: disposeSpy,
        } as any;

        const mockedEditor = 'EDITOR' as any;
        const plugin = new BridgePlugin({
            legacyPlugins: [mockedPlugin1, mockedPlugin2],
        });

        spyOn(eventConverter, 'newEventToOldEvent').and.callFake(newEvent => {
            return {
                eventType: 'old_' + newEvent.eventType,
                eventDataCache: newEvent.eventDataCache,
            } as any;
        });

        plugin.setOuterEditor(mockedEditor);

        const mockedEvent = {
            eventType: 'newEvent',
            eventDataCache: {
                ['__ExclusivelyHandleEventPlugin']: mockedPlugin2,
            },
        } as any;

        plugin.onPluginEvent(mockedEvent);

        expect(onPluginEventSpy1).toHaveBeenCalledTimes(0);
        expect(onPluginEventSpy2).toHaveBeenCalledTimes(1);
        expect(onPluginEventSpy2).toHaveBeenCalledWith({
            eventType: 'old_newEvent',
            eventDataCache: {
                ['__ExclusivelyHandleEventPlugin']: mockedPlugin2,
            },
        });
        expect(eventConverter.newEventToOldEvent).toHaveBeenCalledTimes(1);
        expect(eventConverter.newEventToOldEvent).toHaveBeenCalledWith(mockedEvent);

        plugin.dispose();
    });
});
