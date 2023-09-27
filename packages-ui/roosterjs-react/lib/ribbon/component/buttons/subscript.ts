import { toggleSubscript } from 'roosterjs-editor-api';
import type RibbonButton from '../../type/RibbonButton';
import type { SubscriptButtonStringKey } from '../../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Subscript" button on the format ribbon
 */
export const subscript: RibbonButton<SubscriptButtonStringKey> = {
    key: 'buttonNameSubscript',
    unlocalizedText: 'Subscript',
    iconName: 'Subscript',
    isChecked: formatState => !!formatState.isSubscript,
    onClick: editor => {
        toggleSubscript(editor);
        return true;
    },
};
