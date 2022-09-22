import { safeInstanceOf } from 'roosterjs-editor-dom';
import type { CompatibleSelectionRangeTypes } from 'roosterjs-editor-types/lib/compatibleTypes';
import {
    EditorPlugin,
    IEditor,
    Keys,
    PluginEvent,
    PluginEventType,
    PositionType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

const SHIFT_KEYCODE = 16;
const CTRL_KEYCODE = 17;
const ALT_KEYCODE = 18;

/**
 * Detect image selection and help highlight the image
 */
export default class ImageSelection implements EditorPlugin {
    private editor: IEditor | null = null;
    private imageId: string | null = null;

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
        this.imageId = null;
    }

    onPluginEvent(event: PluginEvent) {
        if (this.editor) {
            switch (event.eventType) {
                case PluginEventType.EnteredShadowEdit:
                    const selection = this.editor.getSelectionRangeEx();
                    if (selection.type == SelectionRangeTypes.ImageSelection) {
                        this.editor.select(selection.image);
                        this.triggerSelectionEvent(
                            this.editor,
                            SelectionRangeTypes.ImageSelection,
                            selection.image
                        );
                    }
                    break;
                case PluginEventType.LeavingShadowEdit:
                    if (this.imageId) {
                        const images = this.editor.queryElements(
                            '#' + this.imageId
                        ) as HTMLImageElement[];
                        if (images.length == 1) {
                            const image = images[0];
                            this.editor.select(image);
                            this.triggerSelectionEvent(
                                this.editor,
                                SelectionRangeTypes.ImageSelection,
                                image
                            );
                        }
                        this.imageId = null;
                    }
                    break;
                case PluginEventType.MouseDown:
                    const target = event.rawEvent.target;
                    if (safeInstanceOf(target, 'HTMLImageElement')) {
                        this.editor.select(target);
                        this.triggerSelectionEvent(
                            this.editor,
                            SelectionRangeTypes.ImageSelection,
                            target
                        );
                        this.imageId = target.id;
                    } else {
                        const mousedownSelection = this.editor.getSelectionRangeEx();
                        this.triggerSelectionEvent(this.editor, mousedownSelection.type);
                    }
                    break;
                case PluginEventType.KeyDown:
                    const key = event.rawEvent.which;
                    const keyDownSelection = this.editor.getSelectionRangeEx();
                    if (
                        keyDownSelection.type === SelectionRangeTypes.ImageSelection &&
                        (key === Keys.ESCAPE ||
                            key === SHIFT_KEYCODE ||
                            key === CTRL_KEYCODE ||
                            key === ALT_KEYCODE ||
                            event.rawEvent.metaKey)
                    ) {
                        if (key === Keys.ESCAPE) {
                            this.editor.select(keyDownSelection.image, PositionType.Before);
                            this.editor.getSelectionRange().collapse();
                        } else if (
                            key === SHIFT_KEYCODE ||
                            key === CTRL_KEYCODE ||
                            key === ALT_KEYCODE ||
                            event.rawEvent.metaKey
                        ) {
                            this.editor.select(keyDownSelection.ranges[0]);
                        }
                        const newSelection = this.editor.getSelectionRangeEx();
                        this.triggerSelectionEvent(
                            this.editor,
                            newSelection.type,
                            undefined /** imagedSelected*/,
                            key
                        );
                    }

                    break;
            }
        }
    }

    private triggerSelectionEvent = (
        editor: IEditor,
        selectionType: SelectionRangeTypes | CompatibleSelectionRangeTypes,
        imageSelected?: HTMLImageElement,
        keyboardKey?: number
    ) => {
        editor.triggerPluginEvent(PluginEventType.SelectionChanged, {
            selectionType: selectionType,
            selectedElement: imageSelected,
            keyboardKey: keyboardKey,
        });
    };
}
