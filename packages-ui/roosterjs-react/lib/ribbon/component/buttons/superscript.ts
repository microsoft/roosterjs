import RibbonButton from '../../type/RibbonButton';
import { toggleSuperscript } from 'roosterjs-editor-api';

/**
 * Key of localized strings of Superscript button
 */
export type SuperscriptButtonStringKey = 'buttonNameSuperscript';

/**
 * "Superscript" button on the format ribbon
 */
export const superscript: RibbonButton<SuperscriptButtonStringKey> = {
    key: 'buttonNameSuperscript',
    unlocalizedText: 'Superscript',
    iconName: 'Superscript',
    checked: formatState => formatState.isSuperscript,
    onClick: editor => {
        toggleSuperscript(editor);
        return true;
    },
};
