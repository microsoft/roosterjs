import { IEditor } from 'roosterjs-editor-types';
import { Capitalization, NodeType } from 'roosterjs-editor-types';
import applyInlineStyle from '../utils/applyInlineStyle';
import { getFirstLeafNode, getNextLeafSibling } from 'roosterjs-editor-dom';

/**
 * Change the capitalization of text in the selection
 * @param editor The editor instance
 * @param capitalization The case option
 */
export default function changeCapitalization(
    editor: IEditor,
    capitalization: Capitalization,
    language?: string
) {
    applyInlineStyle(editor, element => {
        for (let node = getFirstLeafNode(element); node; node = getNextLeafSibling(element, node)) {
            if (node.nodeType == NodeType.Text) {
                node.textContent = getCapitalizedText(node.textContent);
            }
        }
    });

    function getCapitalizedText(originalText: string): string {
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
                // at the beginning of a string with or without preceding whitespace
                // or preceded by a punctuation mark and at least one whitespace.
                const regex = new RegExp('^\\s*\\w|' + punctuationMarks + '\\s+\\w', 'g');
                return originalText.toLocaleLowerCase(language).replace(regex, match => {
                    return match.toUpperCase();
                });
        }
    }
}
