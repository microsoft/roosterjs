import { setImageTextWrap } from 'roosterjs-content-model-api';
import type { RibbonButton } from 'roosterjs-react';

/**
 * @internal
 * "Inline with text" image text wrap button on the format ribbon
 */
export const imageTextWrapInlineButton: RibbonButton<'buttonNameImageTextWrapInline'> = {
    key: 'buttonNameImageTextWrapInline',
    unlocalizedText: 'Text wrap: In line with text',
    iconName: 'Photo2',
    isDisabled: formatState => !formatState.canAddImageAltText,
    onClick: editor => {
        setImageTextWrap(editor, 'inline');
    },
};

/**
 * @internal
 * "Square" image text wrap button on the format ribbon
 */
export const imageTextWrapSquareButton: RibbonButton<'buttonNameImageTextWrapSquare'> = {
    key: 'buttonNameImageTextWrapSquare',
    unlocalizedText: 'Text wrap: Square',
    iconName: 'AlignLeft',
    isDisabled: formatState => !formatState.canAddImageAltText,
    onClick: editor => {
        setImageTextWrap(editor, 'square');
    },
};

/**
 * @internal
 * "Top and bottom" image text wrap button on the format ribbon
 */
export const imageTextWrapTopAndBottomButton: RibbonButton<'buttonNameImageTextWrapTopAndBottom'> = {
    key: 'buttonNameImageTextWrapTopAndBottom',
    unlocalizedText: 'Text wrap: Top and bottom',
    iconName: 'AlignCenter',
    isDisabled: formatState => !formatState.canAddImageAltText,
    onClick: editor => {
        setImageTextWrap(editor, 'topAndBottom');
    },
};
