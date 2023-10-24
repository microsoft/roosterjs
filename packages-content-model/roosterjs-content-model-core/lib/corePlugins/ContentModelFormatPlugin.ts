import { getObjectKeys } from 'roosterjs-content-model-dom';
import type { ContentModelEditorOptions } from '../publicTypes/editor/ContentModelEditorOptions';
import type { ContentModelFormatPluginState } from '../publicTypes/pluginState/ContentModelFormatPluginState';
import type { ContentModelPluginEvent } from '../publicTypes/event/ContentModelPluginEvent';
import type { ContentModelPluginWithState } from '../publicTypes/plugin/ContentModelPluginWithState';
import type { IContentModelEditor } from '../publicTypes/editor/IContentModelEditor';

// During IME input, KeyDown event will have "Process" as key
const ProcessKey = 'Process';
const CursorMovingKeys = new Set<string>([
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'Home',
    'End',
    'PageUp',
    'PageDown',
]);

/**
 * ContentModelFormat plugins helps editor to do formatting on top of content model.
 * This includes:
 * 1. Handle pending format changes when selection is collapsed
 */
export default class ContentModelFormatPlugin
    implements ContentModelPluginWithState<ContentModelFormatPluginState> {
    private editor: IContentModelEditor | null = null;
    private hasDefaultFormat = false;
    private state: ContentModelFormatPluginState;

    /**
     * Construct a new instance of ContentModelEditPlugin class
     * @param state State of this plugin
     */
    constructor(options: ContentModelEditorOptions) {
        this.state = {
            defaultFormat: { ...options.defaultSegmentFormat },
        };
    }

    /**
     * Get name of this plugin
     */
    getName() {
        return 'ContentModelFormat';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IContentModelEditor) {
        this.editor = editor;
        this.hasDefaultFormat =
            getObjectKeys(this.state.defaultFormat).filter(
                x => typeof this.state.defaultFormat[x] !== 'undefined'
            ).length > 0;
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
    getState(): ContentModelFormatPluginState {
        return this.state;
    }

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: ContentModelPluginEvent) {
        if (!this.editor) {
            return;
        }

        switch (event.eventType) {
            case 'input':
                // In Safari, isComposing will be undefined but isInIME() works
                if (!event.rawEvent.isComposing && !this.editor.isInIME()) {
                    this.checkAndApplyPendingFormat(event.rawEvent.data);
                }

                break;

            case 'compositionEnd':
                this.checkAndApplyPendingFormat(event.rawEvent.data);
                break;

            case 'keyDown':
                if (CursorMovingKeys.has(event.rawEvent.key)) {
                    clearPendingFormat(this.editor);
                } else if (
                    this.hasDefaultFormat &&
                    (isCharacterValue(event.rawEvent) || event.rawEvent.key == ProcessKey)
                ) {
                    applyDefaultFormat(this.editor, this.state.defaultFormat);
                }

                break;

            case 'mouseUp':
            case 'contentChanged':
                if (!canApplyPendingFormat(this.editor)) {
                    clearPendingFormat(this.editor);
                }
                break;
        }
    }

    private checkAndApplyPendingFormat(data: string | null) {
        if (this.editor && data) {
            applyPendingFormat(this.editor, data);
            clearPendingFormat(this.editor);
        }
    }
}

/**
 * @internal
 * Create a new instance of ContentModelFormatPlugin.
 * This is mostly for unit test
 */
export function createContentModelFormatPlugin(options: ContentModelEditorOptions) {
    return new ContentModelFormatPlugin(options);
}
