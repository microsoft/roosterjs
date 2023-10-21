import ContentModelRibbonButton from './ContentModelRibbonButton';
import { setBackgroundColor } from 'roosterjs-content-model-editor';
import {
    BackgroundColorButtonStringKey,
    getBackgroundColorValue,
    getButtons,
    KnownRibbonButtonKey,
} from 'roosterjs-react';

const originalButton = (getButtons([
    KnownRibbonButtonKey.BackgroundColor,
])[0] as any) as ContentModelRibbonButton<BackgroundColorButtonStringKey>;

/**
 * @internal
 * "Background color" button on the format ribbon
 */
export const backgroundColorButton: ContentModelRibbonButton<BackgroundColorButtonStringKey> = {
    ...originalButton,
    onClick: (editor, key) => {
        // This check will always be true, add it here just to satisfy compiler
        if (key != 'buttonNameBackgroundColor') {
            setBackgroundColor(editor, getBackgroundColorValue(key).lightModeColor);
        }
    },
};
