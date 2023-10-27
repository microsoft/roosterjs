import { areSameSelection } from '../modelApi/selection/areSameSelection';
import { ContentModelSelectionPluginState } from '../publicTypes/pluginState/ContentModelSelectionPluginState';
import { IContentModelEditor } from '../publicTypes/editor/IContentModelEditor';
import { PluginWithState } from '../publicTypes/plugin/PluginWithState';

/**
 * ContentModel selection plugin manages selection in editor
 */
class ContentModelSelectionPlugin implements PluginWithState<ContentModelSelectionPluginState> {
    private editor: IContentModelEditor | null = null;
    private state: ContentModelSelectionPluginState;

    /**
     * Construct a new instance of ContentModelSelectionPlugin class
     */
    constructor() {
        this.state = {
            lastSelection: null,
        };
    }

    /**
     * Get name of this plugin
     */
    getName() {
        return 'Selection';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IContentModelEditor) {
        this.editor = editor;
        this.editor.getDocument().addEventListener('selectionchange', this.onNativeSelectionChange);
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        if (this.editor) {
            this.editor
                .getDocument()
                .removeEventListener('selectionchange', this.onNativeSelectionChange);
            this.editor = null;
        }
    }

    /**
     * Get plugin state object
     */
    getState(): ContentModelSelectionPluginState {
        return this.state;
    }

    private onNativeSelectionChange = () => {
        if (this.editor?.hasFocus()) {
            const oldSelection = this.state.lastSelection;
            const newSelection = this.editor.getDOMSelection(true /*forceGetNewSelection*/);

            if (newSelection && (!oldSelection || !areSameSelection(oldSelection, newSelection))) {
                this.state.lastSelection = newSelection;

                this.editor.triggerEvent('selectionChanged', {
                    oldSelection,
                    newSelection,
                });
            }
        }
    };
}

export function createContentModelSelectionPlugin() {
    return new ContentModelSelectionPlugin();
}
