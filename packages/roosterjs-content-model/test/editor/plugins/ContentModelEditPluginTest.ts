import * as handleBackspaceKey from '../../../lib/publicApi/editing/handleBackspaceKey';
import * as handleDeleteKey from '../../../lib/publicApi/editing/handleDeleteKey';
import ContentModelEditPlugin from '../../../lib/editor/plugins/ContentModelEditPlugin';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import { Keys, PluginEventType } from 'roosterjs-editor-types';

describe('ContentModelEditPlugin', () => {
    let editor: IContentModelEditor;

    beforeEach(() => {
        editor = ({} as any) as IContentModelEditor;
    });

    describe('willHandleEventExclusively', () => {
        it('Handle other events', () => {
            const plugin = new ContentModelEditPlugin();

            plugin.initialize(editor);

            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.EditorReady,
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.KeyPress,
                    rawEvent: {} as any,
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.KeyUp,
                    rawEvent: {} as any,
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.Input,
                    rawEvent: {} as any,
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.CompositionEnd,
                    rawEvent: {} as any,
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.MouseDown,
                    rawEvent: {} as any,
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.MouseUp,
                    rawEvent: {} as any,
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.ContentChanged,
                    source: '',
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.ExtractContentWithDom,
                    clonedRoot: {} as any,
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.BeforeCutCopy,
                    rawEvent: {} as any,
                    clonedRoot: {} as any,
                    range: {} as any,
                    isCut: false,
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.BeforePaste,
                    clipboardData: {} as any,
                    fragment: {} as any,
                    sanitizingOption: {} as any,
                    htmlBefore: {} as any,
                    htmlAfter: {} as any,
                    htmlAttributes: {} as any,
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.BeforeDispose,
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.PendingFormatStateChanged,
                    formatState: {} as any,
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.Scroll,
                    scrollContainer: {} as any,
                    rawEvent: {} as any,
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.EntityOperation,
                    operation: {} as any,
                    entity: {} as any,
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.ContextMenu,
                    items: {} as any,
                    rawEvent: {} as any,
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.EnteredShadowEdit,
                    fragment: {} as any,
                    selectionPath: {} as any,
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.LeavingShadowEdit,
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.EditImage,
                    image: {} as any,
                    originalSrc: {} as any,
                    previousSrc: {} as any,
                    newSrc: {} as any,
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.BeforeSetContent,
                    newContent: '',
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.ZoomChanged,
                    oldZoomScale: 1,
                    newZoomScale: 2,
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.SelectionChanged,
                    selectionRangeEx: {} as any,
                })
            ).toBeFalse();
        });

        it('Handle KeyDown events', () => {
            const plugin = new ContentModelEditPlugin();

            plugin.initialize(editor);

            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.KeyDown,
                    rawEvent: ({
                        which: Keys.ESCAPE,
                    } as any) as KeyboardEvent,
                })
            ).toBeFalse();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.KeyDown,
                    rawEvent: ({
                        which: Keys.DELETE,
                    } as any) as KeyboardEvent,
                })
            ).toBeTrue();
            expect(
                plugin.willHandleEventExclusively({
                    eventType: PluginEventType.KeyDown,
                    rawEvent: ({
                        which: Keys.BACKSPACE,
                    } as any) as KeyboardEvent,
                })
            ).toBeTrue();
        });
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

            expect(handleBackspaceKeySpy).toHaveBeenCalledWith(editor, rawEvent);
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
            expect(handleDeleteKeySpy).toHaveBeenCalledWith(editor, rawEvent);
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
    });
});
