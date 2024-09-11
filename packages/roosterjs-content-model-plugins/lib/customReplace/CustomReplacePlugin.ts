import { formatTextSegmentBeforeSelectionMarker } from 'roosterjs-content-model-api';
import type {
    ContentModelText,
    EditorInputEvent,
    EditorPlugin,
    IEditor,
    PluginEvent,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * The CustomReplace interface defines a custom replacement that can be used in CustomReplacePlugin.
 */
export interface CustomReplace {
    /**
     * The string to replace in the editor.
     */
    stringToReplace: string;

    /**
     * The string to replace with.
     */
    replacementString: string;

    /**
     * The handler to replace the string.
     * @param previousSegment The text segment to replace.
     * @param stringToReplace The string to replace.
     * @param replacementString The string to replace with.
     * @param paragraph The paragraph that contains the text segment.
     * @returns True if the string is replaced successfully, otherwise false.
     */
    replacementHandler: (
        previousSegment: ContentModelText,
        stringToReplace: string,
        replacementString: string,
        paragraph?: ShallowMutableContentModelParagraph
    ) => boolean;
}

/**
 * CustomReplacePlugin is a plugin that allows you to replace a string with another string in the editor.
 */
export class CustomReplacePlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private triggerKeys: string[] = [];

    /**
     * @param customReplacements Custom replacement rules.
     * Ex: [{ stringToReplace: ':)', replacementString: '🙂', replacementHandler: replaceEmojis }]
     */
    constructor(private customReplacements: CustomReplace[]) {}

    /**
     * Get name of this plugin
     */
    getName() {
        return 'CustomReplace';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.triggerKeys = this.customReplacements.map(replacement =>
            replacement.stringToReplace.slice(-1)
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
        if (this.editor) {
            switch (event.eventType) {
                case 'input':
                    this.handleEditorInputEvent(this.editor, event);
                    break;
            }
        }
    }

    private handleEditorInputEvent(editor: IEditor, event: EditorInputEvent) {
        const rawEvent = event.rawEvent;
        const selection = editor.getDOMSelection();
        const key = rawEvent.data;
        if (
            this.customReplacements.length > 0 &&
            rawEvent.inputType === 'insertText' &&
            selection &&
            selection.type === 'range' &&
            selection.range.collapsed &&
            key &&
            this.triggerKeys.indexOf(key) > -1
        ) {
            formatTextSegmentBeforeSelectionMarker(
                editor,
                (_model, previousSegment, paragraph, _markerFormat, context) => {
                    const replaced = this.customReplacements.some(
                        ({ stringToReplace, replacementString, replacementHandler }) => {
                            return replacementHandler(
                                previousSegment,
                                stringToReplace,
                                replacementString,
                                paragraph
                            );
                        }
                    );
                    if (replaced) {
                        context.canUndoByBackspace = true;
                        return true;
                    }
                    return false;
                }
            );
        }
    }
}
