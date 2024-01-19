import ContentModelRibbonButton from './ContentModelRibbonButton';
import { removeLink } from 'roosterjs-content-model-api';
import { RemoveLinkButtonStringKey } from 'roosterjs-react';

/**
 * @internal
 * "Remove link" button on the format ribbon
 */
export const removeLinkButton: ContentModelRibbonButton<RemoveLinkButtonStringKey> = {
    key: 'buttonNameRemoveLink',
    unlocalizedText: 'Remove link',
    iconName: 'RemoveLink',
    isDisabled: formatState => !formatState.canUnlink,
    onClick: editor => {
        removeLink(editor);
    },
};
