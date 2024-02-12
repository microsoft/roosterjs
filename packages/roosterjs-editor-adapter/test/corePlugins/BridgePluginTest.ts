import * as BridgePlugin from '../../lib/corePlugins/BridgePlugin';
import * as DarkColorHandler from '../../lib/editor/DarkColorHandlerImpl';
import * as EditPlugin from '../../lib/corePlugins/EditPlugin';
import * as eventConverter from '../../lib/editor/utils/eventConverter';
import { coreApiMap } from '../../lib/coreApi/coreApiMap';
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
        spyOn(EditPlugin, 'createEditPlugin').and.returnValue(createMockedPlugin('edit'));
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
        const onInitializeSpy = jasmine.createSpy('onInitialize').and.returnValue(mockedEditor);
        const plugin = new BridgePlugin.BridgePlugin(onInitializeSpy, [
            mockedPlugin1,
            mockedPlugin2,
        ]);
        expect(initializeSpy).not.toHaveBeenCalled();
        expect(onPluginEventSpy1).not.toHaveBeenCalled();
        expect(onPluginEventSpy2).not.toHaveBeenCalled();
        expect(disposeSpy).not.toHaveBeenCalled();
        expect(onInitializeSpy).not.toHaveBeenCalled();

        const mockedZoomScale = 'ZOOM' as any;
        const calculateZoomScaleSpy = jasmine
            .createSpy('calculateZoomScale')
            .and.returnValue(mockedZoomScale);
        const mockedColorManager = 'COLOR' as any;
        const mockedInnerDarkColorHandler = 'INNERCOLOR' as any;
        const mockedInnerEditor = {
            getDOMHelper: () => ({
                calculateZoomScale: calculateZoomScaleSpy,
            }),
            getColorManager: () => mockedInnerDarkColorHandler,
        } as any;

        const createDarkColorHandlerSpy = spyOn(
            DarkColorHandler,
            'createDarkColorHandler'
        ).and.returnValue(mockedColorManager);

        plugin.initialize(mockedInnerEditor);

        expect(onInitializeSpy).toHaveBeenCalledWith({
            api: coreApiMap,
            originalApi: coreApiMap,
            customData: {},
            experimentalFeatures: [],
            sizeTransformer: jasmine.anything(),
            darkColorHandler: mockedColorManager,
            edit: 'edit',
            contextMenuProviders: [],
        } as any);
        expect(createDarkColorHandlerSpy).toHaveBeenCalledWith(mockedInnerDarkColorHandler);
        expect(initializeSpy).toHaveBeenCalledTimes(2);
        expect(disposeSpy).not.toHaveBeenCalled();
        expect(initializeSpy).toHaveBeenCalledWith(mockedEditor);
        expect(onPluginEventSpy1).not.toHaveBeenCalled();
        expect(onPluginEventSpy2).not.toHaveBeenCalled();

        plugin.onPluginEvent({ eventType: 'editorReady' });

        expect(onPluginEventSpy1).toHaveBeenCalledTimes(1);
        expect(onPluginEventSpy2).toHaveBeenCalledTimes(1);
        expect(onPluginEventSpy1).toHaveBeenCalledWith({
            eventType: PluginEventType.EditorReady,
            eventDataCache: undefined,
        });
        expect(onPluginEventSpy2).toHaveBeenCalledWith({
            eventType: PluginEventType.EditorReady,
            eventDataCache: undefined,
        });

        plugin.dispose();

        expect(disposeSpy).toHaveBeenCalledTimes(2);
    });

    it('Ctor and init with more options', () => {
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
        const onInitializeSpy = jasmine.createSpy('onInitialize').and.returnValue(mockedEditor);
        const plugin = new BridgePlugin.BridgePlugin(
            onInitializeSpy,
            [mockedPlugin1, mockedPlugin2],
            { a: 'b' } as any,
            ['c' as any]
        );
        expect(initializeSpy).not.toHaveBeenCalled();
        expect(onPluginEventSpy1).not.toHaveBeenCalled();
        expect(onPluginEventSpy2).not.toHaveBeenCalled();
        expect(disposeSpy).not.toHaveBeenCalled();
        expect(onInitializeSpy).not.toHaveBeenCalled();

        const mockedZoomScale = 'ZOOM' as any;
        const calculateZoomScaleSpy = jasmine
            .createSpy('calculateZoomScale')
            .and.returnValue(mockedZoomScale);
        const mockedColorManager = 'COLOR' as any;
        const mockedInnerDarkColorHandler = 'INNERCOLOR' as any;
        const mockedInnerEditor = {
            getDOMHelper: () => ({
                calculateZoomScale: calculateZoomScaleSpy,
            }),
            getColorManager: () => mockedInnerDarkColorHandler,
        } as any;

        const createDarkColorHandlerSpy = spyOn(
            DarkColorHandler,
            'createDarkColorHandler'
        ).and.returnValue(mockedColorManager);

        plugin.initialize(mockedInnerEditor);

        expect(onInitializeSpy).toHaveBeenCalledWith({
            api: { ...coreApiMap, a: 'b' },
            originalApi: coreApiMap,
            customData: {},
            experimentalFeatures: ['c'],
            sizeTransformer: jasmine.anything(),
            darkColorHandler: mockedColorManager,
            edit: 'edit',
            contextMenuProviders: [],
        } as any);
        expect(createDarkColorHandlerSpy).toHaveBeenCalledWith(mockedInnerDarkColorHandler);
        expect(initializeSpy).toHaveBeenCalledTimes(2);
        expect(disposeSpy).not.toHaveBeenCalled();
        expect(initializeSpy).toHaveBeenCalledWith(mockedEditor);
        expect(onPluginEventSpy1).not.toHaveBeenCalled();
        expect(onPluginEventSpy2).not.toHaveBeenCalled();

        plugin.onPluginEvent({ eventType: 'editorReady' });

        expect(onPluginEventSpy1).toHaveBeenCalledTimes(1);
        expect(onPluginEventSpy2).toHaveBeenCalledTimes(1);
        expect(onPluginEventSpy1).toHaveBeenCalledWith({
            eventType: PluginEventType.EditorReady,
            eventDataCache: undefined,
        });
        expect(onPluginEventSpy2).toHaveBeenCalledWith({
            eventType: PluginEventType.EditorReady,
            eventDataCache: undefined,
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
        const onInitializeSpy = jasmine.createSpy('onInitialize').and.returnValue(mockedEditor);
        const plugin = new BridgePlugin.BridgePlugin(onInitializeSpy, [
            mockedPlugin1,
            mockedPlugin2,
        ]);

        spyOn(eventConverter, 'newEventToOldEvent').and.callFake(newEvent => {
            return ('NEW_' + newEvent) as any;
        });

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
        const onInitializeSpy = jasmine.createSpy('onInitialize').and.returnValue(mockedEditor);
        const plugin = new BridgePlugin.BridgePlugin(onInitializeSpy, [
            mockedPlugin1,
            mockedPlugin2,
        ]);

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
        const onInitializeSpy = jasmine.createSpy('onInitialize').and.returnValue(mockedEditor);
        const plugin = new BridgePlugin.BridgePlugin(onInitializeSpy, [
            mockedPlugin1,
            mockedPlugin2,
        ]);

        spyOn(eventConverter, 'newEventToOldEvent').and.callFake(newEvent => {
            return {
                eventType: 'old_' + newEvent.eventType,
                eventDataCache: newEvent.eventDataCache,
            } as any;
        });

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

    it('Context Menu provider', () => {
        const initializeSpy = jasmine.createSpy('initialize');
        const onPluginEventSpy1 = jasmine.createSpy('onPluginEvent1');
        const onPluginEventSpy2 = jasmine.createSpy('onPluginEvent2');
        const disposeSpy = jasmine.createSpy('dispose');
        const queryElementsSpy = jasmine.createSpy('queryElement').and.returnValue([]);
        const getContextMenuItemsSpy1 = jasmine
            .createSpy('getContextMenuItems 1')
            .and.returnValue(['item1', 'item2']);
        const getContextMenuItemsSpy2 = jasmine
            .createSpy('getContextMenuItems 2')
            .and.returnValue(['item3', 'item4']);

        const mockedPlugin1 = {
            initialize: initializeSpy,
            onPluginEvent: onPluginEventSpy1,
            dispose: disposeSpy,
            getContextMenuItems: getContextMenuItemsSpy1,
        } as any;
        const mockedPlugin2 = {
            initialize: initializeSpy,
            onPluginEvent: onPluginEventSpy2,
            dispose: disposeSpy,
            getContextMenuItems: getContextMenuItemsSpy2,
        } as any;
        const mockedEditor = {
            queryElements: queryElementsSpy,
        } as any;

        const onInitializeSpy = jasmine.createSpy('onInitialize').and.returnValue(mockedEditor);
        const plugin = new BridgePlugin.BridgePlugin(onInitializeSpy, [
            mockedPlugin1,
            mockedPlugin2,
        ]);
        expect(initializeSpy).not.toHaveBeenCalled();
        expect(onPluginEventSpy1).not.toHaveBeenCalled();
        expect(onPluginEventSpy2).not.toHaveBeenCalled();
        expect(disposeSpy).not.toHaveBeenCalled();

        const mockedZoomScale = 'ZOOM' as any;
        const calculateZoomScaleSpy = jasmine
            .createSpy('calculateZoomScale')
            .and.returnValue(mockedZoomScale);
        const mockedColorManager = 'COLOR' as any;
        const mockedInnerEditor = {
            getDOMHelper: () => ({
                calculateZoomScale: calculateZoomScaleSpy,
            }),
            getColorManager: () => mockedColorManager,
        } as any;
        const mockedDarkColorHandler = 'COLOR' as any;
        const createDarkColorHandlerSpy = spyOn(
            DarkColorHandler,
            'createDarkColorHandler'
        ).and.returnValue(mockedDarkColorHandler);

        plugin.initialize(mockedInnerEditor);

        expect(onInitializeSpy).toHaveBeenCalledWith({
            api: coreApiMap,
            originalApi: coreApiMap,
            customData: {},
            experimentalFeatures: [],
            sizeTransformer: jasmine.anything(),
            darkColorHandler: mockedDarkColorHandler,
            edit: 'edit',
            contextMenuProviders: [mockedPlugin1, mockedPlugin2],
        } as any);
        expect(createDarkColorHandlerSpy).toHaveBeenCalledWith(mockedColorManager);
        expect(initializeSpy).toHaveBeenCalledTimes(2);
        expect(onPluginEventSpy1).toHaveBeenCalledTimes(0);
        expect(onPluginEventSpy2).toHaveBeenCalledTimes(0);
        expect(disposeSpy).not.toHaveBeenCalled();
        expect(initializeSpy).toHaveBeenCalledWith(mockedEditor);

        plugin.onPluginEvent({ eventType: 'editorReady' });

        expect(onPluginEventSpy1).toHaveBeenCalledTimes(1);
        expect(onPluginEventSpy2).toHaveBeenCalledTimes(1);
        expect(disposeSpy).not.toHaveBeenCalled();
        expect(onPluginEventSpy1).toHaveBeenCalledWith({
            eventType: PluginEventType.EditorReady,
            eventDataCache: undefined,
        });
        expect(onPluginEventSpy2).toHaveBeenCalledWith({
            eventType: PluginEventType.EditorReady,
            eventDataCache: undefined,
        });

        const mockedNode = 'NODE' as any;

        const items = plugin.getContextMenuItems(mockedNode);

        expect(items).toEqual(['item1', 'item2', null, 'item3', 'item4']);
        expect(getContextMenuItemsSpy1).toHaveBeenCalledWith(mockedNode);
        expect(getContextMenuItemsSpy2).toHaveBeenCalledWith(mockedNode);

        plugin.dispose();

        expect(disposeSpy).toHaveBeenCalledTimes(2);
    });
});
