import { getButtons, getTextColorValue, KnownRibbonButtonKey } from 'roosterjs-react';
import { isContentModelEditor } from 'roosterjs-content-model-editor';
import { RibbonButton } from 'roosterjs-react';

const originalButton = getButtons([KnownRibbonButtonKey.TextColor])[0] as RibbonButton<
    'buttonNameTableBorderColor'
>;

/**
 * @internal
 * "Table Border Color" button on the format ribbon
 */
export const tableBorderColorButton: RibbonButton<'buttonNameTableBorderColor'> = {
    ...originalButton,
    unlocalizedText: 'Table Border Color',
    iconName: 'ColorSolid',
    isDisabled: formatState => !formatState.isInTable,
    onClick: (editor, key) => {
        // This check will always be true, add it here just to satisfy compiler
        if (key != 'buttonNameTableBorderColor' && isContentModelEditor(editor)) {
            editor.setTableBorderColor(
                editor.isDarkMode()
                    ? getTextColorValue(key).lightModeColor
                    : getTextColorValue(key).darkModeColor
            );
            editor.focus();
        }
    },
};
