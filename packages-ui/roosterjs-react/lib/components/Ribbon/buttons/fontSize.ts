import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { FONT_SIZES, setFontSize } from 'roosterjs-editor-api';

/**
 * "Font Size" button on the format ribbon
 */
export const fontSize: RibbonButton = {
    key: 'fontSize',
    unlocalizedText: 'Font size',
    iconName: 'FontSize',
    dropDownItems: FONT_SIZES.reduce((map, size) => {
        map[size + 'pt'] = size.toString();
        return map;
    }, <Record<string, string>>{}),
    onClick: (editor, size) => {
        setFontSize(editor, size);
    },
    allowLivePreview: true,
};
