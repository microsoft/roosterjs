import { safeInstanceOf } from 'roosterjs-editor-dom';

import {
    EditorPlugin,
    IEditor,
    PluginEvent,
    PluginEventType,
    PositionType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

const Escape = 'Escape';
const Delete = 'Delete';
const mouseLeftButton = 0;

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
                case PluginEventType.EnteredShadowEdit:
                case PluginEventType.LeavingShadowEdit:
                    const selection = this.editor.getSelectionRangeEx();
                    if (selection.type == SelectionRangeTypes.ImageSelection) {
                        this.editor.select(selection.image);
                    }
                    break;

                case PluginEventType.MouseUp:
                    const target = event.rawEvent.target;
                    if (
                        safeInstanceOf(target, 'HTMLImageElement') &&
                        event.rawEvent.button === mouseLeftButton
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
                case PluginEventType.KeyUp:
                    const key = event.rawEvent.key;
                    const keyDownSelection = this.editor.getSelectionRangeEx();
                    if (keyDownSelection.type === SelectionRangeTypes.ImageSelection) {
                        if (key === Escape) {
                            this.editor.select(keyDownSelection.image, PositionType.Before);
                            this.editor.getSelectionRange()?.collapse();
                            event.rawEvent.stopPropagation();
                        } else if (key === Delete) {
                            this.editor.deleteNode(keyDownSelection.image);
                            event.rawEvent.preventDefault();
                        } else {
                            this.editor.select(keyDownSelection.ranges[0]);
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
