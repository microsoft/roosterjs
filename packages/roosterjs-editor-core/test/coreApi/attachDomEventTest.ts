import createEditorCore from './createMockEditorCore';
import { attachDomEvent } from '../../lib/coreApi/attachDomEvent';
import { PluginEventType } from 'roosterjs-editor-types';

const DOM_EVENT_NAME = 'keydown';

describe('attachDomEvent', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('null input', () => {
        const core = createEditorCore(div, {});
        const disposer = attachDomEvent(core, null);
        expect(disposer).not.toBeNull();
    });

    it('empty input', () => {
        const core = createEditorCore(div, {});
        const disposer = attachDomEvent(core, {});
        expect(typeof disposer).toBe('function');
    });

    it('Check return value to be a function', () => {
        const core = createEditorCore(div, {});
        const disposer = attachDomEvent(core, {
            [DOM_EVENT_NAME]: { pluginEventType: null, beforeDispatch: null },
        });
        expect(typeof disposer).toBe('function');

        disposer();
    });

    it('Check event is fired', () => {
        const callback = jasmine.createSpy();
        const core = createEditorCore(div, {});

        const disposer = attachDomEvent(core, { [DOM_EVENT_NAME]: callback });
        const event = document.createEvent('KeyboardEvent');
        event.initEvent(DOM_EVENT_NAME);
        div.dispatchEvent(event);

        expect(callback).toHaveBeenCalledWith(event);
        disposer();
    });

    it('Check event dispatched via triggerEvent', () => {
        const triggerEventSpy = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent: triggerEventSpy,
            },
        });
        const disposer = attachDomEvent(core, { [DOM_EVENT_NAME]: PluginEventType.KeyDown });
        const event = document.createEvent('KeyboardEvent');
        event.initEvent(DOM_EVENT_NAME);
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
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent: triggerEventSpy,
            },
        });
        const disposer = attachDomEvent(core, {
            [DOM_EVENT_NAME]: {
                pluginEventType: PluginEventType.KeyDown,
                beforeDispatch: callback,
            },
        });
        const event = document.createEvent('KeyboardEvent');
        event.initEvent(DOM_EVENT_NAME);
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
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent: triggerEventSpy,
            },
        });
        const disposer = attachDomEvent(core, {
            [DOM_EVENT_NAME]: {
                pluginEventType: PluginEventType.KeyDown,
                beforeDispatch: callback,
            },
        });
        disposer();

        const event = document.createEvent('KeyboardEvent');
        event.initEvent(DOM_EVENT_NAME);
        div.dispatchEvent(event);

        expect(callback).not.toHaveBeenCalled();
        expect(triggerEventSpy).not.toHaveBeenCalled();
    });
});
