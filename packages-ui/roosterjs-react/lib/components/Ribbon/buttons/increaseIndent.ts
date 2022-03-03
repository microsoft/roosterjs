import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { Indentation } from 'roosterjs-editor-types';
import { setIndentation } from 'roosterjs-editor-api';

/**
 * "Increase indent" button on the format ribbon
 */
export const increaseIndent: RibbonButton = {
    key: 'increaseIndent',
    unlocalizedText: 'Increase indent',
    iconName: 'IncreaseIndentLegacy',
    onClick: editor => {
        setIndentation(editor, Indentation.Increase);
    },
};
