import { areSameRangeEx } from '../../modelApi/selection/areSameRangeEx';
import { Keys, PluginEventType } from 'roosterjs-editor-types';
import type ContentModelContentChangedEvent from '../../publicTypes/event/ContentModelContentChangedEvent';
import type { ContentModelCachePluginState } from '../../publicTypes/pluginState/ContentModelCachePluginState';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import type { IEditor, PluginEvent, PluginWithState } from 'roosterjs-editor-types';

/**
 * ContentModel cache plugin manages cached Content Model, and refresh the cache when necessary
 */
export default class ContentModelCachePlugin
    implements PluginWithState<ContentModelCachePluginState> {
    private editor: IContentModelEditor | null = null;

    /**
     * Construct a new instance of ContentModelEditPlugin class
     * @param state State of this plugin
     */
    constructor(private state: ContentModelCachePluginState) {
        // TODO: Remove tempState parameter once we have standalone Content Model editor
    }

    /**
     * Get name of this plugin
     */
    getName() {
        return 'ContentModelCache';
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
    getState(): ContentModelCachePluginState {
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
            case PluginEventType.KeyDown:
                if (event.rawEvent.defaultPrevented || event.handledByEditFeature) {
                    // Other plugins already handled this event, so it is most likely content is already changed, we need to clear cached content model
                    this.invalidateCache();
                } else {
                    switch (event.rawEvent.which) {
                        case Keys.ENTER:
                            // ENTER key will create new paragraph, so need to update cache to reflect this change
                            // TODO: Handle ENTER key to better reuse content model
                            this.invalidateCache();

                            break;
                    }
                }
                break;

            case PluginEventType.Input:
                {
                    this.updateCachedModel(this.editor, true /*forceUpdate*/);
                }
                break;

            case PluginEventType.SelectionChanged:
                this.updateCachedModel(this.editor);
                break;

            case PluginEventType.ContentChanged:
                {
                    const { contentModel, rangeEx } = event as ContentModelContentChangedEvent;

                    if (contentModel && this.state.domIndexer) {
                        this.state.cachedModel = contentModel;
                        this.state.cachedRangeEx = rangeEx;
                    } else {
                        this.invalidateCache();
                    }
                }

                break;
        }
    }

    private onNativeSelectionChange = () => {
        if (this.editor?.hasFocus()) {
            this.updateCachedModel(this.editor);
        }
    };

    private invalidateCache() {
        if (!this.editor?.isInShadowEdit()) {
            this.state.cachedModel = undefined;
            this.state.cachedRangeEx = undefined;
        }
    }

    private updateCachedModel(editor: IContentModelEditor, forceUpdate?: boolean) {
        const cachedRangeEx = this.state.cachedRangeEx;
        this.state.cachedRangeEx = undefined; // Clear it to force getSelectionRangeEx() retrieve the latest selection range

        const newRangeEx = editor.getSelectionRangeEx();

        const model = this.state.cachedModel;
        const isSelectionChanged =
            forceUpdate || !cachedRangeEx || !areSameRangeEx(newRangeEx, cachedRangeEx);

        if (isSelectionChanged) {
            if (
                !model ||
                !this.state.domIndexer?.reconcileSelection(model, newRangeEx, cachedRangeEx)
            ) {
                this.invalidateCache();
            } else {
                this.state.cachedRangeEx = newRangeEx;
            }
        } else {
            this.state.cachedRangeEx = cachedRangeEx;
        }
    }
}

/**
 * @internal
 * Create a new instance of ContentModelCachePlugin class.
 * This is mostly for unit test
 * @param state State of this plugin
 */
export function createContentModelCachePlugin(state: ContentModelCachePluginState) {
    return new ContentModelCachePlugin(state);
}
