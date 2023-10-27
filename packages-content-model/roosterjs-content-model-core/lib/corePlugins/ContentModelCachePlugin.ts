import { contentModelDomIndexer } from './contentModelDomIndexer';
import { isCharacterValue } from '../modelApi/common/eventUtils';
import type { ContentModelCachePluginState } from '../publicTypes/pluginState/ContentModelCachePluginState';
import type { EditorOptions } from '../publicTypes/editor/EditorOptions';
import type { PluginEvent } from '../publicTypes/event/PluginEvent';
import type { PluginKeyDownEvent } from '../publicTypes/event/PluginDomEvent';
import type { PluginWithState } from '../publicTypes/plugin/PluginWithState';
import type { IContentModelEditor } from '../publicTypes/editor/IContentModelEditor';
import type { DOMSelection } from 'roosterjs-content-model-types';

/**
 * ContentModel cache plugin manages cached Content Model, and refresh the cache when necessary
 */
export class ContentModelCachePlugin implements PluginWithState<ContentModelCachePluginState> {
    private editor: IContentModelEditor | null = null;
    private state: ContentModelCachePluginState;

    /**
     * Construct a new instance of ContentModelEditPlugin class
     * @param options Options of editor
     */
    constructor(options: EditorOptions) {
        this.state = {
            domIndexer: options.cacheModel ? contentModelDomIndexer : undefined,
        };
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
    initialize(editor: IContentModelEditor) {
        this.editor = editor;
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
            case 'keyDown':
                if (this.shouldClearCache(event, this.editor.getDOMSelection())) {
                    this.invalidateCache();
                }
                break;

            case 'input':
                {
                    this.updateCachedModel(this.editor);
                }
                break;

            case 'selectionChanged':
                this.updateCachedModel(
                    this.editor,
                    event.newSelection,
                    event.oldSelection ?? undefined
                );
                break;

            case 'contentChanged':
                {
                    const { contentModel } = event;

                    if (contentModel && this.state.domIndexer) {
                        this.state.cachedModel = contentModel;
                    } else {
                        this.invalidateCache();
                    }
                }

                break;
        }
    }

    private invalidateCache() {
        if (!this.editor?.isInShadowEdit()) {
            this.state.cachedModel = undefined;
        }
    }

    private updateCachedModel(
        editor: IContentModelEditor,
        newSelection?: DOMSelection,
        oldSelection?: DOMSelection
    ) {
        const model = this.state.cachedModel;

        if (
            !model ||
            !newSelection ||
            !this.state.domIndexer?.reconcileSelection(model, newSelection, oldSelection)
        ) {
            this.invalidateCache();
        }
    }

    private shouldClearCache(event: PluginKeyDownEvent, selection: DOMSelection | null) {
        const { rawEvent, handledByEditFeature } = event;

        // In these cases we can't update the model, so clear cache:
        // 1. It is already handled by Content Edit Features
        if (handledByEditFeature) {
            return true;
        }

        // 2. Default behavior is prevented, which means other plugins has handled the event
        if (rawEvent.defaultPrevented) {
            return true;
        }

        // 3. ENTER key is pressed. ENTER key will create new paragraph, so need to update cache to reflect this change
        // TODO: Handle ENTER key to better reuse content model

        if (rawEvent.key == 'Enter') {
            return true;
        }

        // 4. Current selection is image or table or expanded range selection, and is inputting some text
        if (
            (!selection || selection.type != 'range' || !selection.range.collapsed) &&
            isCharacterValue(rawEvent)
        ) {
            return true;
        }

        return false;
    }
}

/**
 * @internal
 * Create a new instance of ContentModelCachePlugin class.
 * This is mostly for unit test
 * @param state State of this plugin
 */
export function createContentModelCachePlugin(options: EditorOptions) {
    return new ContentModelCachePlugin(options);
}
