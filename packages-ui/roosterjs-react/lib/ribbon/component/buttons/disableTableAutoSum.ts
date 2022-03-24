import RibbonButton from '../../type/RibbonButton';
import { DisableTableAutoSumButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { editTable } from 'roosterjs-editor-api';
import { FormatState, TableOperation } from 'roosterjs-editor-types';

/**
 * @internal
 * "Sum table row" button on the format ribbon
 */
export const disableTableAutoSum: RibbonButton<DisableTableAutoSumButtonStringKey> = {
    key: 'buttonNameDisableTableAutoSum',
    unlocalizedText: 'Disable table auto sum',
    iconName: 'TableComputed',
    isDisabled: (format: FormatState) => {
        if (format.isInTable) {
            return false;
        }
        return true;
    },
    onClick: editor => {
        editTable(editor, TableOperation.DisableAutoSum);
    },
};
