import { toggleUnderline } from 'roosterjs-editor-api';
import type RibbonButton from '../../type/RibbonButton';
import type { UnderlineButtonStringKey } from '../../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Underline" button on the format ribbon
 */
export const underline: RibbonButton<UnderlineButtonStringKey> = {
    key: 'buttonNameUnderline',
    unlocalizedText: 'Underline',
    iconName: 'Underline',
    isChecked: formatState => !!formatState.isUnderline,
    onClick: editor => {
        toggleUnderline(editor);
        return true;
    },
};
