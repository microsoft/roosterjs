import LifecyclePlugin from '../../lib/corePlugins/LifecyclePlugin';
import { ChangeSource, IEditor, NodePosition, PluginEventType } from 'roosterjs-editor-types';

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
        }));

        expect(state.defaultFormat.textColor).toBe('');
        expect(state.defaultFormat.backgroundColor).toBe('');

        // Reset these getters, we can ignore them since we have already verified them
        delete state.defaultFormat.textColor;
        delete state.defaultFormat.backgroundColor;

        expect(state).toEqual({
            customData: {},
            defaultFormat: {
                fontFamily: '',
                fontSize: '',
                textColors: undefined,
                backgroundColors: undefined,
                bold: undefined,
                italic: undefined,
                underline: undefined,
            },
            isDarkMode: false,
            onExternalContentTransform: undefined,
            experimentalFeatures: [],
            shadowEditSelectionPath: null,
            shadowEditFragment: null,
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
        }));

        expect(state).toEqual({
            customData: {},
            defaultFormat: {
                fontFamily: 'arial',
                fontSize: '',
                textColor: '',
                textColors: undefined,
                backgroundColor: '',
                backgroundColors: undefined,
                bold: undefined,
                italic: undefined,
                underline: undefined,
            },
            isDarkMode: false,
            onExternalContentTransform: undefined,
            experimentalFeatures: [],
            shadowEditFragment: null,
            shadowEditSelectionPath: null,
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
        }));

        expect(div.isContentEditable).toBeFalse();
        expect(div.style.userSelect).toBe('');
        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(triggerPluginEvent.calls.argsFor(0)[0]).toBe(PluginEventType.EditorReady);

        plugin.dispose();
        expect(div.isContentEditable).toBeFalse();
    });
});

describe('recalculateDefaultFormat', () => {
    let div: HTMLDivElement;
    let plugin: LifecyclePlugin;

    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
        div.style.fontFamily = 'arial';
        div.style.fontSize = '14pt';
        div.style.color = 'black';
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('get default format', () => {
        plugin = new LifecyclePlugin({}, div);
        expect(plugin.getState().defaultFormat).toBeNull();
    });

    it('no default format, light mode', () => {
        plugin = new LifecyclePlugin({}, div);
        plugin.initialize(<IEditor>(<any>{
            setContent: () => {},
            triggerPluginEvent: () => {},
            getFocusedPosition: () => <NodePosition>null,
        }));

        expect(plugin.getState().defaultFormat).toEqual({
            fontFamily: 'arial',
            fontSize: '14pt',
            textColor: 'rgb(0, 0, 0)',
            textColors: undefined,
            backgroundColor: '',
            backgroundColors: undefined,
            bold: undefined,
            italic: undefined,
            underline: undefined,
        });
    });

    it('no default format, dark mode', () => {
        plugin = new LifecyclePlugin({ inDarkMode: true }, div);
        plugin.initialize(<IEditor>(<any>{
            setContent: () => {},
            triggerPluginEvent: () => {},
            getFocusedPosition: () => <NodePosition>null,
        }));

        // First time it initials the default format
        expect(plugin.getState().defaultFormat).toEqual({
            fontFamily: 'arial',
            fontSize: '14pt',
            textColor: 'rgb(0, 0, 0)',
            textColors: undefined,
            backgroundColor: '',
            backgroundColors: undefined,
            bold: undefined,
            italic: undefined,
            underline: undefined,
        });

        // Second time it calculate default format for dark mode
        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: ChangeSource.SwitchToDarkMode,
        });
        expect(plugin.getState().isDarkMode).toBeTrue();
        expect(plugin.getState().defaultFormat).toEqual({
            fontFamily: 'arial',
            fontSize: '14pt',
            textColor: 'rgb(255,255,255)',
            textColors: {
                darkModeColor: 'rgb(255,255,255)',
                lightModeColor: 'rgb(0,0,0)',
            },
            backgroundColor: 'rgb(51,51,51)',
            backgroundColors: {
                darkModeColor: 'rgb(51,51,51)',
                lightModeColor: 'rgb(255,255,255)',
            },
            bold: undefined,
            italic: undefined,
            underline: undefined,
        });
    });

    it('has default format, light mode', () => {
        plugin = new LifecyclePlugin(
            {
                defaultFormat: {
                    bold: true,
                    fontFamily: 'arial',
                },
            },
            div
        );
        plugin.initialize(<IEditor>(<any>{
            setContent: () => {},
            triggerPluginEvent: () => {},
            getFocusedPosition: () => <NodePosition>null,
        }));

        expect(plugin.getState().defaultFormat).toEqual({
            fontFamily: 'arial',
            fontSize: '14pt',
            textColor: 'rgb(0, 0, 0)',
            textColors: undefined,
            backgroundColor: '',
            backgroundColors: undefined,
            bold: true,
            italic: undefined,
            underline: undefined,
        });
    });

    it('has default format, dark mode', () => {
        plugin = new LifecyclePlugin(
            {
                inDarkMode: true,
                defaultFormat: {
                    bold: true,
                    fontFamily: 'arial',
                },
            },
            div
        );
        plugin.initialize(<IEditor>(<any>{
            setContent: () => {},
            triggerPluginEvent: () => {},
            getFocusedPosition: () => <NodePosition>null,
        }));

        expect(plugin.getState().defaultFormat).toEqual({
            fontFamily: 'arial',
            fontSize: '14pt',
            textColor: 'rgb(255,255,255)',
            textColors: { darkModeColor: 'rgb(255,255,255)', lightModeColor: 'rgb(0,0,0)' },
            backgroundColor: 'rgb(51,51,51)',
            backgroundColors: {
                darkModeColor: 'rgb(51,51,51)',
                lightModeColor: 'rgb(255,255,255)',
            },
            bold: true,
            italic: undefined,
            underline: undefined,
        });
    });

    it('has empty default format', () => {
        plugin = new LifecyclePlugin(
            {
                defaultFormat: {},
            },
            div
        );
        plugin.initialize(<IEditor>(<any>{
            setContent: () => {},
            triggerPluginEvent: () => {},
            getFocusedPosition: () => <NodePosition>null,
        }));

        expect(plugin.getState().defaultFormat).toEqual({});

        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: ChangeSource.SwitchToDarkMode,
        });

        expect(plugin.getState().isDarkMode).toBeTrue();
        expect(plugin.getState().defaultFormat).toEqual({
            fontFamily: 'arial',
            fontSize: '14pt',
            textColor: 'rgb(255,255,255)',
            textColors: { darkModeColor: 'rgb(255,255,255)', lightModeColor: 'rgb(0,0,0)' },
            backgroundColor: 'rgb(51,51,51)',
            backgroundColors: {
                darkModeColor: 'rgb(51,51,51)',
                lightModeColor: 'rgb(255,255,255)',
            },
            bold: undefined,
            italic: undefined,
            underline: undefined,
        });
    });
});
