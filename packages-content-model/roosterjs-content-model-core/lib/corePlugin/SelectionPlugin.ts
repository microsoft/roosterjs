import { isElementOfType, isNodeOfType, toArray } from 'roosterjs-content-model-dom';
import { isModifierKey } from '../publicApi/domUtils/eventUtils';
import { PluginEventType } from 'roosterjs-editor-types';
import type { PluginEvent } from 'roosterjs-editor-types';
import type {
    DOMSelection,
    IStandaloneEditor,
    PluginWithState,
    SelectionPluginState,
    StandaloneEditorOptions,
} from 'roosterjs-content-model-types';

const MouseMiddleButton = 1;

class SelectionPlugin implements PluginWithState<SelectionPluginState> {
    private editor: IStandaloneEditor | null = null;
    private state: SelectionPluginState;
    private disposer: (() => void) | null = null;

    constructor(options: StandaloneEditorOptions) {
        this.state = {
            selection: null,
            selectionStyleNode: null,
            imageSelectionBorderColor: options.imageSelectionBorderColor, // TODO: Move to Selection core plugin
        };
    }

    getName() {
        return 'Selection';
    }

    initialize(editor: IStandaloneEditor) {
        this.editor = editor;

        const doc = this.editor.getDocument();
        const styleNode = doc.createElement('style');

        doc.head.appendChild(styleNode);
        this.state.selectionStyleNode = styleNode;

        const env = this.editor.getEnvironment();
        const document = this.editor.getDocument();

        if (env.isSafari) {
            document.addEventListener('mousedown', this.onMouseDownDocument, true /*useCapture*/);
            document.addEventListener('keydown', this.onKeyDownDocument);
            document.defaultView?.addEventListener('blur', this.onBlur);
            this.disposer = this.editor.attachDomEvent({ focus: { beforeDispatch: this.onFocus } });
        } else {
            this.disposer = this.editor.attachDomEvent({
                focus: { beforeDispatch: this.onFocus },
                blur: { beforeDispatch: this.onBlur },
            });
        }
    }

    dispose() {
        if (this.state.selectionStyleNode) {
            this.state.selectionStyleNode.parentNode?.removeChild(this.state.selectionStyleNode);
            this.state.selectionStyleNode = null;
        }

        if (this.disposer) {
            this.disposer();
            this.disposer = null;
        }

        if (this.editor) {
            const document = this.editor.getDocument();

            document.removeEventListener(
                'mousedown',
                this.onMouseDownDocument,
                true /*useCapture*/
            );
            document.removeEventListener('keydown', this.onKeyDownDocument);
            document.defaultView?.removeEventListener('blur', this.onBlur);

            this.editor = null;
        }
    }

    getState(): SelectionPluginState {
        return this.state;
    }

    onPluginEvent(event: PluginEvent) {
        if (!this.editor) {
            return;
        }

        let image: HTMLImageElement | null;
        let selection: DOMSelection | null;

        switch (event.eventType) {
            case PluginEventType.MouseUp:
                if (
                    (image = this.getClickingImage(event.rawEvent)) &&
                    image.isContentEditable &&
                    event.rawEvent.button != MouseMiddleButton &&
                    event.isClicking
                ) {
                    this.selectImage(this.editor, image);
                }
                break;

            case PluginEventType.MouseDown:
                selection = this.editor.getDOMSelection();

                if (selection?.type == 'image' && selection.image !== event.rawEvent.target) {
                    this.selectBeforeImage(this.editor, selection.image);
                }
                break;

            case PluginEventType.KeyDown:
                const rawEvent = event.rawEvent;
                const key = rawEvent.key;
                selection = this.editor.getDOMSelection();

                if (
                    !isModifierKey(rawEvent) &&
                    !rawEvent.shiftKey &&
                    selection?.type == 'image' &&
                    selection.image.parentNode
                ) {
                    if (key === 'Escape') {
                        this.selectBeforeImage(this.editor, selection.image);
                        event.rawEvent.stopPropagation();
                    } else if (key !== 'Delete' && key !== 'Backspace') {
                        this.selectBeforeImage(this.editor, selection.image);
                    }
                }
                break;

            case PluginEventType.ContextMenu:
                selection = this.editor.getDOMSelection();

                if (
                    (image = this.getClickingImage(event.rawEvent)) &&
                    (selection?.type != 'image' || selection.image != image)
                ) {
                    this.selectImage(this.editor, image);
                }
        }
    }

    private selectImage(editor: IStandaloneEditor, image: HTMLImageElement) {
        editor.setDOMSelection({
            type: 'image',
            image: image,
        });
    }

    private selectBeforeImage(editor: IStandaloneEditor, image: HTMLImageElement) {
        const doc = editor.getDocument();
        const parent = image.parentNode;
        const index = parent && toArray(parent.childNodes).indexOf(image);

        if (parent && index !== null && index >= 0) {
            const range = doc.createRange();
            range.setStart(parent, index);
            range.collapse();

            editor.setDOMSelection({
                type: 'range',
                range: range,
            });
        }
    }

    private getClickingImage(event: UIEvent): HTMLImageElement | null {
        const target = event.target as Node;

        return isNodeOfType(target, 'ELEMENT_NODE') && isElementOfType(target, 'img')
            ? target
            : null;
    }

    private onFocus = () => {
        if (!this.state.skipReselectOnFocus && this.state.selection) {
            this.editor?.setDOMSelection(this.state.selection);
        }

        if (this.state.selection?.type == 'range') {
            // Editor is focused, now we can get live selection. So no need to keep a selection if the selection type is range.
            this.state.selection = null;
        }
    };

    private onBlur = () => {
        if (!this.state.selection && this.editor) {
            this.state.selection = this.editor.getDOMSelection();
        }
    };

    private onKeyDownDocument = (event: KeyboardEvent) => {
        if (event.key == 'Tab' && !event.defaultPrevented) {
            this.onBlur();
        }
    };

    private onMouseDownDocument = (event: MouseEvent) => {
        if (this.editor && !this.editor.isNodeInEditor(event.target as Node)) {
            this.onBlur();
        }
    };
}

/**
 * @internal
 * Create a new instance of SelectionPlugin.
 * @param option The editor option
 */
export function createSelectionPlugin(
    options: StandaloneEditorOptions
): PluginWithState<SelectionPluginState> {
    return new SelectionPlugin(options);
}
