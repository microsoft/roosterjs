import { formatTable, isContentModelEditor } from 'roosterjs-content-model-editor';
import { getFormatState } from 'roosterjs-editor-api';
import { RibbonButton } from 'roosterjs-react';

export const setTableHeaderButton: RibbonButton<'ribbonButtonSetTableHeader'> = {
    key: 'ribbonButtonSetTableHeader',
    unlocalizedText: 'Toggle table header',
    iconName: 'Header',
    isDisabled: formatState => !formatState.isInTable,
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            const format = getFormatState(editor);
            formatTable(editor, { hasHeaderRow: !format.tableHasHeader }, true /*keepCellShade*/);
        }
    },
};
