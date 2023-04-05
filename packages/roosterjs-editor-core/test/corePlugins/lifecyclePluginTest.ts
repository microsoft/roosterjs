import LifecyclePlugin from '../../lib/corePlugins/LifecyclePlugin';
import { DarkColorHandler, IEditor, PluginEventType } from 'roosterjs-editor-types';

describe('LifecyclePlugin', () => {
    const getDarkColor = (color: string) => color;
    it('init', () => {
        const div = document.createElement('div');
        const plugin = new LifecyclePlugin({ getDarkColor }, div);
        const triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        const state = plugin.getState();

        plugin.initialize(<IEditor>(<any>{
            triggerPluginEvent,
            setContent: (content: string) => (div.innerHTML = content),
            getFocusedPosition: () => <any>null,
            getDarkColorHandler: () => <DarkColorHandler | null>null,
        }));

        expect(state.defaultFormat).toBeNull();

        expect(state).toEqual({
            customData: {},
            defaultFormat: null,
            isDarkMode: false,
            onExternalContentTransform: null,
            experimentalFeatures: [],
            shadowEditSelectionPath: null,
            shadowEditFragment: null,
            shadowEditTableSelectionPath: null,
            shadowEditImageSelectionPath: null,
            shadowEditEntities: null,
            getDarkColor,
        });

        expect(div.isContentEditable).toBeTrue();
        expect(div.style.userSelect).toBe('text');
        expect(div.innerHTML).toBe('');
        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(triggerPluginEvent.calls.argsFor(0)[0]).toBe(PluginEventType.EditorReady);

        plugin.dispose();
        expect(div.isContentEditable).toBeFalse();
    });

    it('init with options', () => {
        const div = document.createElement('div');
        const plugin = new LifecyclePlugin(
            {
                getDarkColor,
                defaultFormat: {
                    fontFamily: 'arial',
                },
                initialContent: 'test',
            },
            div
        );
        const triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        const state = plugin.getState();

        plugin.initialize(<IEditor>(<any>{
            triggerPluginEvent,
            setContent: (content: string) => (div.innerHTML = content),
            getFocusedPosition: () => <any>null,
            getDarkColorHandler: () => <DarkColorHandler | null>null,
        }));

        expect(state).toEqual({
            customData: {},
            defaultFormat: {
                fontFamily: 'arial',
            },
            isDarkMode: false,
            onExternalContentTransform: null,
            experimentalFeatures: [],
            shadowEditFragment: null,
            shadowEditSelectionPath: null,
            shadowEditTableSelectionPath: null,
            shadowEditImageSelectionPath: null,
            shadowEditEntities: null,
            getDarkColor,
        });

        expect(div.isContentEditable).toBeTrue();
        expect(div.style.userSelect).toBe('text');
        expect(div.innerHTML).toBe('test');
        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(triggerPluginEvent.calls.argsFor(0)[0]).toBe(PluginEventType.EditorReady);

        plugin.dispose();
        expect(div.isContentEditable).toBeFalse();
    });

    it('init with DIV which already has contenteditable attribute', () => {
        const div = document.createElement('div');
        div.contentEditable = 'true';
        const plugin = new LifecyclePlugin({}, div);
        const triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');

        plugin.initialize(<IEditor>(<any>{
            triggerPluginEvent,
            setContent: (content: string) => (div.innerHTML = content),
            getFocusedPosition: () => <any>null,
            getDarkColorHandler: () => <DarkColorHandler | null>null,
        }));

        expect(div.isContentEditable).toBeTrue();
        expect(div.style.userSelect).toBe('');
        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(triggerPluginEvent.calls.argsFor(0)[0]).toBe(PluginEventType.EditorReady);

        plugin.dispose();
        expect(div.isContentEditable).toBeTrue();
    });

    it('init with DIV which already has contenteditable attribute and set to false', () => {
        const div = document.createElement('div');
        div.contentEditable = 'false';
        const plugin = new LifecyclePlugin({}, div);
        const triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');

        plugin.initialize(<IEditor>(<any>{
            triggerPluginEvent,
            setContent: (content: string) => (div.innerHTML = content),
            getFocusedPosition: () => <any>null,
            getDarkColorHandler: () => <DarkColorHandler | null>null,
        }));

        expect(div.isContentEditable).toBeFalse();
        expect(div.style.userSelect).toBe('');
        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(triggerPluginEvent.calls.argsFor(0)[0]).toBe(PluginEventType.EditorReady);

        plugin.dispose();
        expect(div.isContentEditable).toBeFalse();
    });
});
