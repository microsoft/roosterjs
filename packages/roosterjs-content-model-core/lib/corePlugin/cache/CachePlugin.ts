import { areSameSelections } from './areSameSelections';
import { createTextMutationObserver } from './textMutationObserver';
import { DomIndexerImpl } from './domIndexerImpl';
import { updateCache } from './updateCache';
import { getSelectionRootNode } from 'roosterjs-content-model-dom';
import type { Mutation } from './textMutationObserver';
import type {
    CachePluginState,
    IEditor,
    PluginEvent,
    PluginWithState,
    EditorOptions,
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
                  domIndexer: new DomIndexerImpl(
                      option.experimentalFeatures &&
                          option.experimentalFeatures.indexOf('PersistCache') >= 0
                  ),
                  textMutationObserver: createTextMutationObserver(contentDiv, this.onMutation),
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
            case 'logicalRootChanged':
                this.invalidateCache();

                if (this.state.textMutationObserver) {
                    this.state.textMutationObserver.stopObserving();
                    this.state.textMutationObserver = createTextMutationObserver(
                        event.logicalRoot,
                        this.onMutation
                    );
                    this.state.textMutationObserver.startObserving();
                }
                break;

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
                    updateCache(this.state, contentModel, selection);
                } else {
                    this.invalidateCache();
                }

                break;
        }
    }

    private onMutation = (mutation: Mutation) => {
        if (this.editor) {
            switch (mutation.type) {
                case 'childList':
                    if (
                        !this.state.domIndexer?.reconcileChildList(
                            mutation.addedNodes,
                            mutation.removedNodes
                        )
                    ) {
                        this.invalidateCache();
                    }
                    break;

                case 'text':
                    this.updateCachedModel(this.editor, true /*forceUpdate*/);
                    break;

                case 'elementId':
                    const element = mutation.element;

                    if (!this.state.domIndexer?.reconcileElementId(element)) {
                        this.invalidateCache();
                    }

                    break;

                case 'unknown':
                    this.invalidateCache();
                    break;
            }
        }
    };

    private onNativeSelectionChange = () => {
        if (this.editor?.hasFocus()) {
            this.updateCachedModel(this.editor);
        }
    };

    private invalidateCache() {
        if (!this.editor?.isInShadowEdit()) {
            this.state.cachedModel = undefined;
            this.state.cachedSelection = undefined;
        }
    }

    private updateCachedModel(editor: IEditor, forceUpdate?: boolean) {
        if (editor.isInShadowEdit()) {
            return;
        }

        const cachedSelection = this.state.cachedSelection;
        this.state.cachedSelection = undefined; // Clear it to force getDOMSelection() retrieve the latest selection range

        const newSelection = editor.getDOMSelection() || undefined;
        const model = this.state.cachedModel;
        const isSelectionChanged =
            forceUpdate ||
            !cachedSelection ||
            !newSelection ||
            !areSameSelections(newSelection, cachedSelection);

        if (isSelectionChanged) {
            if (!model || !newSelection) {
                // No model or selection, we can't update cache, so invalidate it
                this.invalidateCache();
            } else if (
                !this.state.domIndexer?.reconcileSelection(model, newSelection, cachedSelection)
            ) {
                // There is cached model and selection, but we failed to reconcile the selection
                const selectionRoot = getSelectionRootNode(newSelection);

                if (
                    !selectionRoot ||
                    !this.state.textMutationObserver?.shouldIgnoreNode(selectionRoot)
                ) {
                    // Invalidate cache if the selection is not under entity
                    this.invalidateCache();
                } else {
                    // For the case when selection is under entity, we can ignore this selection change and just update cache directly
                    updateCache(this.state, model, newSelection);
                }
            } else {
                // Successfully reconciled model selection, update the cache
                updateCache(this.state, model, newSelection);
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
