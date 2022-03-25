import RibbonButton from '../../type/RibbonButton';
import { editTable } from 'roosterjs-editor-api';
import { FormatState, TableOperation } from 'roosterjs-editor-types';
import { TableAutoSumButtonStringKey } from '../../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Sum table row" button on the format ribbon
 */
export const tableAutoSum: RibbonButton<TableAutoSumButtonStringKey> = {
    key: 'buttonNameTableAutoSum',
    unlocalizedText: 'Table Auto Sum',
    iconName: 'TableComputed',
    isChecked: (format: FormatState) => {
        if (format.isAutoSumActive) {
            return true;
        }
        return false;
    },
    isDisabled: (format: FormatState) => {
        if (format.isInTable) {
            return false;
        }
        return true;
    },
    onClick: editor => {
        if (editor.isAutoSumActive()) {
            editTable(editor, TableOperation.DisableAutoSum);
        } else {
            editTable(editor, TableOperation.AutoSum);
        }
    },
};
