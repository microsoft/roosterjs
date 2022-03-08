import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { Indentation } from 'roosterjs-editor-types';
import { setIndentation } from 'roosterjs-editor-api';

/**
 * Key of localized strings of Decrease indent size button
 */
export type DecreaseIndentButtonStringKey = 'buttonNameDecreaseIntent';

/**
 * "Decrease indent" button on the format ribbon
 */
export const decreaseIndent: RibbonButton<DecreaseIndentButtonStringKey> = {
    key: 'buttonNameDecreaseIntent',
    unlocalizedText: 'Decrease indent',
    iconName: 'DecreaseIndentLegacy',
    onClick: editor => {
        setIndentation(editor, Indentation.Decrease);
    },
};
