import { toggleSubscript } from 'roosterjs-content-model-api';
import type { RibbonButton } from '../type/RibbonButton';
import type { SubscriptButtonStringKey } from '../type/RibbonButtonStringKeys';

/**
 * "Subscript" button on the format ribbon
 */
export const subscriptButton: RibbonButton<SubscriptButtonStringKey> = {
    key: 'buttonNameSubscript',
    unlocalizedText: 'Subscript',
    iconName: 'Subscript',
    isChecked: formatState => !!formatState.isSubscript,
    onClick: editor => {
        toggleSubscript(editor);
    },
};
