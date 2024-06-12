import { removeLink } from 'roosterjs-content-model-api';
import type { RibbonButton } from '../type/RibbonButton';
import type { RemoveLinkButtonStringKey } from '../type/RibbonButtonStringKeys';

/**
 * "Remove link" button on the format ribbon
 */
export const removeLinkButton: RibbonButton<RemoveLinkButtonStringKey> = {
    key: 'buttonNameRemoveLink',
    unlocalizedText: 'Remove link',
    iconName: 'RemoveLink',
    isDisabled: formatState => !formatState.canUnlink,
    onClick: editor => {
        removeLink(editor);
    },
};
