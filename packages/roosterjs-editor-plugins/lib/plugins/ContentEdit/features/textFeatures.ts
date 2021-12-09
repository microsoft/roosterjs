import { narratorMessage } from 'roosterjs-editor-dom';
import {
    BuildInEditFeature,
    Keys,
    PluginKeyboardEvent,
    TextFeatureSettings,
} from 'roosterjs-editor-types';

/**
 * A content edit feature to trigger the last character that is going to be removed.
 */
const TextSpeechOnBackspace: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.BACKSPACE],
    shouldHandleEvent: (event, editor) => {
        const range = editor.getSelectionRange();
        const text = range.commonAncestorContainer.textContent;
        return (
            range.collapsed &&
            range.commonAncestorContainer.nodeType == Node.TEXT_NODE &&
            text.length - 1 <= range.endOffset
        );
    },
    handleEvent: (event, editor) => {
        const range = editor.getSelectionRange();
        const text = range.commonAncestorContainer.textContent;
        const msg = text.substring(range.endOffset - 1, range.endOffset);
        narratorMessage(editor, msg, 'assertive');
    },
};
/**
 * @internal
 */
export const TextFeatures: Record<
    keyof TextFeatureSettings,
    BuildInEditFeature<PluginKeyboardEvent>
> = {
    textSpeechOnBackspace: TextSpeechOnBackspace,
};
