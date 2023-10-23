import ContentModelRibbonButton from './ContentModelRibbonButton';
import MainPaneBase from '../../MainPaneBase';
import { applyTableBorderFormat } from 'roosterjs-content-model-editor';

/**
 * UNFINISHED
 * A map for all Border options and keys in yet to be made dropdown menu.
 */
export const tableBorderApplyButton: ContentModelRibbonButton<'ribbonButtonTableBorder'> = {
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
        if (key != 'ribbonButtonTableBorder') {
            const border = MainPaneBase.getInstance().getTableBorder();
            applyTableBorderFormat(editor, border, 'AllBorders');
        }
    },
};
