import { isContentModelEditor, setImageBorder } from 'roosterjs-content-model-editor';
import { RibbonButton } from 'roosterjs-react';

/**
 * @internal
 * "Remove Image Border" button on the format ribbon
 */
export const imageBorderRemoveButton: RibbonButton<'buttonNameImageBorderRemove'> = {
    key: 'buttonNameImageBorderRemove',
    unlocalizedText: 'Remove Image Border',
    iconName: 'Cancel',
    isDisabled: formatState => !formatState.canAddImageAltText,
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            setImageBorder(editor, null);
        }
    },
};
