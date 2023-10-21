import ContentModelRibbonButton from './ContentModelRibbonButton';
import { getButtons, getTextColorValue, KnownRibbonButtonKey } from 'roosterjs-react';
import { setImageBorder } from 'roosterjs-content-model-editor';

const originalButton = (getButtons([
    KnownRibbonButtonKey.TextColor,
])[0] as any) as ContentModelRibbonButton<'buttonNameImageBorderColor'>;

/**
 * @internal
 * "Image Border Color" button on the format ribbon
 */
export const imageBorderColorButton: ContentModelRibbonButton<'buttonNameImageBorderColor'> = {
    ...originalButton,
    unlocalizedText: 'Image Border Color',
    iconName: 'Photo2',
    isDisabled: formatState => !formatState.canAddImageAltText,
    onClick: (editor, key) => {
        // This check will always be true, add it here just to satisfy compiler
        if (key != 'buttonNameImageBorderColor') {
            setImageBorder(editor, { color: getTextColorValue(key).lightModeColor }, '5px');
        }
    },
};
