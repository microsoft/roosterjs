import { EditorPlugin, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { findClosestElementAncestor, Position } from 'roosterjs-editor-dom';

/**
 * @internal
 * Typing Component helps to ensure typing is always happening under a DOM container
 */
export default class TypeInContainerPlugin implements EditorPlugin {
    private editor: IEditor;

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'TypeInContainer';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (event.eventType == PluginEventType.KeyPress) {
            // If normalization was not possible before the keypress,
            // check again after the keyboard event has been processed by browser native behaviour.
            //
            // This handles the case where the keyboard event that first inserts content happens when
            // there is already content under the selection (e.g. Ctrl+a -> type new content).
            //
            // Only scheudle when the range is not collapsed to catch this edge case.
            let range = this.editor.getSelectionRange();

            if (!range || this.editor.contains(findClosestElementAncestor(range.startContainer))) {
                return;
            }

            if (range.collapsed) {
                this.editor.ensureTypeInContainer(Position.getStart(range), event.rawEvent);
            } else {
                this.editor.runAsync(editor => {
                    editor.ensureTypeInContainer(editor.getFocusedPosition(), event.rawEvent);
                });
            }
        }
    }
}
