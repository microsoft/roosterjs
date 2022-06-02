import {
    EditorPlugin,
    ExperimentalFeatures,
    IEditor,
    PluginEvent,
    PluginEventType,
    PositionType,
} from 'roosterjs-editor-types';

const specialCharacters = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

/**
 * Automatically transform -- into hyphen, if typed between two words.
 */
export default class AutoFormat implements EditorPlugin {
    private editor: IEditor;
    private isHyphenTyped = false;
    private shouldFormat = false;

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
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (
            event.eventType === PluginEventType.KeyDown &&
            this.editor.isFeatureEnabled(ExperimentalFeatures.AutoHyphen)
        ) {
            const keyTyped = event.rawEvent.key;

            if (keyTyped === '-') {
                this.isHyphenTyped = true;
            }

            if (this.isHyphenTyped && keyTyped === '-') {
                this.shouldFormat = true;
            } else {
                this.isHyphenTyped = false;
            }

            if (
                this.shouldFormat &&
                keyTyped.length === 1 &&
                !specialCharacters.test(keyTyped) &&
                keyTyped !== ' '
            ) {
                const searcher = this.editor.getContentSearcherOfCursor(event);
                const textBeforeCursor = searcher.getSubStringBefore(3);
                if (textBeforeCursor[0] === ' ') {
                    this.isHyphenTyped = false;
                    return;
                }
                const dashes = searcher.getSubStringBefore(2);
                const textRange = searcher.getRangeFromText(dashes, true /* exactMatch */);
                const nodeHyphen = document.createTextNode('—');
                this.editor.addUndoSnapshot(
                    () => {
                        textRange.deleteContents();
                        textRange.insertNode(nodeHyphen);
                        this.editor.select(nodeHyphen, PositionType.End);
                    },
                    null /*changeSource*/,
                    true /*canUndoByBackspace*/
                );
                this.isHyphenTyped = false;
                this.shouldFormat = false;
            }
        }
    }
}
