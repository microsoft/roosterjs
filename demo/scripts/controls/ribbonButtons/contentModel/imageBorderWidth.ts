import isContentModelEditor from '../../editor/isContentModelEditor';
import { RibbonButton } from 'roosterjs-react';
import { setImageBorder } from 'roosterjs-content-model';

const WIDTH = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

/**
 * @internal
 * "Image Border Width" button on the format ribbon
 */
export const imageBorderWidth: RibbonButton<'buttonNameImageBorderWidth'> = {
    key: 'buttonNameImageBorderWidth',
    unlocalizedText: 'Image Border Width',
    iconName: 'Photo2',
    isDisabled: formatState => !formatState.canAddImageAltText,
    dropDownMenu: {
        items: WIDTH.reduce((map, size) => {
            map[size + 'pt'] = size.toString();
            return map;
        }, <Record<string, string>>{}),
        allowLivePreview: true,
    },
    onClick: (editor, size) => {
        if (isContentModelEditor(editor)) {
            setImageBorder(
                editor,
                undefined /** color */,
                undefined /** style */,
                size,
                true /**isPt */
            );
        }
        return true;
    },
};
