import { editTable, isContentModelEditor } from 'roosterjs-content-model';
import { RibbonButton } from 'roosterjs-react';
import { TableOperation } from 'roosterjs-editor-types';

export const editTableButton: RibbonButton<'ribbonButtonTableEdit'> = {
    key: 'ribbonButtonTableEdit',
    iconName: 'TableComputed',
    unlocalizedText: 'Edit Table',
    isDisabled: formatState => !formatState.isInTable,
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            editTable(editor, TableOperation.AlignCenter);
        }
    },
};
