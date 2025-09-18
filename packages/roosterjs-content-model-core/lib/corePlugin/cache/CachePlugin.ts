import { areSameSelections } from './areSameSelections';
import { ChangeSource } from 'roosterjs-content-model-dom';
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
    ContentModelParagraph,
    LocalUpdateReason,
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
                    option.experimentalFeatures.indexOf('PersistCache') >= 0,
                option.experimentalFeatures &&
                    option.experimentalFeatures.indexOf(
                        'KeepSelectionMarkerWhenEnteringTextNode'
                    ) >= 0
            ),
            textMutationObserver: createTextMutationObserver(contentDiv, this.onMutation),
            coauthoringClient: {
                owner: option.owner ?? '',
                onLocalUpdate: () => {},
                dispose: () => {},
                isCoauthoring: false,
            },
        };

        if (option.enableParagraphMap || option.coauthoringAgent) {
            this.state.paragraphMap = createParagraphMap(option.owner);
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

                this.updateCoauthoringModel('SelectionChangedEvent');

                break;

            case 'contentChanged':
                const { contentModel, selection } = event;

                if (contentModel) {
                    updateCache(this.state, contentModel, selection);
                } else {
                    this.invalidateCache();
                }

                if (
                    event.source != ChangeSource.SwitchToDarkMode &&
                    event.source != ChangeSource.SwitchToLightMode
                ) {
                    this.updateCoauthoringModel('ContentChangedEvent');
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

                    this.updateCoauthoringModel('ChildListMutation');

                    break;

                case 'text':
                    this.updateCachedModel(this.editor, true /*forceUpdate*/);

                    const paragraph =
                        mutation.node &&
                        this.state.domIndexer.findParagraphFromIndex(mutation.node);

                    if (paragraph) {
                        this.state.coauthoringClient.onLocalUpdate(
                            {
                                type: 'paragraph',
                                paragraphs: [paragraph],
                            },
                            'TextMutation'
                        );
                    } else {
                        this.updateCoauthoringModel('UnknownMutation');
                    }
                    break;

                case 'elementId':
                    const element = mutation.element;

                    if (!this.state.domIndexer.reconcileElementId(element)) {
                        this.invalidateCache();
                    }

                    this.updateCoauthoringModel('IdMutation');

                    break;

                case 'unknown':
                    this.invalidateCache();

                    this.updateCoauthoringModel('UnknownMutation');

                    break;
            }
        }
    };

    private onNativeSelectionChange = () => {
        if (this.editor?.hasFocus()) {
            const paragraphs = new Set<ContentModelParagraph>();

            if (this.state.coauthoringClient.isCoauthoring) {
                this.addModifiedParagraphs(paragraphs);
            }

            this.updateCachedModel(this.editor);

            if (this.state.coauthoringClient.isCoauthoring) {
                this.addModifiedParagraphs(paragraphs);

                if (paragraphs.size > 0) {
                    this.state.coauthoringClient.onLocalUpdate(
                        {
                            type: 'paragraph',
                            paragraphs: Array.from(paragraphs),
                        },
                        'NativeSelectionChange'
                    );
                }
            }
        }
    };

    private addModifiedParagraphs(paragraphs: Set<ContentModelParagraph>) {
        const selection = this.state.cachedSelection;
        const range = selection?.type == 'range' ? selection : null;

        this.addParagraphFromNode(range?.start.node, paragraphs);
        this.addParagraphFromNode(range?.end.node, paragraphs);
    }

    private addParagraphFromNode(node: Node | undefined, paragraphs: Set<ContentModelParagraph>) {
        if (node) {
            const para =
                this.state.domIndexer.findParagraphFromIndex(node) ??
                (node.firstChild && this.state.domIndexer.findParagraphFromIndex(node.firstChild));

            if (para) {
                paragraphs.add(para);
            }
        }
    }

    private updateCoauthoringModel(reason: LocalUpdateReason) {
        if (this.state.coauthoringClient.isCoauthoring && this.editor) {
            this.editor.formatContentModel(model => {
                this.state.coauthoringClient.onLocalUpdate(
                    {
                        type: 'model',
                        model,
                    },
                    reason
                );

                return false;
            });
        }
    }

    private invalidateCache() {
        if (!this.editor?.isInShadowEdit()) {
            this.state.cachedModel = undefined;
            this.state.cachedSelection = undefined;

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
