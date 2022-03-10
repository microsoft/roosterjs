import RibbonButton from '../../type/RibbonButton';
import { Indentation } from 'roosterjs-editor-types';
import { setIndentation } from 'roosterjs-editor-api';

/**
 * Key of localized strings of Increase indent size button
 */
export type IncreaseIndentButtonStringKey = 'buttonNameIncreaseIndent';

/**
 * "Increase indent" button on the format ribbon
 */
export const increaseIndent: RibbonButton<IncreaseIndentButtonStringKey> = {
    key: 'buttonNameIncreaseIndent',
    unlocalizedText: 'Increase indent',
    iconName: 'IncreaseIndentLegacy',
    onClick: editor => {
        setIndentation(editor, Indentation.Increase);
    },
};
