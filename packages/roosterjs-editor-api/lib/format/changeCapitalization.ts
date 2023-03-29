import applyInlineStyle from '../utils/applyInlineStyle';
import { Capitalization, IEditor, NodeType } from 'roosterjs-editor-types';
import { getFirstLeafNode, getNextLeafSibling } from 'roosterjs-editor-dom';
import type { CompatibleCapitalization } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * Change the capitalization of text in the selection
 * @param editor The editor instance
 * @param capitalization The case option
 * @param language Optional parameter for language string that should comply to "IETF BCP 47 Tags for
 * Identifying Languages". For example: 'en' or 'en-US' for English, 'tr' for Turkish.
 * Default is the host environment’s current locale.
 */
export default function changeCapitalization(
    editor: IEditor,
    capitalization: Capitalization | CompatibleCapitalization,
    language?: string
) {
    applyInlineStyle(
        editor,
        element => {
            for (
                let node = getFirstLeafNode(element);
                node;
                node = getNextLeafSibling(element, node)
            ) {
                if (node.nodeType == NodeType.Text) {
                    try {
                        node.textContent = getCapitalizedText(node.textContent, language);
                    } catch {
                        node.textContent = getCapitalizedText(node.textContent, undefined);
                    }
                }
            }
        },
        'changeCapitalization'
    );

    function getCapitalizedText(
        originalText: string | null,
        language: string | undefined
    ): string | null {
        if (originalText === null) {
            return originalText;
        }
        switch (capitalization) {
            case Capitalization.Lowercase:
                return originalText.toLocaleLowerCase(language);
            case Capitalization.Uppercase:
                return originalText.toLocaleUpperCase(language);
            case Capitalization.CapitalizeEachWord:
                const wordArray = originalText.toLocaleLowerCase(language).split(' ');
                for (let i = 0; i < wordArray.length; i++) {
                    wordArray[i] =
                        wordArray[i].charAt(0).toLocaleUpperCase(language) + wordArray[i].slice(1);
                }
                return wordArray.join(' ');
            case Capitalization.Sentence:
                // TODO: Add rules on punctuation for internationalization - TASK 104769
                const punctuationMarks = '[\\.\\!\\?]';
                // Find a match of a word character either:
                // - At the beginning of a string with or without preceding whitespace, for
                // example: '  hello world' and 'hello world' strings would both match 'h'.
                // - Or preceded by a punctuation mark and at least one whitespace, for
                // example 'yes. hello world' would match 'y' and 'h'.
                const regex = new RegExp('^\\s*\\w|' + punctuationMarks + '\\s+\\w', 'g');
                return originalText.toLocaleLowerCase(language).replace(regex, match => {
                    return match.toLocaleUpperCase(language);
                });
            default:
                return originalText;
        }
    }
}
