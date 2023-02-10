import { isContentModelEditor } from 'roosterjs-content-model';
import { setTextColor } from 'roosterjs-content-model';
import {
    getButtons,
    getTextColorValue,
    KnownRibbonButtonKey,
    RibbonButton,
    TextColorButtonStringKey,
} from 'roosterjs-react';

const originalButton = getButtons([KnownRibbonButtonKey.TextColor])[0] as RibbonButton<
    TextColorButtonStringKey
>;

/**
 * @internal
 * "Text color" button on the format ribbon
 */
export const textColorButton: RibbonButton<TextColorButtonStringKey> = {
    ...originalButton,
    onClick: (editor, key) => {
        // This check will always be true, add it here just to satisfy compiler
        if (key != 'buttonNameTextColor' && isContentModelEditor(editor)) {
            setTextColor(editor, getTextColorValue(key).lightModeColor);
        }
    },
};
