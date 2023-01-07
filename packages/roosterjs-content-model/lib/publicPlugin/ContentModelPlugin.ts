import { ContentModelDocument } from '../publicTypes/group/ContentModelDocument';
import { createText } from '../modelApi/creators/createText';
import { EditorPlugin, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { getCollapsedInsertPoint } from '../modelApi/selection/getCollapsedInsertPoint';
import { IExperimentalContentModelEditor } from '../publicTypes/IExperimentalContentModelEditor';
import { isCharacterValue, isModifierKey } from 'roosterjs-editor-dom';

// "Process" is the value used when type within IME
const IME_KEYDOWN_KEY = 'Process';

/**
 * ContentModel plugins helps editor to do editing operation on top of content model.
 * This includes:
 * 1. Handle pending format changes when selection is collapsed
 */
export default class ContentModelPlugin implements EditorPlugin {
    private editor: IExperimentalContentModelEditor | null = null;

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
        this.editor = editor as IExperimentalContentModelEditor;
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
        if (this.editor) {
            let model: ContentModelDocument | null;

            if (
                (event.eventType == PluginEventType.KeyDown ||
                    event.eventType == PluginEventType.CompositionEnd) &&
                (model = this.editor.getCurrentContentModel())
            ) {
                const input =
                    event.eventType == PluginEventType.CompositionEnd
                        ? event.rawEvent.data
                        : isCharacterValue(event.rawEvent)
                        ? event.rawEvent.key
                        : null;

                if (input) {
                    this.acceptInputWithPendingFormat(model, input);
                    event.rawEvent.preventDefault();
                }
            }

            if (
                event.eventType == PluginEventType.CompositionEnd ||
                event.eventType == PluginEventType.ContentChanged ||
                event.eventType == PluginEventType.MouseDown ||
                (event.eventType == PluginEventType.KeyDown &&
                    !isModifierKey(event.rawEvent) &&
                    event.rawEvent.key != IME_KEYDOWN_KEY)
            ) {
                this.editor.setCurrentContentModel(null);
            }
        }
    }

    private acceptInputWithPendingFormat(model: ContentModelDocument, char: string) {
        const insertPos = getCollapsedInsertPoint(model);

        if (insertPos) {
            const { paragraph, marker } = insertPos;
            const text = createText(char, marker.format);
            const index = paragraph.segments.indexOf(marker);

            if (index >= 0) {
                paragraph.segments.splice(index, 0, text);
                this.editor!.setContentModel(model);
            }
        }
    }
}
