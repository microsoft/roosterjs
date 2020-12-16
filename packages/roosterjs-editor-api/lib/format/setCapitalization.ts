import applyInlineStyle from '../utils/applyInlineStyle';
import { IEditor } from 'roosterjs-editor-types';
import { Capitalization, ExperimentalFeatures } from 'roosterjs-editor-types';

/**
 * Set capitalize at selection
 * @param editor The editor instance
 * @param capitalization The case option
 * Currently there's no validation to the string, if the passed string is invalid, it won't take affect
 */
export default function setCapitalization(editor: IEditor, capitalization: Capitalization) {
    if (editor.isFeatureEnabled(ExperimentalFeatures.Capitalization)) {
        applyInlineStyle(editor, (element, isInnerNode) => {
            element.style.textTransform = isInnerNode ? '' : capitalization; //what is innerNode???
        });
    }
}
