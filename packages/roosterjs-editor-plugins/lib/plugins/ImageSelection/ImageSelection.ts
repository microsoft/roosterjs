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
const Home = 'Home';
const PageDown = 'PageDown';
const PageUp = 'PageUp';
const End = 'End';

/**
 * Detect image selection and help highlight the image
 */
export default class ImageSelection implements EditorPlugin {
    private editor: IEditor | null = null;

    constructor() {}

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
        this.editor.select(null);
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

                case PluginEventType.MouseDown:
                    const target = event.rawEvent.target;
                    if (safeInstanceOf(target, 'HTMLImageElement')) {
                        this.editor.select(target);
                    }
                    break;
                case PluginEventType.KeyDown:
                    const key = event.rawEvent.key;
                    const keyDownSelection = this.editor.getSelectionRangeEx();
                    if (keyDownSelection.type === SelectionRangeTypes.ImageSelection) {
                        if (
                            key === Escape ||
                            key === PageDown ||
                            key === PageUp ||
                            key === Home ||
                            key === End
                        ) {
                            this.editor.select(keyDownSelection.image, PositionType.Before);
                            this.editor.getSelectionRange().collapse();
                        } else {
                            this.editor.select(keyDownSelection.ranges[0]);
                        }
                    }
                    break;
            }
        }
    }
}
