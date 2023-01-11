import { ContentModelSegmentFormat } from '../publicTypes/format/ContentModelSegmentFormat';
import { createText } from '../modelApi/creators/createText';
import { EditorPlugin, IEditor, Keys, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { IExperimentalContentModelEditor } from '../publicTypes/IExperimentalContentModelEditor';
import { iterateSelections } from '../modelApi/selection/iterateSelections';

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
            let format: ContentModelSegmentFormat | null;

            if (
                ((event.eventType == PluginEventType.Input && !event.rawEvent.isComposing) ||
                    event.eventType == PluginEventType.CompositionEnd) &&
                event.rawEvent.data &&
                (format = this.editor.getPendingFormat())
            ) {
                applyPendingFormat(this.editor, event.rawEvent.data, format);
                this.editor.setPendingFormat(null);
            }

            if (
                (event.eventType == PluginEventType.KeyDown &&
                    event.rawEvent.which >= Keys.PAGEUP &&
                    event.rawEvent.which <= Keys.DOWN) ||
                event.eventType == PluginEventType.MouseDown ||
                event.eventType == PluginEventType.ContentChanged
            ) {
                this.editor.setPendingFormat(null);
            }
        }
    }
}

function applyPendingFormat(
    editor: IExperimentalContentModelEditor,
    data: string,
    format: ContentModelSegmentFormat
) {
    const model = editor.createContentModel();

    iterateSelections([model], (_, __, block, segments) => {
        if (
            block?.blockType == 'Paragraph' &&
            segments?.length == 1 &&
            segments[0].segmentType == 'SelectionMarker'
        ) {
            const index = block.segments.indexOf(segments[0]);
            const previousSegment = block.segments[index - 1];

            if (previousSegment?.segmentType == 'Text') {
                const text = previousSegment.text;

                if (text.substr(-data.length, data.length) == data) {
                    previousSegment.text = text.substring(0, text.length - data.length);

                    const newText = createText(data, {
                        ...previousSegment.format,
                        ...format,
                    });

                    block.segments.splice(index, 0, newText);
                }
            }
        }
        return true;
    });

    editor.setContentModel(model);
}
