import { isContentModelEditor, toggleSubscript } from 'roosterjs-content-model-editor';
import { RibbonButton, SubscriptButtonStringKey } from 'roosterjs-react';

/**
 * @internal
 * "Subscript" button on the format ribbon
 */
export const subscriptButton: RibbonButton<SubscriptButtonStringKey> = {
    key: 'buttonNameSubscript',
    unlocalizedText: 'Subscript',
    iconName: 'Subscript',
    isChecked: formatState => formatState.isSubscript,
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            toggleSubscript(editor);
        }
        return true;
    },
};
