import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { getPendingFormat } from '../../modelApi/format/pendingFormat';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { isCharacterValue, Position } from 'roosterjs-editor-dom';
import { setPendingFormat } from '../../modelApi/format/pendingFormat';
import {
    EditorPlugin,
    IEditor,
    PluginEvent,
    PluginEventType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

// During IME input, KeyDown event will have "Process" as key
const ProcessKey = 'Process';

/**
 * ContentModelTypeInContainer plugin helps editor handle keyDown event and make sure typing happens
 * under a valid container with default format applied. This is a replacement of original ContentModelTypeInContainer plugin
 */
export default class ContentModelTypeInContainerPlugin implements EditorPlugin {
    private editor: IContentModelEditor | null = null;

    /**
     * Get name of this plugin
     */
    getName() {
        return 'ContentModelTypeInContainer';
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

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        const editor = this.editor;

        if (
            editor &&
            event.eventType == PluginEventType.KeyDown &&
            (isCharacterValue(event.rawEvent) || event.rawEvent.key == ProcessKey)
        ) {
            const range = editor.getSelectionRangeEx();

            if (
                range.type == SelectionRangeTypes.Normal &&
                range.ranges[0]?.collapsed &&
                !editor.contains(range.ranges[0].startContainer)
            ) {
                const pendingFormat = getPendingFormat(editor) || {};
                const defaultFormat = editor.getContentModelDefaultFormat();
                const newFormat: ContentModelSegmentFormat = {
                    ...defaultFormat,
                    ...pendingFormat,
                };

                setPendingFormat(editor, newFormat, Position.getStart(range.ranges[0]));
            }
        }
    }
}
