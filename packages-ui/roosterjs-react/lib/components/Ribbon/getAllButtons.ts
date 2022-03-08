import RibbonButton from '../../plugins/RibbonPlugin/RibbonButton';
import { alignCenter, AlignCenterButtonStringKey } from './buttons/alignCenter';
import { alignLeft, AlignLeftButtonStringKey } from './buttons/alignLeft';
import { alignRight, AlignRightButtonStringKey } from './buttons/alignRight';
import { bold, BoldButtonStringKey } from './buttons/bold';
import { bulletedList, BulletedListButtonStringKey } from './buttons/bulletedList';
import { clearFormat, ClearFormatButtonStringKey } from './buttons/clearFormat';
import { code, CodeButtonStringKey } from './buttons/code';
import { decreaseIndent, DecreaseIndentButtonStringKey } from './buttons/decreaseIndent';
import { font, FontButtonStringKey } from './buttons/font';
import { fontSize, FontSizeButtonStringKey } from './buttons/fontSize';
import { header, HeaderButtonStringKey } from './buttons/header';
import { increaseIndent, IncreaseIndentButtonStringKey } from './buttons/increaseIndent';
import { italic, ItalicButtonStringKey } from './buttons/italic';
import { ltr, LtrButtonStringKey } from './buttons/ltr';
import { numberedList, NumberedListButtonStringKey } from './buttons/numberedList';
import { quote, QuoteButtonStringKey } from './buttons/quote';
import { redo, RedoButtonStringKey } from './buttons/redo';
import { rtl, RtlButtonStringKey } from './buttons/rtl';
import { strikethrough, StrikethroughButtonStringKey } from './buttons/strikethrough';
import { subscript, SubscriptButtonStringKey } from './buttons/subscript';
import { superscript, SuperscriptButtonStringKey } from './buttons/superscript';
import { underline, UnderlineButtonStringKey } from './buttons/underline';
import { undo, UndoButtonStringKey } from './buttons/undo';

/**
 * A public type for localized string keys of all buttons
 */
export type AllButtonsStringKey =
    | AlignLeftButtonStringKey
    | AlignCenterButtonStringKey
    | AlignRightButtonStringKey
    | BoldButtonStringKey
    | BulletedListButtonStringKey
    | ClearFormatButtonStringKey
    | CodeButtonStringKey
    | DecreaseIndentButtonStringKey
    | FontButtonStringKey
    | FontSizeButtonStringKey
    | HeaderButtonStringKey
    | IncreaseIndentButtonStringKey
    | ItalicButtonStringKey
    | LtrButtonStringKey
    | NumberedListButtonStringKey
    | QuoteButtonStringKey
    | RedoButtonStringKey
    | RtlButtonStringKey
    | StrikethroughButtonStringKey
    | SubscriptButtonStringKey
    | SuperscriptButtonStringKey
    | UnderlineButtonStringKey
    | UndoButtonStringKey;

/**
 * A shortcut to get all format buttons provided by roosterjs-react
 * @returns An array of all buttons
 */
export default function getAllButtons(): RibbonButton<AllButtonsStringKey>[] {
    return [
        bold,
        italic,
        underline,
        font,
        fontSize,
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
