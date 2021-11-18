import { EditorPlugin, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import {
    Browser,
    clearSelectedTableCells,
    highlightTableSelection,
    setTableSelectedRange,
} from 'roosterjs-editor-dom';

/**
 * TableSelectionPlugin help highlight table cells
 */
export default class TableSelectionPlugin implements EditorPlugin {
    private editor: IEditor;
    private mouseUpEventListerAdded: boolean;
    private lastTarget: EventTarget;
    private firstTarget: EventTarget;

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'TableSelection';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        setTimeout(() => {
            const styleElement = document.createElement('style');
            styleElement.id = 'Style4TableSelection';
            this.editor.getDocument().head.append(styleElement);

            // let sheet = styleElement.sheet;

            // sheet.insertRule(
            //     'td:not(td.TableCellSelected) *::selection { background-color: transparent !important;}'
            // );

            // sheet.insertRule(
            //     'td:not(td.TableCellSelected)::selection { background-color: transparent !important;}'
            // );
        }, 500);
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.removeMouseUpEventListener();
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (event.eventType == PluginEventType.ExtractContentWithDom) {
            clearSelectedTableCells(event.clonedRoot);
            return;
        }
        if (event.eventType == PluginEventType.BeforeSetContent) {
            this.clearTableCellSelection(true /** forceClear */);
            this.editor.select(this.editor.getElementAtCursor('td'));
            return;
        }
        if (event.eventType == PluginEventType.MouseUp) {
            setTimeout(() => {
                this.clearTableCellSelection();
            }, 50);
        }
        if (event.eventType == PluginEventType.MouseDown && !this.mouseUpEventListerAdded) {
            this.editor
                .getDocument()
                .addEventListener('mouseup', this.onMouseUp, true /*setCapture*/);

            if (!event.rawEvent.shiftKey) {
                this.clearTableCellSelection();

                // this.editor.getDocument().addEventListener(
                //     'selectionchange',
                //     (ev: Event) => {
                //         console.log(ev);
                //         console.log(this.editor?.getDocument().getSelection());
                //         ev.preventDefault();
                //         ev.stopPropagation();
                //         return false;
                //     },
                //     true
                // );
                // // this.editor.getDocument().addEventListener('selectionchange', (ev: Event) => {
                //     const range = this.editor.getSelectionRange();
                //     if (
                //         (range &&
                //             safeInstanceOf(range.endContainer, 'HTMLElement') &&
                //             range.endContainer.classList.contains('TableCellSelected')) ||
                //         findClosestElementAncestor(range.endContainer, null, '.TableCellSelected')
                //     ) {
                //         console.clear();
                //         console.log(ev);
                //         console.log(this.editor?.getDocument().getSelection());
                //         console.log(this.editor.getSelectionRange());

                //         range.setEndBefore(range.endContainer);
                //         this.editor.select(range);
                //         console.log(this.editor.getSelectionRange());

                //         ev.preventDefault();
                //         ev.stopPropagation();
                //         return false;
                //     }
                // });

                this.editor
                    .getDocument()
                    .addEventListener('mousemove', this.onMouseMove, true /*setCapture*/);
            }
            this.mouseUpEventListerAdded = true;
        } else if (!this.mouseUpEventListerAdded) {
            const range = this.editor?.getSelectionRange();
            if (
                range &&
                range.commonAncestorContainer.nodeType != Node.TEXT_NODE &&
                !range.collapsed
            ) {
                highlightTableSelection(
                    Browser.isFirefox
                        ? this.editor.getDocument().getSelection()
                        : this.editor.getSelectionTraverser()
                );
                return;
            }
            this.clearTableCellSelection();
        }
    }

    private clearTableCellSelection(forceClear?: boolean) {
        if (this.editor) {
            let range = this.editor.getSelectionRange();

            if (!range || range.collapsed || forceClear) {
                clearSelectedTableCells(this.editor.getScrollContainer());
            }
        }
    }

    private onMouseMove = (event: MouseEvent) => {
        if (
            event.target &&
            this.lastTarget &&
            event.target != this.lastTarget &&
            event.target != this.firstTarget
        ) {
            let range = this.editor.getSelectionRange();
            if (range) {
                if (!range.collapsed) {
                    highlightTableSelection(
                        Browser.isFirefox
                            ? this.editor.getDocument().getSelection()
                            : this.editor.getSelectionTraverser()
                    );
                } else {
                    const table = this.editor.getElementAtCursor(
                        'TABLE',
                        event.target as Node
                    ) as HTMLTableElement;
                    const td = this.editor.getElementAtCursor(
                        'TD',
                        event.target as Node
                    ) as HTMLTableCellElement;
                    if (table && td) {
                        setTableSelectedRange(table, this.firstTarget as HTMLTableCellElement, td);
                    }
                }
            }
        } else if (event.target == this.firstTarget) {
            clearSelectedTableCells(this.editor.getScrollContainer());
        }
        this.firstTarget = this.firstTarget || event.target;
        this.lastTarget = event.target;

        event.preventDefault();
    };

    private removeMouseUpEventListener() {
        if (this.mouseUpEventListerAdded) {
            this.mouseUpEventListerAdded = false;
            this.lastTarget = null;
            this.firstTarget = null;
            this.editor.getDocument().removeEventListener('mouseup', this.onMouseUp, true);
            this.editor.getDocument().removeEventListener('mousemove', this.onMouseMove, true);
        }
    }

    private onMouseUp = () => {
        if (this.editor) {
            this.removeMouseUpEventListener();
        }
    };
}
