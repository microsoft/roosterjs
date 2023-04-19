import * as handleBackspaceKey from '../../../lib/publicApi/editing/handleBackspaceKey';
import * as handleDeleteKey from '../../../lib/publicApi/editing/handleDeleteKey';
import ContentModelEditPlugin from '../../../lib/editor/plugins/ContentModelEditPlugin';
import { EntityOperation, Keys, PluginEventType } from 'roosterjs-editor-types';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

describe('ContentModelEditPlugin', () => {
    let editor: IContentModelEditor;

    beforeEach(() => {
        editor = ({} as any) as IContentModelEditor;
    });

    describe('onPluginEvent', () => {
        let handleBackspaceKeySpy: jasmine.Spy;
        let handleDeleteKeySpy: jasmine.Spy;

        beforeEach(() => {
            handleBackspaceKeySpy = spyOn(handleBackspaceKey, 'default');
            handleDeleteKeySpy = spyOn(handleDeleteKey, 'default');
        });

        it('Backspace', () => {
            const plugin = new ContentModelEditPlugin();
            const rawEvent = { which: Keys.BACKSPACE } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent,
            });

            expect(handleBackspaceKeySpy).toHaveBeenCalledWith(editor, rawEvent, []);
            expect(handleDeleteKeySpy).not.toHaveBeenCalled();
        });

        it('Delete', () => {
            const plugin = new ContentModelEditPlugin();
            const rawEvent = { which: Keys.DELETE } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent,
            });

            expect(handleBackspaceKeySpy).not.toHaveBeenCalled();
            expect(handleDeleteKeySpy).toHaveBeenCalledWith(editor, rawEvent, []);
        });

        it('Other key', () => {
            const plugin = new ContentModelEditPlugin();
            const rawEvent = { which: 41 } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent,
            });

            expect(handleBackspaceKeySpy).not.toHaveBeenCalled();
            expect(handleDeleteKeySpy).not.toHaveBeenCalled();
        });

        it('Default prevented', () => {
            const plugin = new ContentModelEditPlugin();
            const rawEvent = { which: Keys.DELETE, defaultPrevented: true } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent,
            });

            expect(handleBackspaceKeySpy).not.toHaveBeenCalled();
            expect(handleDeleteKeySpy).not.toHaveBeenCalled();
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

            expect(handleBackspaceKeySpy).not.toHaveBeenCalled();
            expect(handleDeleteKeySpy).toHaveBeenCalledTimes(1);
            expect(handleDeleteKeySpy).toHaveBeenCalledWith(editor, { which: Keys.DELETE } as any, [
                {
                    eventType: PluginEventType.EntityOperation,
                    operation: EntityOperation.Overwrite,
                    rawEvent: {
                        type: 'keydown',
                    } as any,
                    entity: wrapper,
                },
            ]);

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: { which: Keys.DELETE } as any,
            });

            expect(handleDeleteKeySpy).toHaveBeenCalledTimes(2);
            expect(handleDeleteKeySpy).toHaveBeenCalledWith(
                editor,
                { which: Keys.DELETE } as any,
                []
            );
        });
    });
});
