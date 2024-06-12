import { setImageBorder } from 'roosterjs-content-model-api';
import type { RibbonButton } from 'roosterjs-react';

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
        setImageBorder(editor, null);
    },
};
