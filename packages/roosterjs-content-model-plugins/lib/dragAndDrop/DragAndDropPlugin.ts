import { ChangeSource } from 'roosterjs-content-model-dom';
import { handleDroppedContent } from './utils/handleDroppedContent';
import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-content-model-types';

/**
 * Options for DragAndDrop plugin
 */
export interface DragAndDropOptions {
    /**
     * Forbidden elements that cannot be dropped in the editor
     * @default ['iframe']
     */
    forbiddenElements?: string[];
}

const DefaultOptions = {
    forbiddenElements: ['iframe'],
};

/**
 * DragAndDrop plugin, handles ContentChanged event when change source is "Drop"
 * to sanitize dropped content, similar to how PastePlugin sanitizes pasted content.
 */
export class DragAndDropPlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private forbiddenElements: string[] = [];
    private isInternalDragging: boolean = false;
    private disposer: (() => void) | null = null;

    /**
     * Construct a new instance of DragAndDropPlugin
     */
    constructor(options: DragAndDropOptions = DefaultOptions) {
        this.forbiddenElements = options.forbiddenElements ?? [];
    }

    /**
     * Get name of this plugin
     */
    getName() {
        return 'DragAndDrop';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.disposer = editor.attachDomEvent({
            dragstart: {
                beforeDispatch: _ev => {
                    this.isInternalDragging = true;
                },
            },
        });
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.editor = null;
        if (this.disposer) {
            this.disposer();
            this.disposer = null;
        }
        this.isInternalDragging = false;
        this.forbiddenElements = [];
    }

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        if (
            this.editor &&
            event.eventType == 'contentChanged' &&
            event.source == ChangeSource.Drop &&
            !this.isInternalDragging
        ) {
            const dropEvent = event.data.rawEvent as DragEvent;
            const html = dropEvent.dataTransfer?.getData('text/html');

            if (html) {
                handleDroppedContent(this.editor, dropEvent, html, this.forbiddenElements);
            }

            this.isInternalDragging = false;
            return;
        }
    }
}
