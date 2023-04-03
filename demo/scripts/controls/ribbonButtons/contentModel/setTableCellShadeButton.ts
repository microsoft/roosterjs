import { isContentModelEditor } from 'roosterjs-content-model';
import { setTableCellShade } from 'roosterjs-content-model';
import {
    BackgroundColorKeys,
    getBackgroundColorValue,
    getButtons,
    KnownRibbonButtonKey,
    RibbonButton,
} from 'roosterjs-react';

const originalBackgroundColorButton: RibbonButton<BackgroundColorKeys> = getButtons([
    KnownRibbonButtonKey.BackgroundColor,
])[0] as RibbonButton<BackgroundColorKeys>;

export const setTableCellShadeButton: RibbonButton<
    'ribbonButtonSetTableCellShade' | BackgroundColorKeys
> = {
    dropDownMenu: {
        ...originalBackgroundColorButton.dropDownMenu,
        allowLivePreview: true,
    },
    key: 'ribbonButtonSetTableCellShade',
    unlocalizedText: 'Set table shade color',
    iconName: 'BackgroundColor',
    isDisabled: formatState => !formatState.isInTable,
    onClick: (editor, key) => {
        if (key != 'ribbonButtonSetTableCellShade' && isContentModelEditor(editor)) {
            const color = getBackgroundColorValue(key);

            // Content Model doesn't need dark mode color at this point, so always pass in light mode color
            setTableCellShade(editor, color.lightModeColor);
        }
    },
};
