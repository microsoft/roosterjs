import ContentModelRibbonButton from './ContentModelRibbonButton';
import { setImageBorder } from 'roosterjs-content-model-api';

const STYLES: Record<string, string> = {
    dashed: 'dashed',
    dotted: 'dotted',
    solid: 'solid',
    double: 'doubled',
    groove: 'groove',
    ridge: 'ridge',
    inset: 'inset',
    outset: 'outset',
};

/**
 * @internal
 * "Image Border Style" button on the format ribbon
 */
export const imageBorderStyleButton: ContentModelRibbonButton<'buttonNameImageBorderStyle'> = {
    key: 'buttonNameImageBorderStyle',
    unlocalizedText: 'Image Border Style',
    iconName: 'BorderDash',
    isDisabled: formatState => !formatState.canAddImageAltText,
    dropDownMenu: {
        items: STYLES,
        allowLivePreview: true,
    },
    onClick: (editor, style) => {
        setImageBorder(editor, { style: style }, '5px');
        return true;
    },
};
