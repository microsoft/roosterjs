import RibbonButton from '../../type/RibbonButton';
import { toggleUnderline } from 'roosterjs-editor-api';

/**
 * Key of localized strings of Underline button
 */
export type UnderlineButtonStringKey = 'buttonNameUnderline';

/**
 * "Underline" button on the format ribbon
 */
export const underline: RibbonButton<UnderlineButtonStringKey> = {
    key: 'buttonNameUnderline',
    unlocalizedText: 'Underline',
    iconName: 'Underline',
    checked: formatState => formatState.isUnderline,
    onClick: editor => {
        toggleUnderline(editor);
        return true;
    },
};
