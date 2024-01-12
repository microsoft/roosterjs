import { EditorPlugin, PluginEvent, StandaloneEditorCore } from 'roosterjs-content-model-types';
import { triggerEvent } from '../../lib/coreApi/triggerEvent';

describe('triggerEvent', () => {
    let div: HTMLDivElement;
    let core: StandaloneEditorCore;

    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);

        core = {
            contentDiv: div,
            api: {},
            plugins: [],
            lifecycle: {},
        } as any;
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('no plugin', () => {
        triggerEvent(core, createDefaultEvent(), false);
        expect();
    });

    it('one plugin handle event', () => {
        const onPluginEvent = jasmine.createSpy();
        core.plugins.push(createPlugin(onPluginEvent));
        const event = createDefaultEvent();
        triggerEvent(core, event, false);
        expect(onPluginEvent).toHaveBeenCalledWith(event);
    });

    it('two plugins handle event', () => {
        const onPluginEvent1 = jasmine.createSpy();
        const onPluginEvent2 = jasmine.createSpy();

        core.plugins.push(createPlugin(onPluginEvent1), createPlugin(onPluginEvent2));

        const event = createDefaultEvent();

        triggerEvent(core, event, false);

        expect(onPluginEvent1).toHaveBeenCalledWith(event);
        expect(onPluginEvent2).toHaveBeenCalledWith(event);
        expect(onPluginEvent1).toHaveBeenCalledBefore(onPluginEvent2);
    });

    it('two plugins handle event, second one will handle exclusively', () => {
        const onPluginEvent1 = jasmine.createSpy();
        const onPluginEvent2 = jasmine.createSpy();
        const handleExclusively2 = jasmine.createSpy().and.returnValue(true);

        core.plugins.push(
            createPlugin(onPluginEvent1),
            createPlugin(onPluginEvent2, handleExclusively2)
        );

        const event = createDefaultEvent();
        triggerEvent(core, event, false);
        expect(handleExclusively2).toHaveBeenCalledWith(event);
        expect(onPluginEvent1).not.toHaveBeenCalled();
        expect(onPluginEvent2).toHaveBeenCalledWith(event);
        expect(handleExclusively2).toHaveBeenCalledBefore(onPluginEvent2);
    });

    it('broadcast event, skip exclusive handling', () => {
        const onPluginEvent1 = jasmine.createSpy();
        const onPluginEvent2 = jasmine.createSpy();
        const handleExclusively2 = jasmine.createSpy().and.returnValue(true);

        core.plugins.push(
            createPlugin(onPluginEvent1),
            createPlugin(onPluginEvent2, handleExclusively2)
        );

        const event = createDefaultEvent();
        triggerEvent(core, event, true);
        expect(handleExclusively2).not.toHaveBeenCalled();
        expect(onPluginEvent1).toHaveBeenCalledWith(event);
        expect(onPluginEvent2).toHaveBeenCalledWith(event);
        expect(onPluginEvent1).toHaveBeenCalledBefore(onPluginEvent2);
    });

    it('shadow edit', () => {
        const onPluginEvent = jasmine.createSpy();

        core.plugins.push(createPlugin(onPluginEvent));
        const event = createDefaultEvent('keyDown');

        core.lifecycle.shadowEditFragment = document.createDocumentFragment();

        triggerEvent(core, event, false);
        expect(onPluginEvent).not.toHaveBeenCalled();
    });

    it('shadow edit with BeforeDispose event', () => {
        const onPluginEvent = jasmine.createSpy();

        core.plugins.push(createPlugin(onPluginEvent));

        const event = createDefaultEvent('beforeDispose');
        core.lifecycle.shadowEditFragment = document.createDocumentFragment();
        triggerEvent(core, event, false);
        expect(onPluginEvent).toHaveBeenCalled();
    });
});

function createDefaultEvent(
    type: 'editorReady' | 'beforeDispose' | 'keyDown' = 'beforeDispose'
): PluginEvent {
    return <PluginEvent>(<any>{ eventType: type });
}

function createPlugin(onPluginEvent: any, willHandleEventExclusively?: any): EditorPlugin {
    return {
        getName: null!,
        initialize: null!,
        dispose: null!,
        onPluginEvent,
        willHandleEventExclusively,
    };
}
