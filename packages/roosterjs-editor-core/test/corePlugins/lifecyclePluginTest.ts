import LifecyclePlugin from '../../lib/corePlugins/lifecycle/LifecyclePlugin';
import { IEditor, PluginEventType } from 'roosterjs-editor-types';

describe('LifecyclePlugin', () => {
    it('init', () => {
        const div = document.createElement('div');
        const plugin = new LifecyclePlugin({}, div);
        const calcDefaultFormat = jasmine.createSpy('calcDefaultFormat');
        const triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        const state = plugin.getState();

        plugin.initialize(<IEditor>(<any>{
            calcDefaultFormat,
            triggerPluginEvent,
            setContent: (content: string) => (div.innerHTML = content),
            getFocusedPosition: () => <any>null,
        }));

        expect(state.value).toEqual({
            customData: {},
            defaultFormat: null,
        });

        expect(calcDefaultFormat).toHaveBeenCalled();
        expect(div.isContentEditable).toBeTrue();
        expect(div.style.userSelect).toBe('text');
        expect(div.innerHTML).toBe('');
        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(triggerPluginEvent.calls.argsFor(0)[0]).toBe(PluginEventType.EditorReady);
        expect(triggerPluginEvent.calls.argsFor(0)[1].startPosition.node).toBe(div);
        expect(triggerPluginEvent.calls.argsFor(0)[1].startPosition.offset).toBe(0);

        plugin.dispose();
        expect(div.isContentEditable).toBeFalse();
    });

    it('init with options', () => {
        const div = document.createElement('div');
        const plugin = new LifecyclePlugin(
            {
                defaultFormat: {
                    fontFamily: 'arial',
                },
                initialContent: 'test',
            },
            div
        );
        const calcDefaultFormat = jasmine.createSpy('calcDefaultFormat');
        const triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        const state = plugin.getState();

        plugin.initialize(<IEditor>(<any>{
            calcDefaultFormat,
            triggerPluginEvent,
            setContent: (content: string) => (div.innerHTML = content),
            getFocusedPosition: () => <any>null,
        }));

        expect(state.value).toEqual({
            customData: {},
            defaultFormat: {
                fontFamily: 'arial',
            },
        });

        expect(calcDefaultFormat).toHaveBeenCalled();
        expect(div.isContentEditable).toBeTrue();
        expect(div.style.userSelect).toBe('text');
        expect(div.innerHTML).toBe('test');
        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(triggerPluginEvent.calls.argsFor(0)[0]).toBe(PluginEventType.EditorReady);
        expect(triggerPluginEvent.calls.argsFor(0)[1].startPosition.node).toBe(div);
        expect(triggerPluginEvent.calls.argsFor(0)[1].startPosition.offset).toBe(0);

        plugin.dispose();
        expect(div.isContentEditable).toBeFalse();
    });

    it('init with DIV which already has contenteditable attribute', () => {
        const div = document.createElement('div');
        div.contentEditable = 'true';
        const plugin = new LifecyclePlugin({}, div);
        const calcDefaultFormat = jasmine.createSpy('calcDefaultFormat');
        const triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');

        plugin.initialize(<IEditor>(<any>{
            calcDefaultFormat,
            triggerPluginEvent,
            setContent: (content: string) => (div.innerHTML = content),
            getFocusedPosition: () => <any>null,
        }));

        expect(div.isContentEditable).toBeTrue();
        expect(div.style.userSelect).toBe('');
        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(triggerPluginEvent.calls.argsFor(0)[0]).toBe(PluginEventType.EditorReady);
        expect(triggerPluginEvent.calls.argsFor(0)[1].startPosition.node).toBe(div);
        expect(triggerPluginEvent.calls.argsFor(0)[1].startPosition.offset).toBe(0);

        plugin.dispose();
        expect(div.isContentEditable).toBeTrue();
    });

    it('init with DIV which already has contenteditable attribute and set to false', () => {
        const div = document.createElement('div');
        div.contentEditable = 'false';
        const plugin = new LifecyclePlugin({}, div);
        const calcDefaultFormat = jasmine.createSpy('calcDefaultFormat');
        const triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');

        plugin.initialize(<IEditor>(<any>{
            calcDefaultFormat,
            triggerPluginEvent,
            setContent: (content: string) => (div.innerHTML = content),
            getFocusedPosition: () => <any>null,
        }));

        expect(div.isContentEditable).toBeFalse();
        expect(div.style.userSelect).toBe('');
        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(triggerPluginEvent.calls.argsFor(0)[0]).toBe(PluginEventType.EditorReady);
        expect(triggerPluginEvent.calls.argsFor(0)[1].startPosition.node).toBe(div);
        expect(triggerPluginEvent.calls.argsFor(0)[1].startPosition.offset).toBe(0);

        plugin.dispose();
        expect(div.isContentEditable).toBeFalse();
    });
});
