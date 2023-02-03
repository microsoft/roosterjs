import { getButtons, getTextColorValue, KnownRibbonButtonKey } from 'roosterjs-react';
import { isContentModelEditor } from 'roosterjs-content-model';
import { RibbonButton } from 'roosterjs-react';
import { setImageBorder } from 'roosterjs-content-model';

const originalButton = getButtons([KnownRibbonButtonKey.TextColor])[0] as RibbonButton<
    'buttonNameImageBorderColor'
>;

/**
 * @internal
 * "Image Border Color" button on the format ribbon
 */
export const imageBorderColorButton: RibbonButton<'buttonNameImageBorderColor'> = {
    ...originalButton,
    unlocalizedText: 'Image Border Color',
    iconName: 'Photo2',
    isDisabled: formatState => !formatState.canAddImageAltText,
    onClick: (editor, key) => {
        // This check will always be true, add it here just to satisfy compiler
        if (key != 'buttonNameImageBorderColor' && isContentModelEditor(editor)) {
            setImageBorder(editor, { color: getTextColorValue(key).lightModeColor }, '5px');
        }
    },
};
