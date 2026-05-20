import { areSameSelections } from './areSameSelections';
import { createParagraphMap } from './ParagraphMapImpl';
import { createTextMutationObserver } from './textMutationObserver';
import { DomIndexerImpl } from './domIndexerImpl';
import { updateCache } from './updateCache';
import type { Mutation } from './MutationType';
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
        this.state = {
            domIndexer: new DomIndexerImpl(
                option.experimentalFeatures &&
                    option.experimentalFeatures.indexOf(
                        'KeepSelectionMarkerWhenEnteringTextNode'
                    ) >= 0
            ),
            textMutationObserver: createTextMutationObserver(contentDiv, this.onMutation),
        };

        if (option.enableParagraphMap) {
            this.state.paragraphMap = createParagraphMap();
        }
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

        this.state.textMutationObserver.startObserving();
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.state.textMutationObserver.stopObserving();

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

                this.state.textMutationObserver.stopObserving();
                this.state.textMutationObserver = createTextMutationObserver(
                    event.logicalRoot,
                    this.onMutation
                );
                this.state.textMutationObserver.startObserving();
                break;

            case 'selectionChanged':
                this.updateCachedModel(this.editor);
                break;

            case 'contentChanged':
                const { contentModel, selection } = event;

                if (contentModel) {
                    updateCache(this.state, contentModel, selection);
                }

                break;
        }
    }

    private onMutation = (mutation: Mutation) => {
        if (this.editor) {
            switch (mutation.type) {
                case 'childList':
                    if (
                        !this.state.domIndexer.reconcileChildList(
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

                    if (!this.state.domIndexer.reconcileElementId(element)) {
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
            if (this.state.cachedModel) {
                this.state.cachedModel = undefined;
            }

            if (this.state.cachedSelection) {
                this.state.cachedSelection = undefined;
            }

            // Clear paragraph indexer to prevent stale references to old paragraphs
            // It will be rebuild next time when we create a new Content Model
            this.state.paragraphMap?.clear();
        }
    }

    private updateCachedModel(editor: IEditor, forceUpdate?: boolean) {
        if (editor.isInShadowEdit()) {
            return;
        }

        const cachedSelection = this.state.cachedSelection;
        this.state.cachedSelection = undefined; // Clear it to force getDOMSelection() retrieve the latest selection range

        const newRangeEx = editor.getDOMSelection() || undefined;
        const model = this.state.cachedModel;
        const isSelectionChanged =
            forceUpdate ||
            !cachedSelection ||
            !newRangeEx ||
            !areSameSelections(newRangeEx, cachedSelection);

        if (isSelectionChanged) {
            if (
                !model ||
                !newRangeEx ||
                !this.state.domIndexer.reconcileSelection(model, newRangeEx, cachedSelection)
            ) {
                this.invalidateCache();
            } else {
                updateCache(this.state, model, newRangeEx);
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
