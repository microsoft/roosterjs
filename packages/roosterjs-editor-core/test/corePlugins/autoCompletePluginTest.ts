import AutoCompletePlugin from '../../lib/corePlugins/autoComplete/AutoCompletePlugin';
import Editor from '../../lib/editor/Editor';
import { Keys } from '../../lib/interfaces/ContentEditFeature';
import { PluginEvent, PluginEventType, Wrapper } from 'roosterjs-editor-types';

describe('AutoCompletePlugin', () => {
    let plugin: AutoCompletePlugin;
    let state: Wrapper<string>;
    let setContent: jasmine.Spy;

    beforeEach(() => {
        plugin = new AutoCompletePlugin();
        setContent = jasmine.createSpy('setContent');
        state = plugin.getState();
        plugin.initialize(<Editor>(<any>{
            setContent,
        }));
    });

    afterEach(() => {
        plugin.dispose();
    });

    it('init and dispose', () => {
        expect(state.value).toBeNull();
    });

    it('handle event not exclusively when no snapshot cached', () => {
        [
            PluginEventType.EditorReady,
            PluginEventType.BeforeDispose,
            PluginEventType.BeforePaste,
            PluginEventType.CompositionEnd,
            PluginEventType.DarkModeChanged,
            PluginEventType.EntityOperation,
            PluginEventType.ExtractContentWithDom,
            PluginEventType.Input,
            PluginEventType.KeyPress,
            PluginEventType.KeyUp,
            PluginEventType.MouseUp,
            PluginEventType.PendingFormatStateChanged,
            PluginEventType.Scroll,
            PluginEventType.ContentChanged,
            PluginEventType.MouseDown,
        ].forEach(eventType => {
            state.value = null;
            const result = plugin.willHandleEventExclusively(<PluginEvent>{
                eventType,
            });

            expect(result).toBeFalsy();
        });

        state.value = null;
        const result = plugin.willHandleEventExclusively(<PluginEvent>{
            eventType: PluginEventType.KeyDown,
            rawEvent: {},
        });

        expect(result).toBeFalsy();
    });

    it('handle unrelated event not exclusively when snapshot cached', () => {
        const content = 'test';
        [
            PluginEventType.EditorReady,
            PluginEventType.BeforeDispose,
            PluginEventType.BeforePaste,
            PluginEventType.CompositionEnd,
            PluginEventType.DarkModeChanged,
            PluginEventType.EntityOperation,
            PluginEventType.ExtractContentWithDom,
            PluginEventType.Input,
            PluginEventType.KeyPress,
            PluginEventType.KeyUp,
            PluginEventType.MouseUp,
            PluginEventType.PendingFormatStateChanged,
            PluginEventType.Scroll,
            PluginEventType.ContentChanged,
            PluginEventType.MouseDown,
        ].forEach(eventType => {
            state.value = content;

            const result = plugin.willHandleEventExclusively(<PluginEvent>{
                eventType,
            });

            expect(result).toBeFalsy();
            expect(state.value).toBe(content);
        });

        state.value = content;
        expect(
            plugin.willHandleEventExclusively({
                eventType: PluginEventType.KeyDown,
                rawEvent: <KeyboardEvent>{
                    which: Keys.ENTER,
                },
            })
        ).toBeFalsy();
        expect(state.value).toBe(content);
    });

    it('handle related event exclusively when snapshot cached', () => {
        const content = 'test';
        state.value = content;
        expect(
            plugin.willHandleEventExclusively({
                eventType: PluginEventType.KeyDown,
                rawEvent: <KeyboardEvent>{
                    which: Keys.BACKSPACE,
                },
            })
        ).toBeTruthy();
        expect(state.value).toBe(content);
    });

    it('snapshot is not reset after unrelated events', () => {
        const content = 'test';

        [
            PluginEventType.EditorReady,
            PluginEventType.BeforeDispose,
            PluginEventType.BeforePaste,
            PluginEventType.CompositionEnd,
            PluginEventType.DarkModeChanged,
            PluginEventType.EntityOperation,
            PluginEventType.ExtractContentWithDom,
            PluginEventType.Input,
            PluginEventType.KeyPress,
            PluginEventType.KeyUp,
            PluginEventType.MouseUp,
            PluginEventType.PendingFormatStateChanged,
            PluginEventType.Scroll,
        ].forEach(eventType => {
            state.value = content;

            plugin.onPluginEvent(<PluginEvent>{
                eventType,
            });

            expect(state.value).toBe(content);
            expect(setContent).not.toHaveBeenCalled();
        });
    });

    it('snapshot is reset after mouse down or content changed', () => {
        const content = 'test';

        [PluginEventType.ContentChanged, PluginEventType.MouseDown].forEach(eventType => {
            state.value = content;

            plugin.onPluginEvent(<PluginEvent>{
                eventType,
            });

            expect(state.value).toBeNull();
            expect(setContent).not.toHaveBeenCalled();
        });
    });

    it('snapshot is reset after keydown with other keys', () => {
        const content = 'test';
        state.value = content;

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <KeyboardEvent>{
                which: Keys.ENTER,
            },
        });

        expect(state.value).toBeNull();
        expect(setContent).not.toHaveBeenCalled();
    });

    it('set content after backspace', () => {
        const content = 'test';
        state.value = content;
        const preventDefault = jasmine.createSpy('preventDefault');

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <any>{
                which: Keys.BACKSPACE,
                preventDefault,
            },
        });

        expect(setContent).toHaveBeenCalledWith(content);
        expect(preventDefault).toHaveBeenCalled();
    });
});
