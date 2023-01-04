import { createText } from '../modelApi/creators/createText';
import { EditorPlugin, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { getSelections } from '../modelApi/selection/getSelections';
import { IExperimentalContentModelEditor } from '../publicTypes/IExperimentalContentModelEditor';
import { isCharacterValue } from 'roosterjs-editor-dom';

/**
 * ContentModel plugins helps editor to do editing operation on top of content model.
 * This includes:
 * 1. Handle pending format changes when selection is collapsed
 */
export default class ContentModelPlugin implements EditorPlugin<IExperimentalContentModelEditor> {
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
    initialize(editor: IExperimentalContentModelEditor) {
        this.editor = editor;
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.editor = null;
    }

    onPluginEvent(event: PluginEvent) {
        if (this.editor && event.eventType == PluginEventType.KeyDown) {
            if (isCharacterValue(event.rawEvent)) {
                const model = this.editor.getCurrentContentModel();
                const selections = model ? getSelections(model) : [];

                if (
                    model &&
                    selections.length == 1 &&
                    selections[0].paragraph &&
                    selections[0].segments.length == 1 &&
                    selections[0].segments[0].segmentType == 'SelectionMarker'
                ) {
                    const { paragraph, segments } = selections[0];
                    const text = createText(event.rawEvent.key, segments[0].format);
                    const index = paragraph.segments.indexOf(segments[0]);

                    if (index >= 0) {
                        paragraph.segments.splice(index, 0, text);
                        this.editor.setContentModel(model);
                        event.rawEvent.preventDefault();
                    }
                }
            }

            this.editor.setCurrentContentModel(null);
        }
    }
}
