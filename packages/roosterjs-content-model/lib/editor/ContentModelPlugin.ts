import applyPendingFormat from '../publicApi/format/applyPendingFormat';
import deleteKey from '../publicApi/editing/deleteKey';
import getSegmentFormat from '../publicApi/format/getSegmentFormat';
import { deleteSelection } from '../modelApi/selection/deleteSelections';
import { EditorPlugin, IEditor, Keys, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { formatWithContentModel } from '../publicApi/utils/formatWithContentModel';
import { IContentModelEditor } from '../publicTypes/IContentModelEditor';
import { normalizeContentModel } from '../modelApi/common/normalizeContentModel';
// import handleDelete from '../publicApi/editing/handleDelete';
import {
    canApplyPendingFormat,
    clearPendingFormat,
    setPendingFormat,
} from '../modelApi/format/pendingFormat';

/**
 * ContentModel plugins helps editor to do editing operation on top of content model.
 * This includes:
 * 1. Handle pending format changes when selection is collapsed
 */
export default class ContentModelPlugin implements EditorPlugin {
    private editor: IContentModelEditor | null = null;

    /**
     * Construct a new instance of ContentModelPlugin
     * @param handleKeyboardEditing A temporary parameter to allow handling keyboard editing event using this plugin
     */
    constructor(private handleKeyboardEditing?: boolean) {}

    /**
     * Get name of this plugin
     */
    getName() {
        return 'ContentModel';
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

    willHandleEventExclusively(event: PluginEvent) {
        if (
            event.eventType == PluginEventType.KeyDown &&
            (event.rawEvent.which == Keys.DELETE || event.rawEvent.which == Keys.BACKSPACE)
        ) {
            return true;
        }

        return false;
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
                    this.editor.cacheContentModel(null);
                    clearPendingFormat(this.editor);
                } else if (this.handleKeyboardEditing && event.rawEvent.which == Keys.ENTER) {
                    const format = getSegmentFormat(this.editor);
                    const pos = this.editor.getFocusedPosition();

                    if (format && pos) {
                        setPendingFormat(this.editor, format, pos);
                    }
                } else if (
                    this.handleKeyboardEditing &&
                    (event.rawEvent.which == Keys.BACKSPACE || event.rawEvent.which == Keys.DELETE)
                ) {
                    const range = this.editor.getSelectionRangeEx();

                    if (range.areAllCollapsed) {
                        deleteKey(
                            this.editor,
                            event.rawEvent.which == Keys.DELETE ? 'delete' : 'backspace',
                            event.rawEvent
                        );
                    } else {
                        formatWithContentModel(this.editor, 'delete', model => {
                            deleteSelection(model);
                            normalizeContentModel(model);
                            return true;
                        });

                        event.rawEvent.preventDefault();
                    }
                } else {
                    this.editor.cacheContentModel(null);
                }

                break;

            case PluginEventType.MouseUp:
            case PluginEventType.ContentChanged:
                this.editor.cacheContentModel(null);

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
