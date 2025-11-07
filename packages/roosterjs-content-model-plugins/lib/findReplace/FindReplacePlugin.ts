import { ChangeSource } from 'roosterjs-content-model-dom';
import { updateHighlight } from './utils/updateHighlight';
import type { FindReplaceHighlightOptions } from './types/FindReplaceHighlightOptions';
import {
    FindHighlightRuleKey,
    FindHighlightSelector,
    ReplaceHighlightRuleKey,
    ReplaceHighlightSelector,
} from './utils/constants';
import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-content-model-types';
import type { FindReplaceContext } from './types/FindReplaceContext';

const DefaultFindHighlightStyle = 'background-color: yellow;';
const DefaultReplaceHighlightStyle = 'background-color: orange;';

/**
 * Plugin for finding and replacing text in the editor, maintain the highlights for found and replaced text
 */
export class FindReplacePlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private findHighlightStyle: string;
    private replaceHighlightStyle: string;

    /**
     * Creates a FindReplacePlugin instance
     * @param context FindReplaceContext to use. It will be disposed when plugin is being disposed.
     * @param options Options for highlighting styles
     */
    constructor(private context: FindReplaceContext, options?: FindReplaceHighlightOptions) {
        this.findHighlightStyle = options?.findHighlightStyle ?? DefaultFindHighlightStyle;
        this.replaceHighlightStyle = options?.replaceHighlightStyle ?? DefaultReplaceHighlightStyle;
    }

    /**
     * Get name of this plugin
     */
    getName() {
        return 'FindReplace';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IEditor) {
        this.editor = editor;

        const win = editor.getDocument().defaultView ?? window;

        this.context.findHighlight.initialize(win);
        this.context.replaceHighlight.initialize(win);

        this.editor.setEditorStyle(FindHighlightRuleKey, this.findHighlightStyle, [
            FindHighlightSelector,
        ]);
        this.editor.setEditorStyle(ReplaceHighlightRuleKey, this.replaceHighlightStyle, [
            ReplaceHighlightSelector,
        ]);
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.context.findHighlight.dispose();
        this.context.replaceHighlight.dispose();

        if (this.editor) {
            this.editor.setEditorStyle(FindHighlightRuleKey, null /*cssRule*/);
            this.editor.setEditorStyle(ReplaceHighlightRuleKey, null /*cssRule*/);

            this.editor = null;
        }
    }

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        if (!this.context.text || !this.editor) {
            return;
        }

        switch (event.eventType) {
            case 'input':
                const selection = this.editor.getDOMSelection();

                if (selection?.type == 'range') {
                    const block = this.editor
                        .getDOMHelper()
                        .findClosestBlockElement(selection.range.startContainer);

                    updateHighlight(this.editor, this.context, [block], [block]);
                }

                break;
            case 'contentChanged':
                if (!event.contentModel && event.source != ChangeSource.Replace) {
                    updateHighlight(this.editor, this.context);
                }

                break;

            case 'rewriteFromModel':
                updateHighlight(
                    this.editor,
                    this.context,
                    event.addedBlockElements,
                    event.removedBlockElements
                );

                break;
        }
    }
}
