import RibbonButton from '../../plugins/RibbonPlugin/RibbonButton';
import { alignCenter, AlignCenterButtonStringKey } from './buttons/alignCenter';
import { alignLeft, AlignLeftButtonStringKey } from './buttons/alignLeft';
import { alignRight, AlignRightButtonStringKey } from './buttons/alignRight';
import { backgroundColor, BackgroundColorButtonStringKey } from './buttons/backgroundColor';
import { bold, BoldButtonStringKey } from './buttons/bold';
import { bulletedList, BulletedListButtonStringKey } from './buttons/bulletedList';
import { cellShade, CellShadeButtonStringKey } from './buttons/cellShading';
import { clearFormat, ClearFormatButtonStringKey } from './buttons/clearFormat';
import { code, CodeButtonStringKey } from './buttons/code';
import { decreaseFontSize, DecreaseFontSizeButtonStringKey } from './buttons/decreaseFontSize';
import { decreaseIndent, DecreaseIndentButtonStringKey } from './buttons/decreaseIndent';
import { font, FontButtonStringKey } from './buttons/font';
import { fontSize, FontSizeButtonStringKey } from './buttons/fontSize';
import { header, HeaderButtonStringKey } from './buttons/header';
import { increaseFontSize, IncreaseFontSizeButtonStringKey } from './buttons/increaseFontSize';
import { increaseIndent, IncreaseIndentButtonStringKey } from './buttons/increaseIndent';
import { insertImage, InsertImageButtonStringKey } from './buttons/insertImage';
import { insertLink, InsertLinkButtonStringKey } from './buttons/insertLink';
import { insertTable, InsertTableButtonStringKey } from './buttons/insertTable';
import { italic, ItalicButtonStringKey } from './buttons/italic';
import { ltr, LtrButtonStringKey } from './buttons/ltr';
import { numberedList, NumberedListButtonStringKey } from './buttons/numberedList';
import { quote, QuoteButtonStringKey } from './buttons/quote';
import { redo, RedoButtonStringKey } from './buttons/redo';
import { removeLink, RemoveLinkButtonStringKey } from './buttons/removeLink';
import { rtl, RtlButtonStringKey } from './buttons/rtl';
import { strikethrough, StrikethroughButtonStringKey } from './buttons/strikethrough';
import { subscript, SubscriptButtonStringKey } from './buttons/subscript';
import { superscript, SuperscriptButtonStringKey } from './buttons/superscript';
import { textColor, TextColorButtonStringKey } from './buttons/textColor';
import { underline, UnderlineButtonStringKey } from './buttons/underline';
import { undo, UndoButtonStringKey } from './buttons/undo';

/**
 * A public type for localized string keys of all buttons
 */
export type AllButtonsStringKey =
    | AlignLeftButtonStringKey
    | AlignCenterButtonStringKey
    | AlignRightButtonStringKey
    | BackgroundColorButtonStringKey
    | BoldButtonStringKey
    | BulletedListButtonStringKey
    | ClearFormatButtonStringKey
    | CodeButtonStringKey
    | DecreaseFontSizeButtonStringKey
    | DecreaseIndentButtonStringKey
    | FontButtonStringKey
    | FontSizeButtonStringKey
    | HeaderButtonStringKey
    | IncreaseFontSizeButtonStringKey
    | IncreaseIndentButtonStringKey
    | InsertImageButtonStringKey
    | InsertLinkButtonStringKey
    | InsertTableButtonStringKey
    | ItalicButtonStringKey
    | LtrButtonStringKey
    | NumberedListButtonStringKey
    | QuoteButtonStringKey
    | RedoButtonStringKey
    | RemoveLinkButtonStringKey
    | RtlButtonStringKey
    | StrikethroughButtonStringKey
    | SubscriptButtonStringKey
    | SuperscriptButtonStringKey
    | TextColorButtonStringKey
    | UnderlineButtonStringKey
    | UndoButtonStringKey
    | CellShadeButtonStringKey;

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
        insertLink,
        removeLink,
        insertTable,
        insertImage,
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
        cellShade,
    ];
}
