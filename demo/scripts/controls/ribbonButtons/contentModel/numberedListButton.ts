import { isContentModelEditor, toggleNumbering } from 'roosterjs-content-model-editor';
import { NumberedListButtonStringKey, RibbonButton } from 'roosterjs-react';

/**
 * @internal
 * "Numbering list" button on the format ribbon
 */
export const numberedListButton: RibbonButton<NumberedListButtonStringKey> = {
    key: 'buttonNameNumberedList',
    unlocalizedText: 'Numbered List',
    iconName: 'NumberedList',
    isChecked: formatState => formatState.isNumbering,
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            toggleNumbering(editor);
        }
        return true;
    },
};
