import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { toggleNumbering } from 'roosterjs-editor-api';

/**
 * Key of localized strings of Numbered list button
 */
export type NumberedListButtonStringKey = 'buttonNameNumberedList';

/**
 * "Numbered list" button on the format ribbon
 */
export const numberedList: RibbonButton<NumberedListButtonStringKey> = {
    key: 'buttonNameNumberedList',
    unlocalizedText: 'Numbered list',
    iconName: 'NumberedList',
    checked: formatState => formatState.isNumbering,
    onClick: editor => {
        toggleNumbering(editor);
        return true;
    },
};
