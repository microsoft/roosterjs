import { isContentModelEditor, setImageBorder } from 'roosterjs-content-model-editor';
import { RibbonButton } from 'roosterjs-react';

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
export const imageBorderStyleButton: RibbonButton<'buttonNameImageBorderStyle'> = {
    key: 'buttonNameImageBorderStyle',
    unlocalizedText: 'Image Border Style',
    iconName: 'BorderDash',
    isDisabled: formatState => !formatState.canAddImageAltText,
    dropDownMenu: {
        items: STYLES,
        allowLivePreview: true,
    },
    onClick: (editor, style) => {
        if (isContentModelEditor(editor)) {
            setImageBorder(editor, { style: style }, '5px');
        }
        return true;
    },
};
