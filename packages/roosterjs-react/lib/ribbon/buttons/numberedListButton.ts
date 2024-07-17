import { toggleNumbering } from 'roosterjs-content-model-api';
import type { RibbonButton } from '../type/RibbonButton';
import type { NumberedListButtonStringKey } from '../type/RibbonButtonStringKeys';

/**
 * "Numbering list" button on the format ribbon
 */
export const numberedListButton: RibbonButton<NumberedListButtonStringKey> = {
    key: 'buttonNameNumberedList',
    unlocalizedText: 'Numbered List',
    iconName: 'NumberedList',
    isChecked: formatState => !!formatState.isNumbering,
    onClick: editor => {
        toggleNumbering(editor);
        editor.announce({
            ariaLiveMode: 'polite',
            defaultStrings: 'announceListItemNumbering',
        });
    },
};
