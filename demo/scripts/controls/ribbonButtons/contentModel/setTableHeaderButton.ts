import ContentModelRibbonButton from './ContentModelRibbonButton';
import { formatTable, getFormatState } from 'roosterjs-content-model-editor';

export const setTableHeaderButton: ContentModelRibbonButton<'ribbonButtonSetTableHeader'> = {
    key: 'ribbonButtonSetTableHeader',
    unlocalizedText: 'Toggle table header',
    iconName: 'Header',
    isDisabled: formatState => !formatState.isInTable,
    onClick: editor => {
        const format = getFormatState(editor);
        formatTable(editor, { hasHeaderRow: !format.tableHasHeader }, true /*keepCellShade*/);
    },
};
