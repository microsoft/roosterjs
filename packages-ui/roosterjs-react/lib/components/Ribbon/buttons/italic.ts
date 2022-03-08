import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { toggleItalic } from 'roosterjs-editor-api';

/**
 * Key of localized strings of Italic button
 */
export type ItalicButtonStringKey = 'buttonNameItalic';

/**
 * "Italic" button on the format ribbon
 */
export const italic: RibbonButton<ItalicButtonStringKey> = {
    key: 'buttonNameItalic',
    unlocalizedText: 'Italic',
    iconName: 'Italic',
    checked: formatState => formatState.isItalic,
    onClick: editor => {
        toggleItalic(editor);
        return true;
    },
};
