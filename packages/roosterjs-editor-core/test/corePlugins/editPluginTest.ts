import EditPlugin from '../../lib/corePlugins/EditPlugin';
import { EditPluginState, IEditor, Keys, PluginEventType } from 'roosterjs-editor-types';

describe('EditPlugin', () => {
    let plugin: EditPlugin;
    let state: EditPluginState;

    beforeEach(() => {
        plugin = new EditPlugin();
        state = plugin.getState();
        plugin.initialize(<IEditor>(<any>{
            getSelectionRange: () => ({
                collapsed: true,
            }),
        }));
    });

    afterEach(() => {
        plugin.dispose();
    });

    it('init and dispose', () => {
        expect(Object.keys(state.features).length).toBe(0);
    });

    it('no features handler event because key does not match', () => {
        const shouldHandleEvent = jasmine.createSpy('shouldHandleEvent').and.returnValue(false);
        const handleEvent = jasmine.createSpy('handleEvent');
        state.features[Keys.ENTER] = [
            {
                keys: [Keys.ENTER],
                shouldHandleEvent,
                handleEvent,
            },
        ];

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <any>{
                which: Keys.DELETE,
            },
        });

        expect(shouldHandleEvent).not.toHaveBeenCalled();
        expect(handleEvent).not.toHaveBeenCalled();
    });

    it('no features handler event because it should not', () => {
        const shouldHandleEvent = jasmine.createSpy('shouldHandleEvent').and.returnValue(false);
        const handleEvent = jasmine.createSpy('handleEvent');
        state.features[Keys.ENTER] = [
            {
                keys: [Keys.ENTER],
                shouldHandleEvent,
                handleEvent,
            },
        ];

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <any>{
                which: Keys.ENTER,
            },
        });

        expect(shouldHandleEvent).toHaveBeenCalled();
        expect(handleEvent).not.toHaveBeenCalled();
    });

    it('one feature handlers event', () => {
        const shouldHandleEvent = jasmine.createSpy('shouldHandleEvent').and.returnValue(true);
        const handleEvent = jasmine.createSpy('handleEvent');
        state.features[Keys.ENTER] = [
            {
                keys: [Keys.ENTER],
                shouldHandleEvent,
                handleEvent,
            },
        ];

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <any>{
                which: Keys.ENTER,
            },
        });

        expect(shouldHandleEvent).toHaveBeenCalled();
        expect(handleEvent).toHaveBeenCalled();
    });

    it('multiple features, one handlers event', () => {
        const shouldHandleEvent1 = jasmine.createSpy('shouldHandleEvent1').and.returnValue(true);
        const handleEvent1 = jasmine.createSpy('handleEvent1');
        const shouldHandleEvent2 = jasmine.createSpy('shouldHandleEvent2').and.returnValue(false);
        const handleEvent2 = jasmine.createSpy('handleEvent2');
        const shouldHandleEvent3 = jasmine.createSpy('shouldHandleEvent3').and.returnValue(true);
        const handleEvent3 = jasmine.createSpy('handleEvent3');
        state.features[Keys.DELETE] = [
            {
                keys: [Keys.DELETE],
                shouldHandleEvent: shouldHandleEvent1,
                handleEvent: handleEvent1,
            },
        ];
        state.features[Keys.ENTER] = [
            {
                keys: [Keys.ENTER],
                shouldHandleEvent: shouldHandleEvent2,
                handleEvent: handleEvent2,
            },
            {
                keys: [Keys.ENTER],
                shouldHandleEvent: shouldHandleEvent3,
                handleEvent: handleEvent3,
            },
        ];

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <any>{
                which: Keys.ENTER,
            },
        });

        expect(shouldHandleEvent1).not.toHaveBeenCalled();
        expect(handleEvent1).not.toHaveBeenCalled();
        expect(shouldHandleEvent2).toHaveBeenCalled();
        expect(handleEvent2).not.toHaveBeenCalled();
        expect(shouldHandleEvent3).toHaveBeenCalled();
        expect(handleEvent3).toHaveBeenCalled();
    });

    it('multiple features should handle, the first one handlers event', () => {
        const shouldHandleEvent1 = jasmine.createSpy('shouldHandleEvent1').and.returnValue(true);
        const handleEvent1 = jasmine.createSpy('handleEvent1');
        const shouldHandleEvent2 = jasmine.createSpy('shouldHandleEvent2').and.returnValue(true);
        const handleEvent2 = jasmine.createSpy('handleEvent2');
        const shouldHandleEvent3 = jasmine.createSpy('shouldHandleEvent3').and.returnValue(true);
        const handleEvent3 = jasmine.createSpy('handleEvent3');
        state.features[Keys.DELETE] = [
            {
                keys: [Keys.DELETE],
                shouldHandleEvent: shouldHandleEvent1,
                handleEvent: handleEvent1,
            },
        ];
        state.features[Keys.ENTER] = [
            {
                keys: [Keys.ENTER],
                shouldHandleEvent: shouldHandleEvent2,
                handleEvent: handleEvent2,
            },
            {
                keys: [Keys.ENTER],
                shouldHandleEvent: shouldHandleEvent3,
                handleEvent: handleEvent3,
            },
        ];

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <any>{
                which: Keys.ENTER,
            },
        });

        expect(shouldHandleEvent1).not.toHaveBeenCalled();
        expect(handleEvent1).not.toHaveBeenCalled();
        expect(shouldHandleEvent2).toHaveBeenCalled();
        expect(handleEvent2).toHaveBeenCalled();
        expect(shouldHandleEvent3).not.toHaveBeenCalled();
        expect(handleEvent3).not.toHaveBeenCalled();
    });

    it('allow function key', () => {
        const shouldHandleEvent1 = jasmine.createSpy('shouldHandleEvent1').and.returnValue(true);
        const handleEvent1 = jasmine.createSpy('handleEvent1');
        const shouldHandleEvent2 = jasmine.createSpy('shouldHandleEvent2').and.returnValue(true);
        const handleEvent2 = jasmine.createSpy('handleEvent2');
        state.features[Keys.ENTER] = [
            {
                keys: [Keys.ENTER],
                shouldHandleEvent: shouldHandleEvent1,
                handleEvent: handleEvent1,
            },
            {
                keys: [Keys.ENTER],
                shouldHandleEvent: shouldHandleEvent2,
                handleEvent: handleEvent2,
                allowFunctionKeys: true,
            },
        ];

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <any>{
                which: Keys.ENTER,
                altKey: true,
            },
        });

        expect(shouldHandleEvent1).not.toHaveBeenCalled();
        expect(handleEvent1).not.toHaveBeenCalled();
        expect(shouldHandleEvent2).toHaveBeenCalled();
        expect(handleEvent2).toHaveBeenCalled();
    });

    it('multiple keys', () => {
        const shouldHandleEvent1 = jasmine.createSpy('shouldHandleEvent1').and.returnValue(true);
        const handleEvent1 = jasmine.createSpy('handleEvent1');
        const feature = {
            keys: [Keys.ENTER, Keys.SPACE],
            shouldHandleEvent: shouldHandleEvent1,
            handleEvent: handleEvent1,
        };
        state.features[Keys.ENTER] = [feature];
        state.features[Keys.SPACE] = [feature];

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <any>{
                which: Keys.SPACE,
            },
        });

        expect(shouldHandleEvent1).toHaveBeenCalled();
        expect(handleEvent1).toHaveBeenCalled();
    });

    it('content changed event feature', () => {
        const shouldHandleEvent1 = jasmine.createSpy('shouldHandleEvent1').and.returnValue(true);
        const handleEvent1 = jasmine.createSpy('handleEvent1');
        const feature = {
            keys: [Keys.ENTER, Keys.SPACE, Keys.CONTENTCHANGED],
            shouldHandleEvent: shouldHandleEvent1,
            handleEvent: handleEvent1,
        };

        state.features[Keys.ENTER] = [feature];
        state.features[Keys.SPACE] = [feature];
        state.features[Keys.CONTENTCHANGED] = [feature];

        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: '',
        });

        expect(shouldHandleEvent1).toHaveBeenCalled();
        expect(handleEvent1).toHaveBeenCalled();
    });
});
