import { handleDroppedExternalContent } from './utils/handleDroppedExternalContent';
import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-content-model-types';
import { handleDroppedInternalContent } from './utils/handleDroppedInternalContent';

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
    private internalDrag: boolean = false;
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
                beforeDispatch: ev => {
                    this.internalDrag = true;
                    if (
                        this.editor &&
                        this.editor.isExperimentalFeatureEnabled('HandleDropInternalContent')
                    ) {
                        this.adjustDraggingCursor(this.editor, ev as DragEvent);
                    }
                },
            },
            blur: {
                beforeDispatch: _ev => {
                    if (this.internalDrag) {
                        this.editor?.takeSnapshot();
                        this.internalDrag = false;
                    }
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
        this.forbiddenElements = [];
    }

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        if (this.editor && event.eventType == 'beforeDrop') {
            const dropEvent = event.rawEvent;
            if (
                this.internalDrag &&
                this.editor.isExperimentalFeatureEnabled('HandleDropInternalContent')
            ) {
                handleDroppedInternalContent(this.editor, dropEvent);
            } else if (!this.internalDrag) {
                const html = dropEvent.dataTransfer?.getData('text/html');
                if (html) {
                    handleDroppedExternalContent(
                        this.editor,
                        dropEvent,
                        html,
                        this.forbiddenElements
                    );
                }
            }
            this.internalDrag = false;
        }
    }

    private adjustDraggingCursor(editor: IEditor, dragEvent: DragEvent) {
        const selection = editor.getDOMSelection();
        if (selection?.type == 'table') {
            const doc = this.editor?.getDocument();
            if (doc && dragEvent.dataTransfer) {
                const ghost = doc.createElement('span');
                ghost.textContent = '|';
                doc.body.appendChild(ghost);
                dragEvent.dataTransfer.setDragImage(ghost, 0, 0);
                doc.defaultView?.requestAnimationFrame(() => ghost.remove());
            }
        }
    }
}
