import RibbonButton from '../../type/RibbonButton';
import { getFormatState, setFontSize, toggleBold } from 'roosterjs-editor-api';
import { ItalicButtonStringKey } from '../../type/RibbonButtonStringKeys';

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
        // toggleItalic(editor);
        console.log('before change', getFormatState(editor));

        const size = '22pt';
        console.log('set font size and toggle bold', size);
        setFontSize(editor, size);
        // setTimeout(() => {
        toggleBold(editor);
        console.log('toggle bold');
        console.log('after change', getFormatState(editor));

        return true;
    },
};
