import applyInlineStyle from '../utils/applyInlineStyle';

//import replaceRangeWithNode from '../../lib/format/replaceWithNode';
import { IEditor } from 'roosterjs-editor-types';
import { Capitalization, ExperimentalFeatures, NodeType } from 'roosterjs-editor-types';
import { getFirstLeafNode, getNextLeafSibling } from 'roosterjs-editor-dom';

/**
 * Set capitalize at selection
 * @param editor The editor instance
 * @param capitalization The case option
 * Currently there's no validation to the string, if the passed string is invalid, it won't take affect
 */
export default function setCapitalization(editor: IEditor, capitalization: Capitalization) {
    if (editor.isFeatureEnabled(ExperimentalFeatures.Capitalization)) {
        applyInlineStyle(editor, element => {
            for (
                let node = getFirstLeafNode(element);
                node;
                node = getNextLeafSibling(element, node)
            ) {
                if (node.nodeType == NodeType.Text) {
                    capitalizeText(node);
                }
            }
        });
    }

    function capitalizeText(node: Node) {
        // To get the capitalized text, we let the textTransform style do it for us which will take into account
        // the language-specific case mapping rules (https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform).
        // To retrieve the rendered text, we need a temporary node that is not hidden (so we add it to the document temporarily).
        let document = editor.getDocument();
        if (document) {
            let tempNode = document.createElement('div');
            // We need the whiteSpace to be set to Preserve so that spaces are not stripped
            tempNode.style.whiteSpace = 'pre';
            document.body.appendChild(tempNode);
            tempNode.innerText = node.textContent;
            tempNode.style.textTransform = capitalization;
            let transformedText = tempNode.innerText;
            document.body.removeChild(tempNode);
            //NULL CHECKS - set to strict?
            node.textContent = transformedText;
        }
    }
}
