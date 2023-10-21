import ContentModelRibbonButton from './ContentModelRibbonButton';
import { setImageBorder } from 'roosterjs-content-model-editor';

/**
 * @internal
 * "Remove Image Border" button on the format ribbon
 */
export const imageBorderRemoveButton: ContentModelRibbonButton<'buttonNameImageBorderRemove'> = {
    key: 'buttonNameImageBorderRemove',
    unlocalizedText: 'Remove Image Border',
    iconName: 'Cancel',
    isDisabled: formatState => !formatState.canAddImageAltText,
    onClick: editor => {
        setImageBorder(editor, null);
    },
};
