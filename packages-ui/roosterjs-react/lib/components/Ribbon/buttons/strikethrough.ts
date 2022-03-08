import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { toggleStrikethrough } from 'roosterjs-editor-api';

/**
 * Key of localized strings of Strikethrough button
 */
export type StrikethroughButtonStringKey = 'buttonNameStrikethrough';

/**
 * "Strikethrough" button on the format ribbon
 */
export const strikethrough: RibbonButton<StrikethroughButtonStringKey> = {
    key: 'buttonNameStrikethrough',
    unlocalizedText: 'Strikethrough',
    iconName: 'Strikethrough',
    checked: formatState => formatState.isStrikeThrough,
    onClick: editor => {
        toggleStrikethrough(editor);
        return true;
    },
};
