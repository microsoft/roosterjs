import * as BridgePlugin from '../../lib/corePlugins/BridgePlugin';
import * as DarkColorHandler from '../../lib/editor/DarkColorHandlerImpl';
import * as EditPlugin from '../../lib/corePlugins/EditPlugin';
import * as eventConverter from '../../lib/editor/utils/eventConverter';
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
        const initializeSpy1 = jasmine.createSpy('initialize1');
        const initializeSpy2 = jasmine.createSpy('initialize2');
        const initializeSpy3 = jasmine.createSpy('initialize3');
        const onPluginEventSpy1 = jasmine.createSpy('onPluginEvent1');
        const onPluginEventSpy2 = jasmine.createSpy('onPluginEvent2');
        const onPluginEventSpy3 = jasmine.createSpy('onPluginEvent3');
        const disposeSpy = jasmine.createSpy('dispose');
        const queryElementsSpy = jasmine.createSpy('queryElement').and.returnValue([]);

        const mockedPlugin1 = {
            initialize: initializeSpy1,
            onPluginEvent: onPluginEventSpy1,
            dispose: disposeSpy,
            getName: () => '',
        } as any;
        const mockedPlugin2 = {
            initialize: initializeSpy2,
            onPluginEvent: onPluginEventSpy2,
            dispose: disposeSpy,
            getName: () => '',
        } as any;
        const mockedPlugin3 = {
            initialize: initializeSpy3,
            onPluginEvent: onPluginEventSpy3,
            dispose: disposeSpy,
            getName: () => 'TableCellSelection',
        } as any;
        const mockedEditor = {
            queryElements: queryElementsSpy,
        } as any;
        const onInitializeSpy = jasmine.createSpy('onInitialize').and.returnValue(mockedEditor);
        const plugin = new BridgePlugin.BridgePlugin(onInitializeSpy, [
            mockedPlugin1,
            mockedPlugin2,
            mockedPlugin3,
        ]);
        expect(initializeSpy1).not.toHaveBeenCalled();
        expect(initializeSpy2).not.toHaveBeenCalled();
        expect(initializeSpy3).not.toHaveBeenCalled();
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
            getEnvironment: () => {
                return {
                    domToModelSettings: {
                        customized: {},
                    },
                };
            },
            getDocument: () => document,
        } as any;

        const createDarkColorHandlerSpy = spyOn(
            DarkColorHandler,
            'createDarkColorHandler'
        ).and.returnValue(mockedColorManager);

        plugin.initialize(mockedInnerEditor);

        expect(onInitializeSpy).toHaveBeenCalledWith({
            customData: {},
            experimentalFeatures: [],
            sizeTransformer: jasmine.anything(),
            darkColorHandler: mockedColorManager,
            edit: 'edit',
            contextMenuProviders: [],
        } as any);
        expect(createDarkColorHandlerSpy).toHaveBeenCalledWith(mockedInnerDarkColorHandler);
        expect(initializeSpy1).toHaveBeenCalledTimes(1);
        expect(initializeSpy2).toHaveBeenCalledTimes(1);
        expect(initializeSpy3).toHaveBeenCalledTimes(0);
        expect(disposeSpy).not.toHaveBeenCalled();
        expect(initializeSpy1).toHaveBeenCalledWith(mockedEditor);
        expect(initializeSpy2).toHaveBeenCalledWith(mockedEditor);
        expect(onPluginEventSpy1).not.toHaveBeenCalled();
        expect(onPluginEventSpy2).not.toHaveBeenCalled();

        plugin.onPluginEvent({
            eventType: 'editorReady',
            addedBlockElements: [],
            removedBlockElements: [],
        });

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
            getName: () => '',
        } as any;
        const mockedPlugin2 = {
            initialize: initializeSpy,
            onPluginEvent: onPluginEventSpy2,
            dispose: disposeSpy,
            getName: () => '',
        } as any;
        const mockedEditor = {
            queryElements: queryElementsSpy,
        } as any;
        const onInitializeSpy = jasmine.createSpy('onInitialize').and.returnValue(mockedEditor);
        const plugin = new BridgePlugin.BridgePlugin(
            onInitializeSpy,
            [mockedPlugin1, mockedPlugin2],
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
            getEnvironment: () => {
                return {
                    domToModelSettings: {
                        customized: {},
                    },
                };
            },
            getDocument: () => document,
        } as any;

        const createDarkColorHandlerSpy = spyOn(
            DarkColorHandler,
            'createDarkColorHandler'
        ).and.returnValue(mockedColorManager);

        plugin.initialize(mockedInnerEditor);

        expect(onInitializeSpy).toHaveBeenCalledWith({
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

        plugin.onPluginEvent({
            eventType: 'editorReady',
            addedBlockElements: [],
            removedBlockElements: [],
        });

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
            getName: () => '',
        } as any;
        const mockedPlugin2 = {
            initialize: initializeSpy,
            onPluginEvent: onPluginEventSpy2,
            willHandleEventExclusively: willHandleEventExclusivelySpy,
            dispose: disposeSpy,
            getName: () => '',
        } as any;
        const mockedEditor = 'EDITOR' as any;
        const onInitializeSpy = jasmine.createSpy('onInitialize').and.returnValue(mockedEditor);
        const plugin = new BridgePlugin.BridgePlugin(onInitializeSpy, [
            mockedPlugin1,
            mockedPlugin2,
        ]);

        spyOn(eventConverter, 'newEventToOldEvent').and.callFake((newEvent: any) => {
            return ('NEW_' + newEvent) as any;
        });

        const mockedEvent = {} as any;
        const result = plugin.willHandleEventExclusively(mockedEvent);

        expect(result).toBeTrue();
        expect(mockedEvent).toEqual({
            eventDataCache: {
                __ExclusivelyHandleEventPlugin: mockedPlugin2,
                __OldEventFromNewEvent: 'NEW_[object Object]',
            },
        });
        expect(eventConverter.newEventToOldEvent).toHaveBeenCalledTimes(1);
        expect(eventConverter.newEventToOldEvent).toHaveBeenCalledWith(mockedEvent);

        plugin.dispose();
    });

    it('onPluginEvent without exclusive handling', () => {
        const initializeSpy = jasmine.createSpy('initialize');
        const onPluginEventSpy1 = jasmine.createSpy('onPluginEvent1').and.callFake((event: any) => {
            event.data = 'plugin1';
        });
        const onPluginEventSpy2 = jasmine.createSpy('onPluginEvent2').and.callFake((event: any) => {
            event.data = 'plugin2';
        });
        const disposeSpy = jasmine.createSpy('dispose');

        const mockedPlugin1 = {
            initialize: initializeSpy,
            onPluginEvent: onPluginEventSpy1,
            dispose: disposeSpy,
            getName: () => '',
        } as any;
        const mockedPlugin2 = {
            initialize: initializeSpy,
            onPluginEvent: onPluginEventSpy2,
            dispose: disposeSpy,
            getName: () => '',
        } as any;

        const mockedEditor = 'EDITOR' as any;
        const onInitializeSpy = jasmine.createSpy('onInitialize').and.returnValue(mockedEditor);
        const plugin = new BridgePlugin.BridgePlugin(onInitializeSpy, [
            mockedPlugin1,
            mockedPlugin2,
        ]);

        spyOn(eventConverter, 'newEventToOldEvent').and.callFake((newEvent: any) => {
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
                eventDataCache: {
                    __ExclusivelyHandleEventPlugin: null,
                    __OldEventFromNewEvent: { eventType: 'old_newEvent', data: 'plugin2' },
                },
            },
            undefined
        );

        expect(mockedEvent).toEqual({
            eventType: 'new_old_newEvent',
            data: 'plugin2',
            eventDataCache: {
                __ExclusivelyHandleEventPlugin: null,
                __OldEventFromNewEvent: { eventType: 'old_newEvent', data: 'plugin2' },
            },
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
            getName: () => '',
        } as any;
        const mockedPlugin2 = {
            initialize: initializeSpy,
            onPluginEvent: onPluginEventSpy2,
            dispose: disposeSpy,
            getName: () => '',
        } as any;

        const mockedEditor = 'EDITOR' as any;
        const onInitializeSpy = jasmine.createSpy('onInitialize').and.returnValue(mockedEditor);
        const plugin = new BridgePlugin.BridgePlugin(onInitializeSpy, [
            mockedPlugin1,
            mockedPlugin2,
        ]);

        spyOn(eventConverter, 'newEventToOldEvent').and.callFake((newEvent: any) => {
            return {
                eventType: 'old_' + newEvent.eventType,
                eventDataCache: newEvent.eventDataCache,
            } as any;
        });

        const mockedEvent = {
            eventType: 'newEvent',
            eventDataCache: {
                __ExclusivelyHandleEventPlugin: mockedPlugin2,
            },
        } as any;

        plugin.onPluginEvent(mockedEvent);

        expect(onPluginEventSpy1).toHaveBeenCalledTimes(0);
        expect(onPluginEventSpy2).toHaveBeenCalledTimes(1);
        expect(onPluginEventSpy2).toHaveBeenCalledWith({
            eventType: 'old_newEvent',
            eventDataCache: {
                __ExclusivelyHandleEventPlugin: mockedPlugin2,
                __OldEventFromNewEvent: jasmine.anything(),
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
            getName: () => '',
        } as any;
        const mockedPlugin2 = {
            initialize: initializeSpy,
            onPluginEvent: onPluginEventSpy2,
            dispose: disposeSpy,
            getContextMenuItems: getContextMenuItemsSpy2,
            getName: () => '',
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
            getEnvironment: () => {
                return {
                    domToModelSettings: {
                        customized: {},
                    },
                };
            },
            getDocument: () => document,
        } as any;
        const mockedDarkColorHandler = 'COLOR' as any;
        const createDarkColorHandlerSpy = spyOn(
            DarkColorHandler,
            'createDarkColorHandler'
        ).and.returnValue(mockedDarkColorHandler);

        plugin.initialize(mockedInnerEditor);

        expect(onInitializeSpy).toHaveBeenCalledWith({
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

        plugin.onPluginEvent({
            eventType: 'editorReady',
            addedBlockElements: [],
            removedBlockElements: [],
        });

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

    it('Context Menu provider with V9 providers', () => {
        const initializeSpy = jasmine.createSpy('initialize');
        const onPluginEventSpy1 = jasmine.createSpy('onPluginEvent1');
        const onPluginEventSpy2 = jasmine.createSpy('onPluginEvent2');
        const onPluginEventSpy3 = jasmine.createSpy('onPluginEvent3');
        const disposeSpy = jasmine.createSpy('dispose');
        const queryElementsSpy = jasmine.createSpy('queryElement').and.returnValue([]);

        // V8 style context menu provider (1 argument)
        const getContextMenuItemsSpyV8 = jasmine
            .createSpy('getContextMenuItems V8')
            .and.returnValue(['item1', 'item2']);

        // V9 style context menu provider (2 arguments) - create function with proper length
        const getContextMenuItemsSpyV9 = jasmine
            .createSpy('getContextMenuItems V9')
            .and.returnValue(['item3', 'item4']);
        // Override length property to simulate V9 function signature
        Object.defineProperty(getContextMenuItemsSpyV9, 'length', { value: 2 });

        const mockedPluginV8 = {
            initialize: initializeSpy,
            onPluginEvent: onPluginEventSpy1,
            dispose: disposeSpy,
            getContextMenuItems: getContextMenuItemsSpyV8,
            getName: () => '',
        } as any;

        const mockedPluginV9 = {
            initialize: initializeSpy,
            onPluginEvent: onPluginEventSpy2,
            dispose: disposeSpy,
            getContextMenuItems: getContextMenuItemsSpyV9,
            getName: () => '',
            initializeV9: jasmine.createSpy('initializeV9'),
        } as any;

        const mockedPluginRegular = {
            initialize: initializeSpy,
            onPluginEvent: onPluginEventSpy3,
            dispose: disposeSpy,
            getName: () => '',
        } as any;

        const mockedEditor = {
            queryElements: queryElementsSpy,
        } as any;

        const onInitializeSpy = jasmine.createSpy('onInitialize').and.returnValue(mockedEditor);
        const plugin = new BridgePlugin.BridgePlugin(onInitializeSpy, [
            mockedPluginV8,
            mockedPluginV9,
            mockedPluginRegular,
        ]);

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
            getEnvironment: () => {
                return {
                    domToModelSettings: {
                        customized: {},
                    },
                };
            },
            getDocument: () => document,
        } as any;
        const mockedDarkColorHandler = 'COLOR' as any;
        spyOn(DarkColorHandler, 'createDarkColorHandler').and.returnValue(mockedDarkColorHandler);

        plugin.initialize(mockedInnerEditor);

        expect(onInitializeSpy).toHaveBeenCalledWith({
            customData: {},
            experimentalFeatures: [],
            sizeTransformer: jasmine.anything(),
            darkColorHandler: mockedDarkColorHandler,
            edit: 'edit',
            contextMenuProviders: [mockedPluginV8, mockedPluginV9],
        } as any);

        const mockedNode = 'NODE' as any;
        const mockedEvent = 'EVENT' as any;

        // Test that V9 provider receives both arguments, V8 provider receives only target
        const items = plugin.getContextMenuItems(mockedNode, mockedEvent);

        expect(items).toEqual(['item1', 'item2', null, 'item3', 'item4']);
        expect(getContextMenuItemsSpyV8).toHaveBeenCalledWith(mockedNode);
        expect(getContextMenuItemsSpyV9).toHaveBeenCalledWith(mockedNode, mockedEvent);

        plugin.dispose();

        expect(disposeSpy).toHaveBeenCalledTimes(3);
    });

    it('Context Menu provider with empty results', () => {
        const initializeSpy = jasmine.createSpy('initialize');
        const disposeSpy = jasmine.createSpy('dispose');
        const queryElementsSpy = jasmine.createSpy('queryElement').and.returnValue([]);

        // V8 provider returning empty array
        const getContextMenuItemsSpyV8Empty = jasmine
            .createSpy('getContextMenuItems V8 Empty')
            .and.returnValue([]);

        // V9 provider returning null
        const getContextMenuItemsSpyV9Null = jasmine
            .createSpy('getContextMenuItems V9 Null')
            .and.returnValue(null);
        Object.defineProperty(getContextMenuItemsSpyV9Null, 'length', { value: 2 });

        // V9 provider returning items
        const getContextMenuItemsSpyV9Items = jasmine
            .createSpy('getContextMenuItems V9 Items')
            .and.returnValue(['item1']);
        Object.defineProperty(getContextMenuItemsSpyV9Items, 'length', { value: 2 });

        const mockedPluginV8Empty = {
            initialize: initializeSpy,
            dispose: disposeSpy,
            getContextMenuItems: getContextMenuItemsSpyV8Empty,
            getName: () => '',
        } as any;

        const mockedPluginV9Null = {
            initialize: initializeSpy,
            dispose: disposeSpy,
            getContextMenuItems: getContextMenuItemsSpyV9Null,
            getName: () => '',
            initializeV9: jasmine.createSpy('initializeV9'),
        } as any;

        const mockedPluginV9Items = {
            initialize: initializeSpy,
            dispose: disposeSpy,
            getContextMenuItems: getContextMenuItemsSpyV9Items,
            getName: () => '',
            initializeV9: jasmine.createSpy('initializeV9'),
        } as any;

        const mockedEditor = {
            queryElements: queryElementsSpy,
        } as any;

        const onInitializeSpy = jasmine.createSpy('onInitialize').and.returnValue(mockedEditor);
        const plugin = new BridgePlugin.BridgePlugin(onInitializeSpy, [
            mockedPluginV8Empty,
            mockedPluginV9Null,
            mockedPluginV9Items,
        ]);

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
            getEnvironment: () => {
                return {
                    domToModelSettings: {
                        customized: {},
                    },
                };
            },
            getDocument: () => document,
        } as any;
        const mockedDarkColorHandler = 'COLOR' as any;
        spyOn(DarkColorHandler, 'createDarkColorHandler').and.returnValue(mockedDarkColorHandler);

        plugin.initialize(mockedInnerEditor);

        const mockedNode = 'NODE' as any;
        const mockedEvent = 'EVENT' as any;

        // Only the provider with items should contribute to the result
        const items = plugin.getContextMenuItems(mockedNode, mockedEvent);

        expect(items).toEqual(['item1']);
        expect(getContextMenuItemsSpyV8Empty).toHaveBeenCalledWith(mockedNode);
        expect(getContextMenuItemsSpyV9Null).toHaveBeenCalledWith(mockedNode, mockedEvent);
        expect(getContextMenuItemsSpyV9Items).toHaveBeenCalledWith(mockedNode, mockedEvent);

        plugin.dispose();
    });

    it('isV9ContextMenuProvider detection', () => {
        const initializeSpy = jasmine.createSpy('initialize');
        const disposeSpy = jasmine.createSpy('dispose');

        // Function with 1 parameter (V8 style)
        const getContextMenuItemsV8 = jasmine
            .createSpy('getContextMenuItems V8')
            .and.returnValue(['item1']);
        Object.defineProperty(getContextMenuItemsV8, 'length', { value: 1 });

        // Function with 2 parameters (V9 style)
        const getContextMenuItemsV9 = jasmine
            .createSpy('getContextMenuItems V9')
            .and.returnValue(['item2']);
        Object.defineProperty(getContextMenuItemsV9, 'length', { value: 2 });

        // Function with 0 parameters
        const getContextMenuItemsZero = jasmine
            .createSpy('getContextMenuItems Zero')
            .and.returnValue(['item3']);
        Object.defineProperty(getContextMenuItemsZero, 'length', { value: 0 });

        // Function with 3 parameters
        const getContextMenuItemsThree = jasmine
            .createSpy('getContextMenuItems Three')
            .and.returnValue(['item4']);
        Object.defineProperty(getContextMenuItemsThree, 'length', { value: 3 });

        const mockedPluginV8 = {
            initialize: initializeSpy,
            dispose: disposeSpy,
            getContextMenuItems: getContextMenuItemsV8,
            getName: () => 'V8Plugin',
        } as any;

        const mockedPluginV9 = {
            initialize: initializeSpy,
            dispose: disposeSpy,
            getContextMenuItems: getContextMenuItemsV9,
            getName: () => 'V9Plugin',
            initializeV9: jasmine.createSpy('initializeV9'),
        } as any;

        const mockedPluginZero = {
            initialize: initializeSpy,
            dispose: disposeSpy,
            getContextMenuItems: getContextMenuItemsZero,
            getName: () => 'ZeroPlugin',
        } as any;

        const mockedPluginThree = {
            initialize: initializeSpy,
            dispose: disposeSpy,
            getContextMenuItems: getContextMenuItemsThree,
            getName: () => 'ThreePlugin',
        } as any;

        const mockedEditor = {} as any;
        const onInitializeSpy = jasmine.createSpy('onInitialize').and.returnValue(mockedEditor);
        const plugin = new BridgePlugin.BridgePlugin(onInitializeSpy, [
            mockedPluginV8,
            mockedPluginV9,
            mockedPluginZero,
            mockedPluginThree,
        ]);

        const mockedInnerEditor = {
            getDOMHelper: () => ({
                calculateZoomScale: () => 1,
            }),
            getColorManager: () => 'COLOR',
            getEnvironment: () => {
                return {
                    domToModelSettings: {
                        customized: {},
                    },
                };
            },
            getDocument: () => document,
        } as any;

        spyOn(DarkColorHandler, 'createDarkColorHandler').and.returnValue('COLOR' as any);

        plugin.initialize(mockedInnerEditor);

        const mockedNode = 'NODE' as any;
        const mockedEvent = 'EVENT' as any;

        const items = plugin.getContextMenuItems(mockedNode, mockedEvent);

        // V8 plugins should be called with only target, V9 plugin should be called with both target and event
        expect(getContextMenuItemsV8).toHaveBeenCalledWith(mockedNode);
        expect(getContextMenuItemsV9).toHaveBeenCalledWith(mockedNode, mockedEvent);
        expect(getContextMenuItemsZero).toHaveBeenCalledWith(mockedNode);
        expect(getContextMenuItemsThree).toHaveBeenCalledWith(mockedNode);

        // Only V9 plugin (length === 2) should receive the event parameter
        expect(items).toEqual(['item1', null, 'item2', null, 'item3', null, 'item4']);

        plugin.dispose();
    });

    it('MixedPlugin', () => {
        const initializeV8Spy = jasmine.createSpy('initializeV8');
        const initializeV9Spy = jasmine.createSpy('initializeV9');
        const onPluginEventV8Spy = jasmine.createSpy('onPluginEventV8');
        const onPluginEventV9Spy = jasmine.createSpy('onPluginEventV9');
        const willHandleEventExclusivelyV8Spy = jasmine.createSpy('willHandleEventExclusivelyV8');
        const willHandleEventExclusivelyV9Spy = jasmine.createSpy('willHandleEventExclusivelyV9');
        const disposeSpy = jasmine.createSpy('dispose');

        const mockedPlugin = {
            initialize: initializeV8Spy,
            initializeV9: initializeV9Spy,
            onPluginEvent: onPluginEventV8Spy,
            onPluginEventV9: onPluginEventV9Spy,
            willHandleEventExclusively: willHandleEventExclusivelyV8Spy,
            willHandleEventExclusivelyV9: willHandleEventExclusivelyV9Spy,
            dispose: disposeSpy,
            getName: () => '',
        } as any;
        const mockedEditor = {} as any;
        const onInitializeSpy = jasmine.createSpy('onInitialize').and.returnValue(mockedEditor);
        const plugin = new BridgePlugin.BridgePlugin(onInitializeSpy, [mockedPlugin]);

        expect(initializeV8Spy).not.toHaveBeenCalled();
        expect(initializeV9Spy).not.toHaveBeenCalled();
        expect(onPluginEventV8Spy).not.toHaveBeenCalled();
        expect(onPluginEventV9Spy).not.toHaveBeenCalled();
        expect(disposeSpy).not.toHaveBeenCalled();
        expect(onInitializeSpy).not.toHaveBeenCalled();
        expect(willHandleEventExclusivelyV8Spy).not.toHaveBeenCalled();
        expect(willHandleEventExclusivelyV9Spy).not.toHaveBeenCalled();

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
            getEnvironment: () => {
                return {
                    domToModelSettings: {
                        customized: {},
                    },
                };
            },
            getDocument: () => document,
        } as any;

        const createDarkColorHandlerSpy = spyOn(
            DarkColorHandler,
            'createDarkColorHandler'
        ).and.returnValue(mockedColorManager);

        plugin.initialize(mockedInnerEditor);

        expect(onInitializeSpy).toHaveBeenCalledWith({
            customData: {},
            experimentalFeatures: [],
            sizeTransformer: jasmine.anything(),
            darkColorHandler: mockedColorManager,
            edit: 'edit',
            contextMenuProviders: [],
        } as any);
        expect(createDarkColorHandlerSpy).toHaveBeenCalledWith(mockedInnerDarkColorHandler);
        expect(initializeV8Spy).toHaveBeenCalledTimes(1);
        expect(initializeV9Spy).toHaveBeenCalledTimes(1);
        expect(disposeSpy).not.toHaveBeenCalled();
        expect(initializeV8Spy).toHaveBeenCalledWith(mockedEditor);
        expect(initializeV9Spy).toHaveBeenCalledWith(mockedInnerEditor);
        expect(onPluginEventV8Spy).not.toHaveBeenCalled();
        expect(onPluginEventV9Spy).not.toHaveBeenCalled();
        expect(willHandleEventExclusivelyV8Spy).not.toHaveBeenCalled();
        expect(willHandleEventExclusivelyV9Spy).not.toHaveBeenCalled();

        plugin.onPluginEvent({
            eventType: 'editorReady',
            addedBlockElements: [],
            removedBlockElements: [],
        });

        expect(onPluginEventV8Spy).toHaveBeenCalledTimes(1);
        expect(onPluginEventV9Spy).toHaveBeenCalledTimes(1);
        expect(onPluginEventV8Spy).toHaveBeenCalledWith({
            eventType: PluginEventType.EditorReady,
            eventDataCache: undefined,
        });
        expect(onPluginEventV9Spy).toHaveBeenCalledWith({
            eventType: 'editorReady',
            addedBlockElements: [],
            removedBlockElements: [],
            eventDataCache: undefined,
        });
        expect(willHandleEventExclusivelyV8Spy).toHaveBeenCalledTimes(1);
        expect(willHandleEventExclusivelyV9Spy).toHaveBeenCalledTimes(1);

        plugin.dispose();

        expect(disposeSpy).toHaveBeenCalledTimes(1);
    });

    it('MixedPlugin with event that is not supported in v8', () => {
        const initializeV8Spy = jasmine.createSpy('initializeV8');
        const initializeV9Spy = jasmine.createSpy('initializeV9');
        const onPluginEventV8Spy = jasmine.createSpy('onPluginEventV8');
        const onPluginEventV9Spy = jasmine.createSpy('onPluginEventV9');
        const willHandleEventExclusivelyV8Spy = jasmine.createSpy('willHandleEventExclusivelyV8');
        const willHandleEventExclusivelyV9Spy = jasmine.createSpy('willHandleEventExclusivelyV9');
        const disposeSpy = jasmine.createSpy('dispose');

        const mockedPlugin = {
            initialize: initializeV8Spy,
            initializeV9: initializeV9Spy,
            onPluginEvent: onPluginEventV8Spy,
            onPluginEventV9: onPluginEventV9Spy,
            willHandleEventExclusively: willHandleEventExclusivelyV8Spy,
            willHandleEventExclusivelyV9: willHandleEventExclusivelyV9Spy,
            dispose: disposeSpy,
            getName: () => '',
        } as any;
        const mockedEditor = {} as any;
        const onInitializeSpy = jasmine.createSpy('onInitialize').and.returnValue(mockedEditor);
        const plugin = new BridgePlugin.BridgePlugin(onInitializeSpy, [mockedPlugin]);

        expect(initializeV8Spy).not.toHaveBeenCalled();
        expect(initializeV9Spy).not.toHaveBeenCalled();
        expect(onPluginEventV8Spy).not.toHaveBeenCalled();
        expect(onPluginEventV9Spy).not.toHaveBeenCalled();
        expect(disposeSpy).not.toHaveBeenCalled();
        expect(onInitializeSpy).not.toHaveBeenCalled();
        expect(willHandleEventExclusivelyV8Spy).not.toHaveBeenCalled();
        expect(willHandleEventExclusivelyV9Spy).not.toHaveBeenCalled();

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
            getEnvironment: () => {
                return {
                    domToModelSettings: {
                        customized: {},
                    },
                };
            },
            getDocument: () => document,
        } as any;

        const createDarkColorHandlerSpy = spyOn(
            DarkColorHandler,
            'createDarkColorHandler'
        ).and.returnValue(mockedColorManager);

        plugin.initialize(mockedInnerEditor);

        expect(onInitializeSpy).toHaveBeenCalledWith({
            customData: {},
            experimentalFeatures: [],
            sizeTransformer: jasmine.anything(),
            darkColorHandler: mockedColorManager,
            edit: 'edit',
            contextMenuProviders: [],
        } as any);
        expect(createDarkColorHandlerSpy).toHaveBeenCalledWith(mockedInnerDarkColorHandler);
        expect(initializeV8Spy).toHaveBeenCalledTimes(1);
        expect(initializeV9Spy).toHaveBeenCalledTimes(1);
        expect(disposeSpy).not.toHaveBeenCalled();
        expect(initializeV8Spy).toHaveBeenCalledWith(mockedEditor);
        expect(initializeV9Spy).toHaveBeenCalledWith(mockedInnerEditor);
        expect(onPluginEventV8Spy).not.toHaveBeenCalled();
        expect(onPluginEventV9Spy).not.toHaveBeenCalled();
        expect(willHandleEventExclusivelyV8Spy).not.toHaveBeenCalled();
        expect(willHandleEventExclusivelyV9Spy).not.toHaveBeenCalled();

        plugin.onPluginEvent({
            eventType: 'rewriteFromModel',
            addedBlockElements: [],
            removedBlockElements: [],
        });

        expect(onPluginEventV8Spy).toHaveBeenCalledTimes(0);
        expect(onPluginEventV9Spy).toHaveBeenCalledTimes(1);
        expect(onPluginEventV9Spy).toHaveBeenCalledWith({
            eventType: 'rewriteFromModel',
            addedBlockElements: [],
            removedBlockElements: [],
            eventDataCache: {
                __OldEventFromNewEvent: undefined,
                __ExclusivelyHandleEventPlugin: null,
            },
        });
        expect(willHandleEventExclusivelyV8Spy).toHaveBeenCalledTimes(0);
        expect(willHandleEventExclusivelyV9Spy).toHaveBeenCalledTimes(1);

        plugin.dispose();

        expect(disposeSpy).toHaveBeenCalledTimes(1);
    });
});
