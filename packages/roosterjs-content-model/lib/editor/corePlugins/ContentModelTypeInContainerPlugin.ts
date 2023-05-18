import getSegmentFormat from '../../publicApi/format/getSegmentFormat';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { getObjectKeys, Position } from 'roosterjs-editor-dom';
import { getPendingFormat } from '../../modelApi/format/pendingFormat';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { setPendingFormat } from '../../modelApi/format/pendingFormat';
import {
    EditorPlugin,
    IEditor,
    Keys,
    PluginEvent,
    PluginEventType,
    SelectionRangeEx,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

/**
 * ContentModelTypeInContainer plugin helps editor handle keyDown event and make sure typing happens
 * under a valid container with default format applied. This is a replacement of original ContentModelTypeInContainer plugin
 */
export default class ContentModelTypeInContainerPlugin implements EditorPlugin {
    private editor: IContentModelEditor | null = null;
    private effectiveDefaultFormatKeys: (keyof ContentModelSegmentFormat)[] = [];
    private needToCheckFormat = true;

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

        const defaultFormat = this.editor.getContentModelDefaultFormat();
        this.effectiveDefaultFormatKeys = getObjectKeys(defaultFormat).filter(
            key => defaultFormat[key] !== undefined
        );
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

        if (!editor) {
            return;
        }

        switch (event.eventType) {
            case PluginEventType.KeyDown:
                if (this.needToCheckFormat) {
                    this.ensureFormat(editor);
                }

                break;

            case PluginEventType.KeyUp:
                if (event.rawEvent.which >= Keys.PAGEUP && event.rawEvent.which <= Keys.DOWN) {
                    this.needToCheckFormat = true;
                    console.log('Need to check format');
                }
                break;

            case PluginEventType.MouseUp:
            case PluginEventType.ContentChanged:
                this.needToCheckFormat = true;
                console.log('Need to check format');
                break;
        }
    }

    private ensureFormat(editor: IContentModelEditor) {
        const currentFormat = getSegmentFormat(editor);
        const pendingFormat = getPendingFormat(editor) || {};
        const defaultFormat = editor.getContentModelDefaultFormat();
        const targetFormat = {
            ...currentFormat,
            ...pendingFormat,
        };
        let range: SelectionRangeEx;

        console.log('Checking format');

        if (
            this.effectiveDefaultFormatKeys.some(key => targetFormat[key] === undefined) &&
            (range = editor.getSelectionRangeEx()) &&
            range.type == SelectionRangeTypes.Normal &&
            range.ranges[0]
        ) {
            console.log('Applying format');
            setPendingFormat(
                editor,
                {
                    ...defaultFormat,
                    ...targetFormat,
                },
                Position.getStart(range.ranges[0])
            );
        }

        this.needToCheckFormat = false;
    }
}
