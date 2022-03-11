import RibbonButton from '../../type/RibbonButton';
import { FONT_SIZES, setFontSize } from 'roosterjs-editor-api';

/**
 * Key of localized strings of Font size button
 */
export type FontSizeButtonStringKey = 'buttonNameFontSize';

/**
 * "Font Size" button on the format ribbon
 */
export const fontSize: RibbonButton<FontSizeButtonStringKey> = {
    key: 'buttonNameFontSize',
    unlocalizedText: 'Font size',
    iconName: 'FontSize',
    dropDownItems: FONT_SIZES.reduce((map, size) => {
        map[size + 'pt'] = size.toString();
        return map;
    }, <Record<string, string>>{}),
    selectedItem: formatState => formatState.fontSize,
    onClick: (editor, size) => {
        setFontSize(editor, size);
    },
    allowLivePreview: true,
};
