import PendingFormatStatePlugin from '../../lib/corePlugins/PendingFormatStatePlugin';
import { IEditor, PendingFormatStatePluginState, PluginEventType } from 'roosterjs-editor-types';

describe('PendingFormatStatePlugin', () => {
    let plugin: PendingFormatStatePlugin;
    let state: PendingFormatStatePluginState;

    beforeEach(() => {
        plugin = new PendingFormatStatePlugin();
        state = plugin.getState();
        plugin.initialize(<IEditor>(<any>{
            getSelectionRange: () => document.createRange(),
        }));
    });

    afterEach(() => {
        plugin.dispose();
    });

    it('init and dispose', () => {
        expect(state).toEqual({
            pendableFormatPosition: null,
            pendableFormatState: null,
            pendableFormatSpan: null,
        });
    });

    it('clean up when keydown and position changed', () => {
        state.pendableFormatPosition = <any>{
            equalTo: () => false,
        };
        state.pendableFormatState = <any>{};
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: ({} as any) as KeyboardEvent,
        });
        expect(state.pendableFormatPosition).toBeNull();
        expect(state.pendableFormatState).toBeNull();
    });

    it('do not clean up when key down and position not changed', () => {
        const position = <any>{
            equalTo: () => true,
        };
        const formatState = <any>{};
        state.pendableFormatPosition = position;
        state.pendableFormatState = formatState;
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: ({} as any) as KeyboardEvent,
        });

        expect(state.pendableFormatPosition).toBe(position);
        expect(state.pendableFormatState).toBe(formatState);
    });

    it('clean up when mouse down and position changed', () => {
        state.pendableFormatPosition = <any>{
            equalTo: () => false,
        };
        state.pendableFormatState = <any>{};
        plugin.onPluginEvent({
            eventType: PluginEventType.MouseDown,
            rawEvent: null,
        });
        expect(state.pendableFormatPosition).toBeNull();
        expect(state.pendableFormatState).toBeNull();
    });

    it('do not clean up when mouse down and position not changed', () => {
        const position = <any>{
            equalTo: () => true,
        };
        const formatState = <any>{};
        state.pendableFormatPosition = position;
        state.pendableFormatState = formatState;
        plugin.onPluginEvent({
            eventType: PluginEventType.MouseDown,
            rawEvent: null,
        });

        expect(state.pendableFormatPosition).toBe(position);
        expect(state.pendableFormatState).toBe(formatState);
    });

    it('clean up when content change and position changed', () => {
        state.pendableFormatPosition = <any>{
            equalTo: () => false,
        };
        state.pendableFormatState = <any>{};
        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: null,
        });
        expect(state.pendableFormatPosition).toBeNull();
        expect(state.pendableFormatState).toBeNull();
    });

    it('do not clean up when content change and position not changed', () => {
        const position = <any>{
            equalTo: () => true,
        };
        const formatState = <any>{};
        state.pendableFormatPosition = position;
        state.pendableFormatState = formatState;
        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: null,
        });

        expect(state.pendableFormatPosition).toBe(position);
        expect(state.pendableFormatState).toBe(formatState);
    });

    it('cache format state and position when PendingFormatStateChanged', () => {
        expect(state.pendableFormatPosition).toBeNull();
        expect(state.pendableFormatState).toBeNull();
        const formatState = <any>{};

        plugin.onPluginEvent({
            eventType: PluginEventType.PendingFormatStateChanged,
            formatState,
        });

        expect(state.pendableFormatPosition).not.toBeNull();
        expect(state.pendableFormatState).toBe(formatState);
    });
});
