import MainPaneBase from '../../MainPaneBase';
import { isContentModelEditor } from 'roosterjs-content-model-editor';
import { RibbonButton } from 'roosterjs-react';

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
        if (isContentModelEditor(editor)) {
            MainPaneBase.getInstance().setTableBorderWidth(width);
            editor.focus();
        }
        return true;
    },
};
