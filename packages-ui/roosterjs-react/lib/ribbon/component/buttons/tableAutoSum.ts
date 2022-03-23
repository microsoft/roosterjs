import RibbonButton from '../../type/RibbonButton';
import { editTable } from 'roosterjs-editor-api';
import { TableAutoSumButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { TableOperation } from 'roosterjs-editor-types';

/**
 * @internal
 * "Sum table row" button on the format ribbon
 */
export const tableAutoSum: RibbonButton<TableAutoSumButtonStringKey> = {
    key: 'buttonNameTableAutoSum',
    unlocalizedText: 'Table Auto Sum',
    iconName: 'TableComputed',

    onClick: editor => {
        editTable(editor, TableOperation.AutoSum);
    },
};
