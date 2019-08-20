import createEditorCore from '../../editor/createEditorCore';
import EditorCore from '../../interfaces/EditorCore';
import EditorPlugin from '../../interfaces/EditorPlugin';
import { attachDomEvent } from '../../coreAPI/attachDomEvent';
import { PluginEvent, PluginEventType, PluginKeyboardEvent } from 'roosterjs-editor-types';

class MockPlugin implements EditorPlugin {
    lastEvent: PluginEvent = null;
    getName() {
        return 'Mock';
    }
    initialize() {}
    dispose() {}
    onPluginEvent(e: PluginEvent) {
        this.lastEvent = e;
    }
}

describe('attachDomEvent', () => {
    let div: HTMLDivElement;
    let core: EditorCore;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
        core = createEditorCore(div, {});
        (<any>core).eventHandlerPlugins = [];
    });

    afterEach(() => {
        document.body.removeChild(div);
        core = null;
        div = null;
    });

    it('Check return value to be a function', () => {
        let disposer = attachDomEvent(core, 'click');
        expect(typeof disposer).toBe('function');

        disposer();
    });

    it('Check event is fired', () => {
        let called = false;
        let disposer = attachDomEvent(core, 'keydown', null, () => {
            called = true;
        });

        let event = document.createEvent('KeyboardEvent');
        event.initEvent('keydown');
        div.dispatchEvent(event);

        expect(called).toBe(true);
        disposer();
    });

    it('Check event dispatched to plugin', () => {
        let mockPlugin = new MockPlugin();
        core.plugins.push(mockPlugin);
        core.eventHandlerPlugins.push(mockPlugin);
        expect(mockPlugin.lastEvent).toBeNull();

        let disposer = attachDomEvent(core, 'keydown', PluginEventType.KeyDown);

        let event = document.createEvent('KeyboardEvent');
        event.initEvent('keydown');
        div.dispatchEvent(event);

        expect(mockPlugin.lastEvent).not.toBeNull();
        expect(mockPlugin.lastEvent.eventType).toBe(PluginEventType.KeyDown);
        expect((<PluginKeyboardEvent>mockPlugin.lastEvent).rawEvent).toBe(event);
        disposer();
    });

    it('Check event not dispatched to plugin after dispose', () => {
        let mockPlugin = new MockPlugin();
        core.plugins.push(mockPlugin);
        core.eventHandlerPlugins.push(mockPlugin);
        expect(mockPlugin.lastEvent).toBeNull();

        let disposer = attachDomEvent(core, 'keydown', PluginEventType.KeyDown);

        let event = document.createEvent('KeyboardEvent');
        event.initEvent('keydown');

        disposer();

        div.dispatchEvent(event);

        expect(mockPlugin.lastEvent).toBeNull();
    });
});
