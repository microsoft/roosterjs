import RibbonButton from '../../type/RibbonButton';
import { removeLink as removeLinkApi } from 'roosterjs-editor-api';
import { RemoveLinkButtonStringKey } from '../../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Remove link" button on the format ribbon
 */
export const removeLink: RibbonButton<RemoveLinkButtonStringKey> = {
    key: 'buttonNameRemoveLink',
    unlocalizedText: 'Remove link',
    iconName: 'RemoveLink',
    isDisabled: formatState => !formatState.canUnlink,
    onClick: editor => {
        removeLinkApi(editor);
    },
};
