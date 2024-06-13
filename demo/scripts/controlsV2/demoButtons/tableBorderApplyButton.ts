import { applyTableBorderFormat } from 'roosterjs-content-model-api';
import { BorderOperations } from 'roosterjs-content-model-types';
import { MainPane } from '../mainPane/MainPane';
import type { RibbonButton } from 'roosterjs-react';

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
        const border = MainPane.getInstance().getTableBorder();
        applyTableBorderFormat(editor, border, TABLE_OPERATIONS[key]);
    },
};
