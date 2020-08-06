import Editor from '../../editor/Editor';
import { PluginEventType, Wrapper } from 'roosterjs-editor-types';
import PendingFormatStatePlugin, {
    PendingFormatStatePluginState,
} from '../../corePlugins/pendingFormatState/PendingFormatStatePlugin';

describe('PendingFormatStatePlugin', () => {
    let plugin: PendingFormatStatePlugin;
    let state: Wrapper<PendingFormatStatePluginState>;

    beforeEach(() => {
        plugin = new PendingFormatStatePlugin();
        state = plugin.getState();
        plugin.initialize(<Editor>(<any>{
            getSelectionRange: () => document.createRange(),
        }));
    });

    afterEach(() => {
        plugin.dispose();
    });

    it('init and dispose', () => {
        expect(state.value).toEqual({
            pendableFormatPosition: null,
            pendableFormatState: null,
        });
    });

    it('clean up when keydown and position changed', () => {
        state.value.pendableFormatPosition = <any>{
            equalTo: () => false,
        };
        state.value.pendableFormatState = <any>{};
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: null,
        });
        expect(state.value.pendableFormatPosition).toBeNull();
        expect(state.value.pendableFormatState).toBeNull();
    });

    it('do not clean up when key down and position not changed', () => {
        const position = <any>{
            equalTo: () => true,
        };
        const formatState = <any>{};
        state.value.pendableFormatPosition = position;
        state.value.pendableFormatState = formatState;
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: null,
        });

        expect(state.value.pendableFormatPosition).toBe(position);
        expect(state.value.pendableFormatState).toBe(formatState);
    });

    it('clean up when mouse down and position changed', () => {
        state.value.pendableFormatPosition = <any>{
            equalTo: () => false,
        };
        state.value.pendableFormatState = <any>{};
        plugin.onPluginEvent({
            eventType: PluginEventType.MouseDown,
            rawEvent: null,
        });
        expect(state.value.pendableFormatPosition).toBeNull();
        expect(state.value.pendableFormatState).toBeNull();
    });

    it('do not clean up when mouse down and position not changed', () => {
        const position = <any>{
            equalTo: () => true,
        };
        const formatState = <any>{};
        state.value.pendableFormatPosition = position;
        state.value.pendableFormatState = formatState;
        plugin.onPluginEvent({
            eventType: PluginEventType.MouseDown,
            rawEvent: null,
        });

        expect(state.value.pendableFormatPosition).toBe(position);
        expect(state.value.pendableFormatState).toBe(formatState);
    });

    it('clean up when content change and position changed', () => {
        state.value.pendableFormatPosition = <any>{
            equalTo: () => false,
        };
        state.value.pendableFormatState = <any>{};
        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: null,
        });
        expect(state.value.pendableFormatPosition).toBeNull();
        expect(state.value.pendableFormatState).toBeNull();
    });

    it('do not clean up when content change and position not changed', () => {
        const position = <any>{
            equalTo: () => true,
        };
        const formatState = <any>{};
        state.value.pendableFormatPosition = position;
        state.value.pendableFormatState = formatState;
        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: null,
        });

        expect(state.value.pendableFormatPosition).toBe(position);
        expect(state.value.pendableFormatState).toBe(formatState);
    });

    it('cache format state and position when PendingFormatStateChanged', () => {
        expect(state.value.pendableFormatPosition).toBeNull();
        expect(state.value.pendableFormatState).toBeNull();
        const formatState = <any>{};

        plugin.onPluginEvent({
            eventType: PluginEventType.PendingFormatStateChanged,
            formatState,
        });

        expect(state.value.pendableFormatPosition).not.toBeNull();
        expect(state.value.pendableFormatState).toBe(formatState);
    });
});
