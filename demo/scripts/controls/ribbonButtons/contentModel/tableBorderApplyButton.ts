import MainPaneBase from '../../MainPaneBase';
import { applyTableBorderFormat, isContentModelEditor } from 'roosterjs-content-model-editor';
import { BorderOperations } from 'roosterjs-content-model-editor';
import { RibbonButton } from 'roosterjs-react';

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
            applyTableBorderFormat(editor, border, BorderOperations.AllBorders);
        }
    },
};
