import Editor from '../../lib/editor/Editor';
import MouseUpPlugin from '../../lib/corePlugins/mouseUp/MouseUpPlugin';
import { PluginEventType } from 'roosterjs-editor-types';

describe('MouseUpPlugin', () => {
    let plugin: MouseUpPlugin;
    let addEventListener: jasmine.Spy;
    let removeEventListener: jasmine.Spy;
    let triggerPluginEvent: jasmine.Spy;
    let mouseUp: any = null;

    beforeEach(() => {
        addEventListener = jasmine
            .createSpy('addEventListener')
            .and.callFake((name, fn) => (mouseUp = fn));
        removeEventListener = jasmine.createSpy('.removeEventListener');
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        plugin = new MouseUpPlugin();
        plugin.initialize(<Editor>(<any>{
            getDocument: () => ({
                addEventListener,
                removeEventListener,
            }),
            triggerPluginEvent,
        }));
    });

    afterEach(() => {
        plugin.dispose();
        mouseUp = null;
    });

    it('Trigger mouse down event', () => {
        plugin.onPluginEvent({
            eventType: PluginEventType.MouseDown,
            rawEvent: null,
        });
        expect(addEventListener).toHaveBeenCalledTimes(1);
        expect(addEventListener.calls.argsFor(0)[0]).toBe('mouseup');
        expect(addEventListener.calls.argsFor(0)[2]).toBe(true);
    });

    it('Trigger mouse up event', () => {
        expect(mouseUp).toBeNull();
        plugin.onPluginEvent({
            eventType: PluginEventType.MouseDown,
            rawEvent: null,
        });
        expect(mouseUp).not.toBeNull();

        const rawEvent = {};
        mouseUp(rawEvent);
        expect(removeEventListener).toHaveBeenCalled();
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.MouseUp, { rawEvent });
    });

    it('Do not add event handler if it is already added', () => {
        plugin.onPluginEvent({
            eventType: PluginEventType.MouseDown,
            rawEvent: null,
        });
        plugin.onPluginEvent({
            eventType: PluginEventType.MouseDown,
            rawEvent: null,
        });

        expect(addEventListener).toHaveBeenCalledTimes(1);
    });
});
