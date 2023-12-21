import * as selectionConvert from '../../lib/editor/utils/selectionConverter';
import { BridgePlugin } from '../../lib/corePlugins/BridgePlugin';
import { PluginEventType } from 'roosterjs-editor-types';

describe('EventTypeTranslatePlugin', () => {
    let convertDomSelectionToRangeExSpy: jasmine.Spy;
    const mockedDOMSelection = 'DOMSELECTION' as any;
    const mockedRangeEx = 'RANGEEX' as any;

    beforeEach(() => {
        convertDomSelectionToRangeExSpy = spyOn(
            selectionConvert,
            'convertDomSelectionToRangeEx'
        ).and.returnValue(mockedRangeEx);
    });

    it('Ctor and init', () => {
        const plugin = new BridgePlugin();
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

        plugin.addWrapperPlugin([mockedPlugin1, mockedPlugin2]);

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(onPluginEventSpy1).not.toHaveBeenCalled();
        expect(onPluginEventSpy2).not.toHaveBeenCalled();
        expect(disposeSpy).not.toHaveBeenCalled();

        plugin.setOuterEditor(mockedEditor);

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
        const plugin = new BridgePlugin();
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

        plugin.addWrapperPlugin([mockedPlugin1, mockedPlugin2]);
        plugin.setOuterEditor(mockedEditor);

        const mockedEvent = {} as any;
        const result = plugin.willHandleEventExclusively(mockedEvent);

        expect(result).toBeTrue();
        expect(mockedEvent).toEqual({
            eventDataCache: {
                __ExclusivelyHandleEventPlugin: mockedPlugin2,
            },
        });

        plugin.onPluginEvent(mockedEvent);

        expect(onPluginEventSpy1).toHaveBeenCalledTimes(1);
        expect(onPluginEventSpy2).toHaveBeenCalledTimes(2);

        expect(onPluginEventSpy1).toHaveBeenCalledWith({
            eventType: PluginEventType.EditorReady,
        });
        expect(onPluginEventSpy2).toHaveBeenCalledWith({
            eventType: PluginEventType.EditorReady,
        });
        expect(onPluginEventSpy2).toHaveBeenCalledWith(mockedEvent);

        const mockedEvent2 = {
            eventType: 'MockedEvent2',
        } as any;

        plugin.onPluginEvent(mockedEvent2);

        expect(onPluginEventSpy1).toHaveBeenCalledWith(mockedEvent2);
        expect(onPluginEventSpy2).toHaveBeenCalledWith(mockedEvent2);
        expect(mockedEvent2).toEqual({
            eventType: 'MockedEvent2',
        });

        plugin.dispose();
    });

    it('translate a SelectionChanged event without selection', () => {
        const plugin = new BridgePlugin();

        plugin.initialize();

        const event = {
            eventType: PluginEventType.SelectionChanged,
            selectionRangeEx: null,
        } as any;

        plugin.onPluginEvent(event);

        expect(event).toEqual({
            eventType: PluginEventType.SelectionChanged,
            selectionRangeEx: null,
        });
        expect(convertDomSelectionToRangeExSpy).not.toHaveBeenCalled();
    });

    it('translate a SelectionChanged event', () => {
        const plugin = new BridgePlugin();

        plugin.initialize();

        const event = {
            eventType: PluginEventType.SelectionChanged,
            selectionRangeEx: null,
            newSelection: mockedDOMSelection,
        } as any;

        plugin.onPluginEvent(event);

        expect(event).toEqual({
            eventType: PluginEventType.SelectionChanged,
            selectionRangeEx: mockedRangeEx,
            newSelection: mockedDOMSelection,
        });
        expect(convertDomSelectionToRangeExSpy).toHaveBeenCalledWith(mockedDOMSelection);
    });
});
