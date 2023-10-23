import ContentModelRibbonButton from './ContentModelRibbonButton';
import { toggleNumbering } from 'roosterjs-content-model-editor';
import { NumberedListButtonStringKey } from 'roosterjs-react';

/**
 * @internal
 * "Numbering list" button on the format ribbon
 */
export const numberedListButton: ContentModelRibbonButton<NumberedListButtonStringKey> = {
    key: 'buttonNameNumberedList',
    unlocalizedText: 'Numbered List',
    iconName: 'NumberedList',
    isChecked: formatState => formatState.isNumbering,
    onClick: editor => {
        toggleNumbering(editor);
        return true;
    },
};
