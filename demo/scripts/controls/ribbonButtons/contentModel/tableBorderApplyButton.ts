import MainPaneBase from '../../MainPaneBase';
import { BorderOperations } from 'roosterjs-content-model-editor/lib/publicApi/table/applyTableBorderFormat';
import { RibbonButton } from 'roosterjs-react';
import {
    applyTableBorderFormatOperation,
    isContentModelEditor,
} from 'roosterjs-content-model-editor';

/**
 * UNFINISHED
 * A map for all Border options and keys in yet to be made dropdown menu.
 */
export const tableBorderApplyButton: RibbonButton<'ribbonButtonTableBorder'> = {
    key: 'ribbonButtonTableBorder',
    iconName: 'TableComputed',
    unlocalizedText: 'Table Border',
    isDisabled: formatState => !formatState.isInTable,
    dropDownMenu: {
        items: {
            menuNameTableBorder: 'All Borders',
        },
    },
    onClick: (editor, key) => {
        if (isContentModelEditor(editor) && key != 'ribbonButtonTableBorder') {
            const border = MainPaneBase.getInstance().getTableBorder();
            applyTableBorderFormatOperation(editor, border, BorderOperations.AllBorders);
        }
    },
};
