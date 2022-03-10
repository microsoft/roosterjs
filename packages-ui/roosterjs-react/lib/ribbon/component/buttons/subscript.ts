import RibbonButton from '../../type/RibbonButton';
import { toggleSubscript } from 'roosterjs-editor-api';

/**
 * Key of localized strings of Subscript button
 */
export type SubscriptButtonStringKey = 'buttonNameSubscript';

/**
 * "Subscript" button on the format ribbon
 */
export const subscript: RibbonButton<SubscriptButtonStringKey> = {
    key: 'buttonNameSubscript',
    unlocalizedText: 'Subscript',
    iconName: 'Subscript',
    checked: formatState => formatState.isSubscript,
    onClick: editor => {
        toggleSubscript(editor);
        return true;
    },
};
