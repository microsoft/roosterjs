import { PluginEventType, PositionType, SelectionRangeTypes } from 'roosterjs-editor-types';
import { Position, safeInstanceOf } from 'roosterjs-editor-dom';
import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-editor-types';

const Escape = 'Escape';
const Delete = 'Delete';
const mouseMiddleButton = 1;

/**
 * Detect image selection and help highlight the image
 */
export default class ImageSelection implements EditorPlugin {
    private editor: IEditor | null = null;

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'ImageSelection';
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
        this.editor?.select(null);
        this.editor = null;
    }

    onPluginEvent(event: PluginEvent) {
        if (this.editor) {
            switch (event.eventType) {
                case PluginEventType.MouseUp:
                    const target = event.rawEvent.target;
                    if (
                        safeInstanceOf(target, 'HTMLImageElement') &&
                        target.isContentEditable &&
                        event.rawEvent.button != mouseMiddleButton
                    ) {
                        this.editor.select(target);
                    }
                    break;
                case PluginEventType.MouseDown:
                    const mouseTarget = event.rawEvent.target;
                    const mouseSelection = this.editor.getSelectionRangeEx();
                    if (
                        mouseSelection &&
                        mouseSelection.type === SelectionRangeTypes.ImageSelection &&
                        mouseSelection.image !== mouseTarget
                    ) {
                        this.editor.select(null);
                    }
                    break;
                case PluginEventType.KeyDown:
                    const rawEvent = event.rawEvent;
                    const key = rawEvent.key;
                    const keyDownSelection = this.editor.getSelectionRangeEx();
                    if (
                        !rawEvent.ctrlKey &&
                        !rawEvent.altKey &&
                        !rawEvent.shiftKey &&
                        !rawEvent.metaKey &&
                        keyDownSelection.type === SelectionRangeTypes.ImageSelection
                    ) {
                        const position = new Position(keyDownSelection.image, PositionType.Before);
                        if (key === Escape && position) {
                            this.editor.select(keyDownSelection.image, PositionType.Before);
                            this.editor.getSelectionRange()?.collapse();
                            event.rawEvent.stopPropagation();
                        } else if (key === Delete) {
                            this.editor.deleteNode(keyDownSelection.image);
                            event.rawEvent.preventDefault();
                        } else if (position) {
                            this.editor.select(position);
                        }
                    }
                    break;
                case PluginEventType.ContextMenu:
                    const contextMenuTarget = event.rawEvent.target;
                    const actualSelection = this.editor.getSelectionRangeEx();
                    if (
                        safeInstanceOf(contextMenuTarget, 'HTMLImageElement') &&
                        (actualSelection.type !== SelectionRangeTypes.ImageSelection ||
                            actualSelection.image !== contextMenuTarget)
                    ) {
                        this.editor.select(contextMenuTarget);
                    }
            }
        }
    }
}
