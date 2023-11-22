import { ChangeSource, PluginEventType } from 'roosterjs-editor-types';
import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-editor-types';

const specialCharacters = /[`!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;

/**
 * Automatically transform -- into hyphen, if typed between two words.
 */
export default class AutoFormat implements EditorPlugin {
    private editor: IEditor | null = null;
    private lastKeyTyped: string | null = null;
    private textRange: Range | null | undefined = null;
    private isHyphen: boolean | undefined = undefined;
    private removeSpace: boolean | undefined = undefined;
    /**
     * Get a friendly name of this plugin
     */
    getName() {
        return 'AutoFormat';
    }

    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor = null;
        this.lastKeyTyped = null;
        this.textRange = null;
        this.isHyphen = undefined;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (!this.editor) {
            return;
        }

        if (
            event.eventType === PluginEventType.ContentChanged ||
            event.eventType === PluginEventType.MouseDown ||
            event.eventType === PluginEventType.MouseUp
        ) {
            this.lastKeyTyped = '';
        }

        if (event.eventType === PluginEventType.KeyPress) {
            const keyTyped = event.rawEvent.key;

            if (keyTyped && keyTyped.length > 1) {
                this.lastKeyTyped = '';
            }

            const searcher = this.editor.getContentSearcherOfCursor(event);
            const textBeforeCursor = searcher?.getSubStringBefore(3);

            if (
                this.isHyphen &&
                (textBeforeCursor === '-- ' || textBeforeCursor === '-- ') &&
                this.textRange
            ) {
                this.removeSpace = true;
            }

            if (
                searcher &&
                textBeforeCursor &&
                this.lastKeyTyped === '-' &&
                !specialCharacters.test(keyTyped) &&
                keyTyped !== '-'
            ) {
                const dashes = searcher.getSubStringBefore(2);
                const isPrecededByADash = textBeforeCursor?.[0] === '-';

                if (
                    isPrecededByADash ||
                    (typeof textBeforeCursor === 'string' &&
                        specialCharacters.test(textBeforeCursor[0])) ||
                    dashes !== '--'
                ) {
                    return;
                }
                this.isHyphen = textBeforeCursor !== ' --';

                this.textRange = searcher.getRangeFromText(dashes, true /* exactMatch */);
                this.lastKeyTyped = null;
            } else if (
                this.textRange &&
                keyTyped === ' ' &&
                textBeforeCursor !== '--' &&
                textBeforeCursor !== ' '
            ) {
                convertToHyphen(this.editor, this.textRange, this.isHyphen, this.removeSpace);
                this.textRange = null;
                this.isHyphen = undefined;
                this.removeSpace = undefined;
            } else {
                this.lastKeyTyped = keyTyped;
            }
        }
    }
}

const convertToHyphen = (
    editor: IEditor,
    textRange: Range,
    isHyphen?: boolean,
    removeSpace?: boolean
) => {
    const doc = editor.getDocument();
    const nodeHyphen = isHyphen ? doc.createTextNode('—') : doc.createTextNode('–');
    if (removeSpace) {
        textRange.setEnd(textRange.endContainer, textRange.endOffset + 1);
    }
    editor.addUndoSnapshot(
        () => {
            textRange.deleteContents();
            textRange.insertNode(nodeHyphen);
        },
        ChangeSource.Format /*changeSource*/,
        false /*canUndoByBackspace*/,
        { formatApiName: 'autoHyphen' }
    );
};
