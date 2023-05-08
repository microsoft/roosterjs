import { isContentModelEditor } from 'roosterjs-content-model';
import { setBackgroundColor } from 'roosterjs-content-model';
import {
    BackgroundColorButtonStringKey,
    getBackgroundColorValue,
    getButtons,
    KnownRibbonButtonKey,
    RibbonButton,
} from 'roosterjs-react';

const originalButton = getButtons([KnownRibbonButtonKey.BackgroundColor])[0] as RibbonButton<
    BackgroundColorButtonStringKey
>;

/**
 * @internal
 * "Background color" button on the format ribbon
 */
export const backgroundColorButton: RibbonButton<BackgroundColorButtonStringKey> = {
    ...originalButton,
    onClick: (editor, key) => {
        // This check will always be true, add it here just to satisfy compiler
        if (key != 'buttonNameBackgroundColor' && isContentModelEditor(editor)) {
            setBackgroundColor(editor, getBackgroundColorValue(key).lightModeColor);
        }
    },
};
