import ContentModelRibbonButton from './ContentModelRibbonButton';
import MainPaneBase from '../../MainPaneBase';
import { getButtons, getTextColorValue, KnownRibbonButtonKey } from 'roosterjs-react';

const originalButton = (getButtons([
    KnownRibbonButtonKey.TextColor,
])[0] as any) as ContentModelRibbonButton<'buttonNameTableBorderColor'>;

/**
 * @internal
 * "Table Border Color" button on the format ribbon
 */
export const tableBorderColorButton: ContentModelRibbonButton<'buttonNameTableBorderColor'> = {
    ...originalButton,
    unlocalizedText: 'Table Border Color',
    iconName: 'ColorSolid',
    isDisabled: formatState => !formatState.isInTable,
    onClick: (editor, key) => {
        // This check will always be true, add it here just to satisfy compiler
        if (key != 'buttonNameTableBorderColor') {
            MainPaneBase.getInstance().setTableBorderColor(getTextColorValue(key).lightModeColor);
            editor.focus();
        }
    },
};
