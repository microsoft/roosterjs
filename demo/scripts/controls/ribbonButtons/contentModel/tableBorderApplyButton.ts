import MainPaneBase from '../../MainPaneBase';
import { applyTableBorderFormat } from 'roosterjs-content-model-api';
import { BorderOperations } from 'roosterjs-content-model-types';
import { isContentModelEditor } from 'roosterjs-content-model-editor';
import { RibbonButton } from 'roosterjs-react';

const TABLE_OPERATIONS: Record<string, BorderOperations> = {
    menuNameTableAllBorder: 'allBorders',
    menuNameTableNoBorder: 'noBorders',
    menuNameTableLeftBorder: 'leftBorders',
    menuNameTableRightBorder: 'rightBorders',
    menuNameTableTopBorder: 'topBorders',
    menuNameTableBottomBorder: 'bottomBorders',
    menuNameTableInsideBorder: 'insideBorders',
    menuNameTableOutsideBorder: 'outsideBorders',
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
