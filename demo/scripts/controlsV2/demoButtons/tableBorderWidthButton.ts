import MainPaneBase from '../../controls/MainPaneBase';
import { RibbonButton } from '../roosterjsReact/ribbon';

const WIDTH = [0.25, 0.5, 0.75, 1, 1.5, 2.25, 3, 4.5, 6];

/**
 * @internal
 * "Table Border Width" button on the format ribbon
 */
export const tableBorderWidthButton: RibbonButton<'buttonNameTableBorderWidth'> = {
    key: 'buttonNameTableBorderWidth',
    unlocalizedText: 'Table Border Width',
    iconName: 'LineThickness',
    isDisabled: formatState => !formatState.isInTable,
    dropDownMenu: {
        items: WIDTH.reduce((map, size) => {
            map[size + 'pt'] = size.toString();
            return map;
        }, <Record<string, string>>{}),
        allowLivePreview: true,
    },
    onClick: (editor, width) => {
        MainPaneBase.getInstance().setTableBorderWidth(width);
        editor.focus();

        return true;
    },
};
