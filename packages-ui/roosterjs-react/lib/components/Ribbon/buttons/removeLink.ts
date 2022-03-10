import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { removeLink as removeLinkApi } from 'roosterjs-editor-api';

/**
 * Key of localized strings of REmove link button
 */
export type RemoveLinkButtonStringKey = 'buttonNameRemoveLink';

/**
 * "Remove link" button on the format ribbon
 */
export const removeLink: RibbonButton<RemoveLinkButtonStringKey> = {
    key: 'buttonNameRemoveLink',
    unlocalizedText: 'Remove link',
    iconName: 'RemoveLink',
    disabled: formatState => !formatState.canUnlink,
    onClick: editor => {
        removeLinkApi(editor);
    },
};
