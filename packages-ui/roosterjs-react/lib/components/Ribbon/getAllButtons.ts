import RibbonButton from '../../plugins/RibbonPlugin/RibbonButton';
import { alignCenter } from './buttons/alignCenter';
import { alignLeft } from './buttons/alignLeft';
import { alignRight } from './buttons/alignRight';
import { backgroundColor } from './buttons/backgroundColor';
import { bold } from './buttons/bold';
import { bulletedList } from './buttons/bulletedList';
import { clearFormat } from './buttons/clearFormat';
import { code } from './buttons/code';
import { decreaseFontSize } from './buttons/decreaseFontSize';
import { decreaseIndent } from './buttons/decreaseIndent';
import { font } from './buttons/font';
import { fontSize } from './buttons/fontSize';
import { header } from './buttons/header';
import { increaseFontSize } from './buttons/increaseFontSize';
import { increaseIndent } from './buttons/increaseIndent';
import { italic } from './buttons/italic';
import { ltr } from './buttons/ltr';
import { numberedList } from './buttons/numberedList';
import { quote } from './buttons/quote';
import { redo } from './buttons/redo';
import { rtl } from './buttons/rtl';
import { strikethrough } from './buttons/strikethrough';
import { subscript } from './buttons/subscript';
import { superscript } from './buttons/superscript';
import { textColor } from './buttons/textColor';
import { underline } from './buttons/underline';
import { undo } from './buttons/undo';

/**
 * A shortcut to get all format buttons provided by roosterjs-react
 * @returns An array of all buttons
 */
export default function getAllButtons(): RibbonButton[] {
    return [
        bold,
        italic,
        underline,
        font,
        fontSize,
        increaseFontSize,
        decreaseFontSize,
        textColor,
        backgroundColor,
        bulletedList,
        numberedList,
        decreaseIndent,
        increaseIndent,
        quote,
        alignLeft,
        alignCenter,
        alignRight,
        superscript,
        subscript,
        strikethrough,
        header,
        code,
        ltr,
        rtl,
        undo,
        redo,
        clearFormat,
    ];
}
