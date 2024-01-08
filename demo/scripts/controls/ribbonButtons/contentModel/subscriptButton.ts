import ContentModelRibbonButton from './ContentModelRibbonButton';
import { SubscriptButtonStringKey } from 'roosterjs-react';
import { toggleSubscript } from 'roosterjs-content-model-api';

/**
 * @internal
 * "Subscript" button on the format ribbon
 */
export const subscriptButton: ContentModelRibbonButton<SubscriptButtonStringKey> = {
    key: 'buttonNameSubscript',
    unlocalizedText: 'Subscript',
    iconName: 'Subscript',
    isChecked: formatState => formatState.isSubscript,
    onClick: editor => {
        toggleSubscript(editor);

        return true;
    },
};
