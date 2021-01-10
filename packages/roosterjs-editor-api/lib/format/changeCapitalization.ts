import { IEditor } from 'roosterjs-editor-types';
import { Capitalization, NodeType } from 'roosterjs-editor-types';
import applyInlineStyle from '../utils/applyInlineStyle';
import { getFirstLeafNode, getNextLeafSibling } from 'roosterjs-editor-dom';

/**
 * Change the capitalization of text in the selection
 * @param editor The editor instance
 * @param capitalization The case option
 * Currently there's no validation to the string, if the passed string is invalid, it won't take affect
 */
export default function changeCapitalization(editor: IEditor, capitalization: Capitalization) {
    applyInlineStyle(editor, element => {
        for (let node = getFirstLeafNode(element); node; node = getNextLeafSibling(element, node)) {
            if (node.nodeType == NodeType.Text) {
                // for CapitalizeEachWord, we need to set first to lowercase for it to have the correct behaviour on uppercase input text
                if (capitalization == Capitalization.Capitalize) {
                    const lowercaseText = getCapitalizedText(
                        editor,
                        node.textContent || '', //can it be null?
                        Capitalization.Lowercase
                    );
                    node.textContent = lowercaseText;
                }
                const capitalizedText = getCapitalizedText(
                    editor,
                    node.textContent || '',
                    capitalization
                );
                node.textContent = capitalizedText;
            }
        }
    });
}

export function getCapitalizedText(
    editor: IEditor,
    originalText: string,
    capitalization: Capitalization
): string | null {
    // To get the capitalized text, we let the textTransform style do it for us which will take into account
    // the language-specific case mapping rules (https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform).
    // To retrieve the rendered text, we need a temporary node that is not hidden (so we add it to the document temporarily).
    let transformedText = null;
    let document = editor.getDocument();
    if (document) {
        let tempNode = document.createElement('div');
        // We need the whiteSpace to be set to Preserve so that spaces are not stripped
        tempNode.style.whiteSpace = 'pre';
        document.body.appendChild(tempNode);
        tempNode.innerText = originalText;
        tempNode.style.textTransform = capitalization;
        transformedText = tempNode.innerText;

        document.body.removeChild(tempNode);
    }
    return transformedText;
}
