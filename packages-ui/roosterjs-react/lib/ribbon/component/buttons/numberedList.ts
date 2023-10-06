import { toggleNumbering } from 'roosterjs-editor-api';
import type RibbonButton from '../../type/RibbonButton';
import type { NumberedListButtonStringKey } from '../../type/RibbonButtonStringKeys';

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
