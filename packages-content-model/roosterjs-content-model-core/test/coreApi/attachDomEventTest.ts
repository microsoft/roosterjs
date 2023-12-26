import { attachDomEvent } from '../../lib/coreApi/attachDomEvent';
import { PluginEventType } from 'roosterjs-editor-types';
import { StandaloneEditorCore } from 'roosterjs-content-model-types';

describe('attachDomEvent', () => {
    let div: HTMLDivElement;
    let core: StandaloneEditorCore;

    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
        core = {
            contentDiv: div,
            api: {},
        } as any;
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('null input', () => {
        const disposer = attachDomEvent(core, null!);
        expect(disposer).not.toBeNull();
    });

    it('empty input', () => {
        const disposer = attachDomEvent(core, {});
        expect(typeof disposer).toBe('function');
    });

    it('Check return value to be a function', () => {
        const disposer = attachDomEvent(core, {
            keydown: { pluginEventType: null, beforeDispatch: null },
        });
        expect(typeof disposer).toBe('function');

        disposer();
    });

    it('Check event is fired', () => {
        const callback = jasmine.createSpy();

        const disposer = attachDomEvent(core, { keydown: { beforeDispatch: callback } });
        const event = document.createEvent('KeyboardEvent');
        event.initEvent('keydown');
        div.dispatchEvent(event);

        expect(callback).toHaveBeenCalledWith(event);
        disposer();
    });

    it('Check event dispatched via triggerEvent', () => {
        const triggerEventSpy = jasmine.createSpy();

        core.api.triggerEvent = triggerEventSpy;

        const disposer = attachDomEvent(core, {
            keydown: { pluginEventType: PluginEventType.KeyDown },
        });
        const event = document.createEvent('KeyboardEvent');
        event.initEvent('keydown');
        div.dispatchEvent(event);

        expect(triggerEventSpy).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.KeyDown,
                rawEvent: event,
            },
            false
        );
        disposer();
    });

    it('Check event dispatched via triggerEvent and callback', () => {
        const triggerEventSpy = jasmine.createSpy();
        const callback = jasmine.createSpy();

        core.api.triggerEvent = triggerEventSpy;
        const disposer = attachDomEvent(core, {
            keydown: {
                pluginEventType: PluginEventType.KeyDown,
                beforeDispatch: callback,
            },
        });
        const event = document.createEvent('KeyboardEvent');
        event.initEvent('keydown');
        div.dispatchEvent(event);

        expect(callback).toHaveBeenCalledWith(event);
        expect(triggerEventSpy).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.KeyDown,
                rawEvent: event,
            },
            false
        );
        disposer();
    });

    it('Check event not dispatched to plugin after dispose', () => {
        const triggerEventSpy = jasmine.createSpy();
        const callback = jasmine.createSpy();

        core.api.triggerEvent = triggerEventSpy;

        const disposer = attachDomEvent(core, {
            keydown: {
                pluginEventType: PluginEventType.KeyDown,
                beforeDispatch: callback,
            },
        });
        disposer();

        const event = document.createEvent('KeyboardEvent');
        event.initEvent('keydown');
        div.dispatchEvent(event);

        expect(callback).not.toHaveBeenCalled();
        expect(triggerEventSpy).not.toHaveBeenCalled();
    });
});
