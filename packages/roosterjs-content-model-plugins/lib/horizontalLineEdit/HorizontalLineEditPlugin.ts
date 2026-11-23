import { applyHorizontalLineResize } from './utils/applyHorizontalLineResize';
import { createHorizontalLineResizeContext } from './utils/createHorizontalLineResizeContext';
import { createHorizontalLineResizeHandles } from './utils/createHorizontalLineResizeHandles';
import { handleHorizontalLineResizeKeyDown } from './utils/handleHorizontalLineResizeKeyDown';
import { isElementOfType, isNodeOfType, unwrap } from 'roosterjs-content-model-dom';
import { WRAPPER_ATTRIBUTE } from './constants';
import type { HorizontalLineEditOptions } from './HorizontalLineEditOptions';
import type { HorizontalLineResizeContext } from './types/HorizontalLineResizeContext';
import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-content-model-types';

/**
 * Adds NW, N, NE, E, SE, S, SW, and W resize handles when a horizontal line is clicked.
 * Drag a handle, or focus it and use the arrow keys (Shift for 10px steps).
 * Mouse/touch release or Enter commits the dimensions; Escape cancels.
 * Clicking elsewhere in the editor or moving focus outside it also finishes editing.
 * Vertical resizing uses a 1px solid gray border and a transparent center,
 * with zero vertical padding and a minimum outer height of 2px.
 * The preview and committed horizontal line use display: table.
 * The preview preserves inline HR styles without copying computed defaults.
 * The editing outline has a 4px gap around the line, with 6px resize handles.
 *
 * @example
 * ```typescript
 * new Editor(contentDiv, { plugins: [new HorizontalLineEditPlugin()] });
 * ```
 */
export class HorizontalLineEditPlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private resizeContext: HorizontalLineResizeContext | null = null;
    private disposer: (() => void) | null = null;

    constructor(private options: HorizontalLineEditOptions = {}) {}

    /**
     * Get the name of this plugin.
     */
    getName() {
        return 'HorizontalLineEdit';
    }

    /**
     * Initialize this plugin.
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.attachEvents(editor);
    }

    /**
     * Remove editing UI and event listeners.
     */
    dispose() {
        this.cleanUp();
        this.disposer?.();
        this.disposer = null;
        this.editor = null;
    }

    /**
     * Handle editor events.
     */
    onPluginEvent(event: PluginEvent) {
        if (!this.editor) {
            return;
        }

        switch (event.eventType) {
            case 'mouseDown':
                this.onMouseDown(event.rawEvent);
                break;
            case 'mouseUp':
            case 'pointerUp':
                this.onMouseUp(event.rawEvent);
                break;
            case 'keyDown':
                this.onKeyDown(event.rawEvent);
                break;
            case 'beforeLogicalRootChange':
                this.onBeforeLogicalRootChange();
                break;
            case 'logicalRootChanged':
                this.attachEvents(this.editor);
                break;
            case 'beforeSetContent':
            case 'beforeAddUndoSnapshot':
            case 'contentChanged':
                this.cleanUp();
                break;
            case 'extractContentWithDom':
                this.onExtractContentWithDom(event.clonedRoot);
                break;
        }
    }

    private onMouseDown(event: MouseEvent) {
        const target = event.target as Node | null;
        const line = this.getEditableLine(target);

        if (event.button == 0 && line) {
            if (line !== this.resizeContext?.line) {
                this.startEditing(this.finishEditing(line) ?? line);
            }
            event.preventDefault();
        } else if (target !== this.resizeContext?.host) {
            this.finishEditing();
        }
    }

    private onMouseUp(event: MouseEvent) {
        const line = this.getEditableLine(event.target);
        if (event.button == 0 && line) {
            this.startEditing(line);
        }
    }

    private onKeyDown(event: KeyboardEvent) {
        if (this.editor && this.resizeContext) {
            const handled = handleHorizontalLineResizeKeyDown(
                this.resizeContext,
                event,
                this.editor,
                () => this.finishEditing(),
                () => this.cleanUp()
            );

            if (handled) {
                return;
            } else if (event.key == 'Escape') {
                event.preventDefault();
                this.cleanUp();
            } else if (event.key != 'Tab') {
                this.finishEditing();
            }
        }
    }

    private onBeforeLogicalRootChange() {
        this.finishEditing();
        this.disposer?.();
        this.disposer = null;
    }

    private onExtractContentWithDom(clonedRoot: HTMLElement) {
        clonedRoot
            .querySelectorAll('[' + WRAPPER_ATTRIBUTE + ']')
            .forEach(element => unwrap(element));
    }

    private attachEvents(editor: IEditor) {
        this.disposer = editor.attachDomEvent({
            pointerup: {
                beforeDispatch: event => {
                    const pointerEvent = event as PointerEvent;
                    const line = this.getEditableLine(pointerEvent.target);
                    if (line && pointerEvent.pointerType != 'mouse' && pointerEvent.button == 0) {
                        this.startEditing(this.finishEditing(line) ?? line);
                    }
                },
            },
            blur: {
                capture: true,
                beforeDispatch: this.onFocusOut,
            },
            focusout: {
                capture: true,
                beforeDispatch: this.onFocusOut,
            },
        });
    }

    private getEditableLine(target: EventTarget | null) {
        const node = target as Node | null;
        return isNodeOfType(node, 'ELEMENT_NODE') &&
            isElementOfType(node, 'hr') &&
            this.editor?.getDOMHelper().isNodeInEditor(node) &&
            node.isContentEditable
            ? node
            : null;
    }

    private startEditing(line: HTMLHRElement) {
        const editor = this.editor;
        if (!editor || this.resizeContext?.line === line || !line.parentNode) {
            return;
        }

        this.cleanUp();
        const zoomScale = editor.getDOMHelper().calculateZoomScale();
        const context = createHorizontalLineResizeContext(line, zoomScale, this.options);
        this.resizeContext = context;
        createHorizontalLineResizeHandles(context, editor, this.options, zoomScale, () =>
            this.finishEditing()
        );
    }

    private onFocusOut = (event: Event) => {
        const target = (event as FocusEvent).relatedTarget as Node | null;
        const context = this.resizeContext;
        if (
            context &&
            (!isNodeOfType(target, 'ELEMENT_NODE') ||
                (!context.host.contains(target) && !context.wrapper.contains(target)))
        ) {
            this.finishEditing();
        }
    };

    private finishEditing(nextLine?: HTMLHRElement) {
        const { editor, resizeContext } = this;
        this.cleanUp();
        return editor && resizeContext
            ? applyHorizontalLineResize(editor, resizeContext, nextLine)
            : nextLine;
    }

    private cleanUp() {
        const context = this.resizeContext;
        this.resizeContext = null;
        if (context) {
            context.helpers.forEach(helper => helper.dispose());
            const { host } = context;
            if (host.parentNode) {
                unwrap(host);
            }
        }
    }
}
