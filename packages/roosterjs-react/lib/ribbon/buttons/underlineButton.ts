import { toggleUnderline } from 'roosterjs-content-model-api';
import type { RibbonButton } from '../type/RibbonButton';
import type { UnderlineButtonStringKey } from '../type/RibbonButtonStringKeys';

/**
 * "Underline" button on the format ribbon
 */
export const underlineButton: RibbonButton<UnderlineButtonStringKey> = {
    key: 'buttonNameUnderline',
    unlocalizedText: 'Underline',
    iconName: 'Underline',
    isChecked: formatState => !!formatState.isUnderline,
    onClick: editor => {
        toggleUnderline(editor);
    },
};
