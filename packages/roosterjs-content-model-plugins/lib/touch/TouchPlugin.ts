import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-content-model-types';
import { repositionTouchSelection } from './repositionTouchSelection';

/**
 * Touch plugin to manage touch behaviors
 */
export class TouchPlugin implements EditorPlugin {
    private editor: IEditor | null = null;

    /**
     * Create an instance of Touch plugin
     */
    constructor() {}

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'Touch';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (!this.editor) {
            return;
        }
        switch (event.eventType) {
            case 'pointerUp':
                repositionTouchSelection(this.editor);
                break;
            case 'pointerDoubleClick':
                const selection = this.editor.getDocument()?.getSelection();
                if (!selection) {
                    return;
                }

                const node = selection.focusNode;
                if (node?.nodeType !== Node.TEXT_NODE) {
                    return;
                }

                const offset = selection.focusOffset;
                const text = node.nodeValue || '';
                const char = text.charAt(offset);

                // Check if the clicked character is a punctuation mark, then highlight that character only
                if (/[.,;:]/.test(char)) {
                    const newRange = this.editor.getDocument()?.createRange();
                    if (newRange) {
                        newRange.setStart(node, offset);
                        newRange.setEnd(node, offset + 1);
                        this.editor.setDOMSelection({
                            type: 'range',
                            range: newRange,
                            isReverted: false,
                        });
                    }
                } else if (/\s/.test(char)) {
                    // If the clicked character is an open space with no word of right side
                    const rightSideOfChar = text.substring(offset, text.length);
                    const isRightSideAllSpaces =
                        rightSideOfChar.length > 0 && !/\S/.test(rightSideOfChar);
                    if (isRightSideAllSpaces) {
                        // select the first space only
                        let start = offset;
                        while (start > 0 && /\s/.test(text.charAt(start - 1))) {
                            start--;
                        }
                        const newRange = this.editor.getDocument()?.createRange();
                        if (newRange) {
                            newRange.setStart(node, start);
                            newRange.setEnd(node, start + 1);
                            this.editor.setDOMSelection({
                                type: 'range',
                                range: newRange,
                                isReverted: false,
                            });
                        }
                    }
                }
                break;
        }
    }
}
