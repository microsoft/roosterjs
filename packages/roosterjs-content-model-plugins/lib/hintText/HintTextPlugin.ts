import { clearHintText } from './clearHintText';
import {
    getHintTextElement,
    hasHintTextClass,
    isNodeOfType,
    getHintText,
    setupHintTextNode,
} from 'roosterjs-content-model-dom';
import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-content-model-types';

/**
 * A plugin to handle hint text in editor
 */
export class HintTextPlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private hintText = '';

    constructor() {}

    getName() {
        return 'HintText';
    }

    initialize(editor: IEditor) {
        this.editor = editor;

        const document = this.editor.getDocument();
        document.addEventListener('selectionchange', this.onSelectionChange);
    }

    dispose() {
        const document = this.editor?.getDocument();
        document?.addEventListener('selectionchange', this.onSelectionChange);

        this.editor = null;
    }

    willHandleEventExclusively(event: PluginEvent) {
        return !!this.hintText && event.eventType == 'keyDown' && event.rawEvent.key == 'Tab';
    }

    onPluginEvent(event: PluginEvent) {
        if (!this.editor) {
            return;
        }

        switch (event.eventType) {
            case 'editorReady':
            case 'contentChanged':
            case 'rewriteFromModel':
                this.onChange(this.editor);
                break;

            case 'keyDown':
                this.onKeyDown(this.editor, event.rawEvent);
                break;
        }
    }

    private onKeyDown(editor: IEditor, event: KeyboardEvent) {
        if (this.hintText) {
            const key = event.key;
            let hintElement: HTMLSpanElement | undefined | null;

            if (
                key == this.hintText.substring(0, 1) &&
                (hintElement = getHintTextElement(editor.getDOMHelper()))
            ) {
                this.hintText = this.hintText.substring(1);
                setupHintTextNode(hintElement, this.hintText);
            } else {
                const applyText = key == 'Tab';

                clearHintText(editor, applyText);

                if (applyText) {
                    event.preventDefault();
                }
            }
        }
    }

    private onChange(editor: IEditor) {
        const hintElement = getHintTextElement(editor.getDOMHelper());

        if (hintElement) {
            this.hintText = getHintText(hintElement);

            if (!this.hintText) {
                hintElement.remove();
            }
        } else {
            this.hintText = '';
        }
    }

    private onSelectionChange = () => {
        const doc = this.editor?.getDocument();
        const selection = doc?.defaultView?.getSelection();

        if (this.editor && doc && selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const node = range.startContainer;

            if (
                isNodeOfType(node, 'ELEMENT_NODE') &&
                hasHintTextClass(node) &&
                this.editor.getDOMHelper().isNodeInEditor(node)
            ) {
                const range = doc.createRange();

                range.setStartBefore(node);
                range.collapse(true /* toStart*/);

                this.editor.setDOMSelection({
                    type: 'range',
                    isReverted: false,
                    range,
                });
            }
        }
    };
}
