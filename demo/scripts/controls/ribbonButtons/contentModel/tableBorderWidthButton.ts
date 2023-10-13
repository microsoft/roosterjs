import { isContentModelEditor } from 'roosterjs-content-model-editor';
import { RibbonButton } from 'roosterjs-react';

const WIDTH = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

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
    onClick: (editor, size) => {
        if (isContentModelEditor(editor)) {
            editor.setTableBorderWidth(size);
        }
        return true;
    },
};
