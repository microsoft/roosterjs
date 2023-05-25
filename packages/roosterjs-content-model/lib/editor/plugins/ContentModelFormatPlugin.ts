import applyPendingFormat from '../../publicApi/format/applyPendingFormat';
import { canApplyPendingFormat, clearPendingFormat } from '../../modelApi/format/pendingFormat';
import { EditorPlugin, IEditor, Keys, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * ContentModelFormat plugins helps editor to do formatting on top of content model.
 * This includes:
 * 1. Handle pending format changes when selection is collapsed
 */
export default class ContentModelFormatPlugin implements EditorPlugin {
    private editor: IContentModelEditor | null = null;

    /**
     * Get name of this plugin
     */
    getName() {
        return 'ContentModelFormat';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IEditor) {
        // TODO: Later we may need a different interface for Content Model editor plugin
        this.editor = editor as IContentModelEditor;
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.editor = null;
    }

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        if (!this.editor) {
            return;
        }

        switch (event.eventType) {
            case PluginEventType.Input:
                // In Safari, isComposing will be undefined but isInIME() works
                if (!event.rawEvent.isComposing && !this.editor.isInIME()) {
                    this.checkAndApplyPendingFormat(event.rawEvent.data);
                }

                break;

            case PluginEventType.CompositionEnd:
                this.checkAndApplyPendingFormat(event.rawEvent.data);
                break;

            case PluginEventType.KeyDown:
                if (event.rawEvent.which >= Keys.PAGEUP && event.rawEvent.which <= Keys.DOWN) {
                    clearPendingFormat(this.editor);
                }

                break;

            case PluginEventType.MouseUp:
            case PluginEventType.ContentChanged:
                if (!canApplyPendingFormat(this.editor)) {
                    clearPendingFormat(this.editor);
                }
                break;
        }
    }

    private checkAndApplyPendingFormat(data: string | null) {
        if (this.editor && data) {
            applyPendingFormat(this.editor, data);
            clearPendingFormat(this.editor);
        }
    }
}
