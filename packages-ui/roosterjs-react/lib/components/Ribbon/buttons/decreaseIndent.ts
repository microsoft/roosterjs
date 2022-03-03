import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { Indentation } from 'roosterjs-editor-types';
import { setIndentation } from 'roosterjs-editor-api';

/**
 * "Decrease indent" button on the format ribbon
 */
export const decreaseIndent: RibbonButton = {
    key: 'decreaseIndent',
    unlocalizedText: 'Decrease indent',
    iconName: 'DecreaseIndentLegacy',
    onClick: editor => {
        setIndentation(editor, Indentation.Decrease);
    },
};
