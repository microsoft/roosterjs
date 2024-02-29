import { isElementOfType, isNodeOfType, toArray } from 'roosterjs-content-model-dom';
import { isModifierKey } from '../publicApi/domUtils/eventUtils';
import type {
    DOMSelection,
    IEditor,
    PluginEvent,
    PluginWithState,
    SelectionPluginState,
    EditorOptions,
} from 'roosterjs-content-model-types';

const MouseMiddleButton = 1;
const MouseRightButton = 2;

class SelectionPlugin implements PluginWithState<SelectionPluginState> {
    private editor: IEditor | null = null;
    private state: SelectionPluginState;
    private disposer: (() => void) | null = null;
    private isSafari = false;
    private isMac = false;

    constructor(options: EditorOptions) {
        this.state = {
            selection: null,
            selectionStyleNode: null,
            imageSelectionBorderColor: options.imageSelectionBorderColor,
        };
    }

    getName() {
        return 'Selection';
    }

    initialize(editor: IEditor) {
        this.editor = editor;

        const doc = this.editor.getDocument();
        const styleNode = doc.createElement('style');

        doc.head.appendChild(styleNode);
        this.state.selectionStyleNode = styleNode;

        const env = this.editor.getEnvironment();
        const document = this.editor.getDocument();

        this.isSafari = !!env.isSafari;
        this.isMac = !!env.isMac;

        if (this.isSafari) {
            document.addEventListener('selectionchange', this.onSelectionChangeSafari);
            this.disposer = this.editor.attachDomEvent({ focus: { beforeDispatch: this.onFocus } });
        } else {
            this.disposer = this.editor.attachDomEvent({
                focus: { beforeDispatch: this.onFocus },
                blur: { beforeDispatch: this.onBlur },
            });
        }
    }

    dispose() {
        this.editor
            ?.getDocument()
            .removeEventListener('selectionchange', this.onSelectionChangeSafari);

        if (this.state.selectionStyleNode) {
            this.state.selectionStyleNode.parentNode?.removeChild(this.state.selectionStyleNode);
            this.state.selectionStyleNode = null;
        }

        if (this.disposer) {
            this.disposer();
            this.disposer = null;
        }

        this.editor = null;
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
            case 'mouseUp':
                if (
                    (image = this.getClickingImage(event.rawEvent)) &&
                    image.isContentEditable &&
                    event.rawEvent.button != MouseMiddleButton &&
                    (event.rawEvent.button ==
                        MouseRightButton /* it's not possible to drag using right click */ ||
                        event.isClicking)
                ) {
                    this.selectImage(this.editor, image);
                }
                break;

            case 'mouseDown':
                selection = this.editor.getDOMSelection();
                if (
                    event.rawEvent.button === MouseRightButton &&
                    (image =
                        this.getClickingImage(event.rawEvent) ??
                        this.getContainedTargetImage(event.rawEvent, selection)) &&
                    image.isContentEditable
                ) {
                    this.selectImage(this.editor, image);
                } else if (
                    selection?.type == 'image' &&
                    selection.image !== event.rawEvent.target
                ) {
                    this.selectBeforeImage(this.editor, selection.image);
                }
                break;

            case 'keyDown':
                const rawEvent = event.rawEvent;
                const key = rawEvent.key;
                selection = this.editor.getDOMSelection();

                if (
                    !rawEvent.shiftKey &&
                    selection?.type == 'image' &&
                    selection.image.parentNode
                ) {
                    if (key === 'Escape' && !isModifierKey(rawEvent)) {
                        this.selectBeforeImage(this.editor, selection.image);
                        event.rawEvent.stopPropagation();
                    } else if (
                        (key !== 'Delete' && key !== 'Backspace' && !isModifierKey(rawEvent)) ||
                        (key !== 'Escape' &&
                            isModifierKey(rawEvent) &&
                            !this.getClickingImage(rawEvent))
                    ) {
                        this.selectBeforeImage(this.editor, selection.image);
                    }
                }
                break;
        }
    }

    private selectImage(editor: IEditor, image: HTMLImageElement) {
        editor.setDOMSelection({
            type: 'image',
            image: image,
        });
    }

    private selectBeforeImage(editor: IEditor, image: HTMLImageElement) {
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
                isReverted: false,
            });
        }
    }

    private getClickingImage(event: UIEvent): HTMLImageElement | null {
        const target = event.target as Node;

        return isNodeOfType(target, 'ELEMENT_NODE') && isElementOfType(target, 'img')
            ? target
            : null;
    }

    //MacOS will not create a mouseUp event if contextMenu event is not prevent defaulted.
    //Make sure we capture image target even if image is wrapped
    private getContainedTargetImage = (
        event: MouseEvent,
        previousSelection: DOMSelection | null
    ): HTMLImageElement | null => {
        if (!this.isMac || !previousSelection || previousSelection.type !== 'image') {
            return null;
        }

        const target = event.target as Node;
        if (
            isNodeOfType(target, 'ELEMENT_NODE') &&
            isElementOfType(target, 'span') &&
            target.firstChild === previousSelection.image
        ) {
            return previousSelection.image;
        }
        return null;
    };

    private onFocus = () => {
        if (!this.state.skipReselectOnFocus && this.state.selection) {
            this.editor?.setDOMSelection(this.state.selection);
        }

        if (this.state.selection?.type == 'range' && !this.isSafari) {
            // Editor is focused, now we can get live selection. So no need to keep a selection if the selection type is range.
            this.state.selection = null;
        }
    };

    private onBlur = () => {
        if (!this.state.selection && this.editor) {
            this.state.selection = this.editor.getDOMSelection();
        }
    };

    private onSelectionChangeSafari = () => {
        if (this.editor?.hasFocus() && !this.editor.isInShadowEdit()) {
            // Safari has problem to handle onBlur event. When blur, we cannot get the original selection from editor.
            // So we always save a selection whenever editor has focus. Then after blur, we can still use this cached selection.
            const newSelection = this.editor.getDOMSelection();

            if (newSelection?.type == 'range') {
                this.state.selection = newSelection;
            }
        }
    };
}

/**
 * @internal
 * Create a new instance of SelectionPlugin.
 * @param option The editor option
 */
export function createSelectionPlugin(
    options: EditorOptions
): PluginWithState<SelectionPluginState> {
    return new SelectionPlugin(options);
}
