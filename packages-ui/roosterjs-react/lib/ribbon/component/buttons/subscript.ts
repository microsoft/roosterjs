import RibbonButton from '../../type/RibbonButton';
import { SubscriptButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { toggleSubscript } from 'roosterjs-editor-api';

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
