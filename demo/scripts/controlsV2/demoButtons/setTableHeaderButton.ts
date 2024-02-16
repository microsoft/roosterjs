import { formatTable, getFormatState } from 'roosterjs-content-model-api';
import type { RibbonButton } from '../roosterjsReact/ribbon';

export const setTableHeaderButton: RibbonButton<'ribbonButtonSetTableHeader'> = {
    key: 'ribbonButtonSetTableHeader',
    unlocalizedText: 'Toggle table header',
    iconName: 'Header',
    isDisabled: formatState => !formatState.isInTable,
    onClick: editor => {
        const format = getFormatState(editor);
        formatTable(editor, { hasHeaderRow: !format.tableHasHeader }, true /*keepCellShade*/);
    },
};
