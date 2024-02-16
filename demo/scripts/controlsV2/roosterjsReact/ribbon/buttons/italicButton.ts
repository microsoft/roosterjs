import { toggleItalic } from 'roosterjs-content-model-api';
import type { ItalicButtonStringKey } from '../type/RibbonButtonStringKeys';
import type { RibbonButton } from '../type/RibbonButton';

/**
 * @internal
 * "Italic" button on the format ribbon
 */
export const italicButton: RibbonButton<ItalicButtonStringKey> = {
    key: 'buttonNameItalic',
    unlocalizedText: 'Italic',
    iconName: 'Italic',
    isChecked: formatState => formatState.isItalic,
    category: 'format',
    onClick: editor => {
        toggleItalic(editor);
    },
};
