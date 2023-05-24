import { EditorPlugin, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import {
    Browser,
    findClosestElementAncestor,
    getTagOfNode,
    isCtrlOrMetaPressed,
    Position,
} from 'roosterjs-editor-dom';

/**
 * @internal
 * Typing Component helps to ensure typing is always happening under a DOM container
 */
export default class TypeInContainerPlugin implements EditorPlugin {
    private editor: IEditor | null = null;

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

    private isRangeEmpty(range: Range) {
        if (
            range.collapsed &&
            range.startContainer.nodeType === Node.ELEMENT_NODE &&
            getTagOfNode(range.startContainer) == 'DIV' &&
            !range.startContainer.firstChild
        ) {
            return true;
        }
        return false;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        // We need to check if the ctrl key or the meta key is pressed,
        // browsers like Safari fire the "keypress" event when the meta key is pressed.
        if (
            event.eventType == PluginEventType.KeyPress &&
            this.editor &&
            !(event.rawEvent && isCtrlOrMetaPressed(event.rawEvent))
        ) {
            // If normalization was not possible before the keypress,
            // check again after the keyboard event has been processed by browser native behavior.
            //
            // This handles the case where the keyboard event that first inserts content happens when
            // there is already content under the selection (e.g. Ctrl+a -> type new content).
            //
            // Only schedule when the range is not collapsed to catch this edge case.
            let range = this.editor.getSelectionRange();

            const styledAncestor =
                range &&
                findClosestElementAncestor(range.startContainer, undefined /* root */, '[style]');

            if (!range || (!this.isRangeEmpty(range) && this.editor.contains(styledAncestor))) {
                return;
            }

            if (range.collapsed) {
                this.editor.ensureTypeInContainer(Position.getStart(range), event.rawEvent);
            } else {
                const callback = () => {
                    const focusedPosition = this.editor?.getFocusedPosition();
                    if (focusedPosition) {
                        this.editor?.ensureTypeInContainer(focusedPosition, event.rawEvent);
                    }
                };

                if (Browser.isMobileOrTablet) {
                    this.editor.getDocument().defaultView?.setTimeout(callback, 100);
                } else {
                    this.editor.runAsync(callback);
                }
            }
        }
    }
}
