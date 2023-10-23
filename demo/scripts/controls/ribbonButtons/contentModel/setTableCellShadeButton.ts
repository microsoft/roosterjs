import ContentModelRibbonButton from './ContentModelRibbonButton';
import { setTableCellShade } from 'roosterjs-content-model-editor';
import {
    BackgroundColorKeys,
    getBackgroundColorValue,
    getButtons,
    KnownRibbonButtonKey,
} from 'roosterjs-react';

const originalBackgroundColorButton: ContentModelRibbonButton<BackgroundColorKeys> = (getButtons([
    KnownRibbonButtonKey.BackgroundColor,
])[0] as any) as ContentModelRibbonButton<BackgroundColorKeys>;

export const setTableCellShadeButton: ContentModelRibbonButton<
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
        if (key != 'ribbonButtonSetTableCellShade') {
            const color = getBackgroundColorValue(key);

            // Content Model doesn't need dark mode color at this point, so always pass in light mode color
            setTableCellShade(editor, color.lightModeColor);
        }
    },
};
