import ContentModelRibbonButton from './ContentModelRibbonButton';
import { FontSizeButtonStringKey } from 'roosterjs-react';
import { setFontSize } from 'roosterjs-content-model-editor';

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

/**
 * @internal
 * "Font Size" button on the format ribbon
 */
export const fontSizeButton: ContentModelRibbonButton<FontSizeButtonStringKey> = {
    key: 'buttonNameFontSize',
    unlocalizedText: 'Font size',
    iconName: 'FontSize',
    dropDownMenu: {
        items: FONT_SIZES.reduce((map, size) => {
            map[size + 'pt'] = size.toString();
            return map;
        }, <Record<string, string>>{}),
        getSelectedItemKey: formatState => formatState.fontSize,
        allowLivePreview: true,
    },
    onClick: (editor, size) => {
        setFontSize(editor, size);
    },
};
