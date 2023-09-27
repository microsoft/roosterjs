import { toggleItalic } from 'roosterjs-editor-api';
import type RibbonButton from '../../type/RibbonButton';
import type { ItalicButtonStringKey } from '../../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Italic" button on the format ribbon
 */
export const italic: RibbonButton<ItalicButtonStringKey> = {
    key: 'buttonNameItalic',
    unlocalizedText: 'Italic',
    iconName: 'Italic',
    isChecked: formatState => !!formatState.isItalic,
    onClick: editor => {
        toggleItalic(editor);
        return true;
    },
};
