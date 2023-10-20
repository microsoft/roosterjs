import MainPaneBase from '../../MainPaneBase';
import { applyTableBorderFormat, isContentModelEditor } from 'roosterjs-content-model-editor';
import { RibbonButton } from 'roosterjs-react';

const TABLE_OPERATIONS = {
    menuNameTableAllBorder: 'AllBorders',
    menuNameTableNoBorder: 'NoBorders',
    menuNameTableLeftBorder: 'LeftBorders',
    menuNameTableRightBorder: 'RightBorders',
    menuNameTableTopBorder: 'TopBorders',
    menuNameTableBottomBorder: 'BottomBorders',
    menuNameTableInsideBorder: 'InsideBorders',
    menuNameTableOutsideBorder: 'OutsideBorders',
};

export const tableBorderApplyButton: RibbonButton<'ribbonButtonTableBorder'> = {
    key: 'ribbonButtonTableBorder',
    iconName: 'TableComputed',
    unlocalizedText: 'Table Border',
    isDisabled: formatState => !formatState.isInTable,
    dropDownMenu: {
        items: {
            menuNameTableAllBorder: 'All Borders',
            menuNameTableNoBorder: 'No Borders',
            menuNameTableLeftBorder: 'Left Borders',
            menuNameTableRightBorder: 'Right Borders',
            menuNameTableTopBorder: 'Top Borders',
            menuNameTableBottomBorder: 'Bottom Borders',
            menuNameTableInsideBorder: 'Inside Borders',
            menuNameTableOutsideBorder: 'Outside Borders',
        },
    },
    onClick: (editor, key) => {
        if (isContentModelEditor(editor) && key != 'ribbonButtonTableBorder') {
            const border = MainPaneBase.getInstance().getTableBorder();
            applyTableBorderFormat(editor, border, TABLE_OPERATIONS[key]);
        }
    },
};
