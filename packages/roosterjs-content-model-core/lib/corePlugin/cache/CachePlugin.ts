import { areSameSelection } from './areSameSelection';
import { createTextMutationObserver } from './textMutationObserver';
import { domIndexerImpl } from './domIndexerImpl';
import { updateCachedSelection } from './updateCachedSelection';
import type {
    CachePluginState,
    IEditor,
    PluginEvent,
    PluginWithState,
    EditorOptions,
    ContentModelDocument,
} from 'roosterjs-content-model-types';

/**
 * ContentModel cache plugin manages cached Content Model, and refresh the cache when necessary
 */
class CachePlugin implements PluginWithState<CachePluginState> {
    private editor: IEditor | null = null;
    private state: CachePluginState;

    /**
     * Construct a new instance of CachePlugin class
     * @param option The editor option
     * @param contentDiv The editor content DIV
     */
    constructor(option: EditorOptions, contentDiv: HTMLDivElement) {
        this.state = option.disableCache
            ? {}
            : {
                  domIndexer: domIndexerImpl,
                  textMutationObserver: createTextMutationObserver(
                      contentDiv,
                      domIndexerImpl,
                      this.onMutation,
                      this.onSkipMutation
                  ),
              };
    }

    /**
     * Get name of this plugin
     */
    getName() {
        return 'Cache';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.editor.getDocument().addEventListener('selectionchange', this.onNativeSelectionChange);

        this.state.textMutationObserver?.startObserving();
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.state.textMutationObserver?.stopObserving();

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
    getState(): CachePluginState {
        return this.state;
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

        switch (event.eventType) {
            case 'keyDown':
            case 'input':
                if (!this.state.textMutationObserver) {
                    // When updating cache is not enabled, need to clear the cache to make sure other plugins can get an up-to-date content model
                    this.invalidateCache();
                }
                break;

            case 'selectionChanged':
                this.updateCachedModel(this.editor);
                break;

            case 'contentChanged':
                const { contentModel, selection } = event;

                if (contentModel && this.state.domIndexer) {
                    this.state.cachedModel = contentModel;
                    updateCachedSelection(this.state, selection);
                } else {
                    this.invalidateCache();
                }

                break;
        }
    }

    private onMutation = (isTextChangeOnly: boolean) => {
        if (this.editor) {
            if (isTextChangeOnly) {
                this.updateCachedModel(this.editor, true /*forceUpdate*/);
            } else {
                this.invalidateCache();
            }
        }
    };

    private onSkipMutation = (newModel: ContentModelDocument) => {
        if (!this.editor?.isInShadowEdit()) {
            this.state.cachedModel = newModel;
            this.state.cachedSelection = undefined;
        }
    };

    private onNativeSelectionChange = () => {
        if (this.editor?.hasFocus()) {
            this.updateCachedModel(this.editor);
        }
    };

    private invalidateCache() {
        if (!this.editor?.isInShadowEdit() && this.state.cachedModel) {
            console.error('Clear cache');

            this.state.cachedModel = undefined;
            this.state.cachedSelection = undefined;
        }
    }

    private updateCachedModel(editor: IEditor, forceUpdate?: boolean) {
        const cachedSelection = this.state.cachedSelection;
        this.state.cachedSelection = undefined; // Clear it to force getDOMSelection() retrieve the latest selection range

        const newRangeEx = editor.getDOMSelection() || undefined;
        const model = this.state.cachedModel;
        const isSelectionChanged =
            forceUpdate ||
            !cachedSelection ||
            !newRangeEx ||
            !areSameSelection(newRangeEx, cachedSelection);

        if (isSelectionChanged) {
            if (
                !model ||
                !newRangeEx ||
                !this.state.domIndexer?.reconcileSelection(model, newRangeEx, cachedSelection)
            ) {
                this.invalidateCache();
            } else {
                updateCachedSelection(this.state, newRangeEx);
            }
        } else {
            this.state.cachedSelection = cachedSelection;
        }
    }
}

/**
 * @internal
 * Create a new instance of CachePlugin class.
 * @param option The editor option
 * @param contentDiv The editor content DIV
 */
export function createCachePlugin(
    option: EditorOptions,
    contentDiv: HTMLDivElement
): PluginWithState<CachePluginState> {
    return new CachePlugin(option, contentDiv);
}
