import RibbonButton from '../../type/RibbonButton';
import { NumberedListButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { toggleNumbering } from 'roosterjs-editor-api';

/**
 * @internal
 * "Numbered list" button on the format ribbon
 */
export const numberedList: RibbonButton<NumberedListButtonStringKey> = {
    key: 'buttonNameNumberedList',
    unlocalizedText: 'Numbered list',
    iconName: 'NumberedList',
    isChecked: formatState => !!formatState.isNumbering,
    onClick: editor => {
        toggleNumbering(editor);
        return true;
    },
};
