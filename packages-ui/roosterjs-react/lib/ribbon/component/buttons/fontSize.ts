import { FONT_SIZES, setFontSize } from 'roosterjs-editor-api';
import type RibbonButton from '../../type/RibbonButton';
import type { FontSizeButtonStringKey } from '../../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Font Size" button on the format ribbon
 */
export const fontSize: RibbonButton<FontSizeButtonStringKey> = {
    key: 'buttonNameFontSize',
    unlocalizedText: 'Font size',
    iconName: 'FontSize',
    dropDownMenu: {
        items: FONT_SIZES.reduce((map, size) => {
            map[size + 'pt'] = size.toString();
            return map;
        }, <Record<string, string>>{}),
        getSelectedItemKey: formatState => formatState.fontSize ?? null,
        allowLivePreview: true,
    },
    onClick: (editor, size) => {
        setFontSize(editor, size);
    },
};
