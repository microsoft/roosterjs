import * as keyboardDelete from '../../../lib/publicApi/editing/keyboardDelete';
import ContentModelEditPlugin from '../../../lib/editor/plugins/ContentModelEditPlugin';
import { EntityOperation, Keys, PluginEventType } from 'roosterjs-editor-types';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

describe('ContentModelEditPlugin', () => {
    let editor: IContentModelEditor;

    beforeEach(() => {
        editor = ({
            getDOMSelection: () =>
                ({
                    type: -1,
                } as any), // Force return invalid range to go through content model code
        } as any) as IContentModelEditor;
    });

    describe('onPluginEvent', () => {
        let keyboardDeleteSpy: jasmine.Spy;

        beforeEach(() => {
            keyboardDeleteSpy = spyOn(keyboardDelete, 'default').and.returnValue(true);
        });

        it('Backspace', () => {
            const plugin = new ContentModelEditPlugin();
            const rawEvent = { which: Keys.BACKSPACE } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent,
            });

            expect(keyboardDeleteSpy).toHaveBeenCalledWith(editor, rawEvent);
        });

        it('Delete', () => {
            const plugin = new ContentModelEditPlugin();
            const rawEvent = { which: Keys.DELETE } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent,
            });

            expect(keyboardDeleteSpy).toHaveBeenCalledWith(editor, rawEvent);
        });

        it('Other key', () => {
            const plugin = new ContentModelEditPlugin();
            const rawEvent = { which: 41 } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent,
            });

            expect(keyboardDeleteSpy).not.toHaveBeenCalled();
        });

        it('Default prevented', () => {
            const plugin = new ContentModelEditPlugin();
            const rawEvent = { which: Keys.DELETE, defaultPrevented: true } as any;

            plugin.initialize(editor);
            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent,
            });

            expect(keyboardDeleteSpy).not.toHaveBeenCalled();
        });

        it('Trigger entity event first', () => {
            const plugin = new ContentModelEditPlugin();
            const wrapper = 'WRAPPER' as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: PluginEventType.EntityOperation,
                operation: EntityOperation.Overwrite,
                rawEvent: {
                    type: 'keydown',
                } as any,
                entity: wrapper,
            });

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: { which: Keys.DELETE } as any,
            });

            expect(keyboardDeleteSpy).toHaveBeenCalledWith(editor, {
                which: Keys.DELETE,
            } as any);

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: { which: Keys.DELETE } as any,
            });

            expect(keyboardDeleteSpy).toHaveBeenCalledTimes(2);
            expect(keyboardDeleteSpy).toHaveBeenCalledWith(editor, {
                which: Keys.DELETE,
            } as any);
        });

        it('SelectionChanged event should clear cached model', () => {
            const plugin = new ContentModelEditPlugin();

            plugin.initialize(editor);
            plugin.onPluginEvent({
                eventType: PluginEventType.SelectionChanged,
                selectionRangeEx: null!,
            });
        });

        it('keyboardDelete returns false', () => {
            const plugin = new ContentModelEditPlugin();

            keyboardDeleteSpy.and.returnValue(false);

            plugin.initialize(editor);
            plugin.onPluginEvent({
                eventType: PluginEventType.SelectionChanged,
                selectionRangeEx: null!,
            });
        });
    });
});
