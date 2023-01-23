import isContentModelEditor from '../../editor/isContentModelEditor';
import { RibbonButton } from 'roosterjs-react';
import { setImageBorderStyle } from 'roosterjs-content-model';

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
 * "Italic" button on the format ribbon
 */
export const imageBorderStyle: RibbonButton<'buttonNameImageBorderStyle'> = {
    key: 'buttonNameImageBorderStyle',
    unlocalizedText: 'Image Border Style',
    iconName: 'Photo2',
    isDisabled: formatState => !formatState.canAddImageAltText,
    dropDownMenu: {
        items: STYLES,
        allowLivePreview: true,
    },
    onClick: (editor, size) => {
        if (isContentModelEditor(editor)) {
            setImageBorderStyle(editor, size);
        }
        return true;
    },
};
