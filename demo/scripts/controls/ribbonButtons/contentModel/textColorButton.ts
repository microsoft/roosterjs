import ContentModelRibbonButton from './ContentModelRibbonButton';
import { setTextColor } from 'roosterjs-content-model-api';
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
export const textColorButton: ContentModelRibbonButton<TextColorButtonStringKey> = {
    ...originalButton,
    onClick: (editor, key) => {
        // This check will always be true, add it here just to satisfy compiler
        if (key != 'buttonNameTextColor') {
            setTextColor(editor, getTextColorValue(key).lightModeColor);
        }
    },
};
