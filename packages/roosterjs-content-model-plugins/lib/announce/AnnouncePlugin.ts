import { getIsSelectingOrUnselecting, retrieveStringFromParsedTable } from './tableSelectionUtils';
import type {
    IEditor,
    PluginEvent,
    EditorPlugin,
    DOMSelection,
} from 'roosterjs-content-model-types';

/**
 * AnnouncePlugin helps editor announce table selection changes for accessibility
 */
export class AnnouncePlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private previousSelection: DOMSelection | null = null;

    /**
     * Get name of this plugin
     */
    getName() {
        return 'Announce';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.previousSelection = null;
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
        if (!this.editor) {
            return;
        }

        if (event.eventType == 'selectionChanged') {
            if (event.newSelection?.type == 'table') {
                const action = getIsSelectingOrUnselecting(
                    this.previousSelection?.type == 'table' ? this.previousSelection : null,
                    event.newSelection
                );
                if (action && event.newSelection.tableSelectionInfo) {
                    this.editor.announce({
                        defaultStrings: action === 'unselecting' ? 'unselected' : 'selected',
                        formatStrings: [
                            retrieveStringFromParsedTable(event.newSelection.tableSelectionInfo),
                        ],
                    });
                }
            }

            this.previousSelection = event.newSelection;
        }
    }
}
