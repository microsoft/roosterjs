import MainPaneBase from '../../controls/MainPaneBase';
import { RibbonButton } from '../roosterjsReact/ribbon';

const STYLES: Record<string, string> = {
    dashed: 'dashed',
    dotted: 'dotted',
    solid: 'solid',
    double: 'doubled',
    groove: 'groove',
    ridge: 'ridge',
    inset: 'inset',
    outset: 'outset',
};

/**
 * @internal
 * "Table Border Style" button on the format ribbon
 */
export const tableBorderStyleButton: RibbonButton<'buttonNameTableBorderStyle'> = {
    key: 'buttonNameTableBorderStyle',
    unlocalizedText: 'Table Border Style',
    iconName: 'LineStyle',
    isDisabled: formatState => !formatState.isInTable,
    dropDownMenu: {
        items: STYLES,
        allowLivePreview: true,
    },
    onClick: (editor, style) => {
        MainPaneBase.getInstance().setTableBorderStyle(style);
        editor.focus();

        return true;
    },
};
