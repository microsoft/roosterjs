import RibbonButton from '../../type/RibbonButton';
import { ItalicButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { toggleItalic } from 'roosterjs-editor-api';

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
