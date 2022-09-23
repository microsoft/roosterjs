import RibbonButton from '../type/RibbonButton';
import { alignCenter } from './buttons/alignCenter';
import { alignLeft } from './buttons/alignLeft';
import { alignRight } from './buttons/alignRight';
import { AllButtonStringKeys } from '../type/RibbonButtonStringKeys';
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
import { insertImage } from './buttons/insertImage';
import { insertLink } from './buttons/insertLink';
import { insertTable } from './buttons/insertTable';
import { italic } from './buttons/italic';
import { KnownRibbonButtonKey } from '../type/KnownRibbonButton';
import { ltr } from './buttons/ltr';
import { numberedList } from './buttons/numberedList';
import { quote } from './buttons/quote';
import { redo } from './buttons/redo';
import { removeLink } from './buttons/removeLink';
import { rtl } from './buttons/rtl';
import { strikethrough } from './buttons/strikethrough';
import { subscript } from './buttons/subscript';
import { superscript } from './buttons/superscript';
import { textColor } from './buttons/textColor';
import { underline } from './buttons/underline';
import { undo } from './buttons/undo';

const KnownRibbonButtons = <Record<KnownRibbonButtonKey, RibbonButton<AllButtonStringKeys>>>{
    [KnownRibbonButtonKey.Bold]: bold,
    [KnownRibbonButtonKey.Italic]: italic,
    [KnownRibbonButtonKey.Underline]: underline,
    [KnownRibbonButtonKey.Font]: font,
    [KnownRibbonButtonKey.FontSize]: fontSize,
    [KnownRibbonButtonKey.IncreaseFontSize]: increaseFontSize,
    [KnownRibbonButtonKey.DecreaseFontSize]: decreaseFontSize,
    [KnownRibbonButtonKey.TextColor]: textColor,
    [KnownRibbonButtonKey.BackgroundColor]: backgroundColor,
    [KnownRibbonButtonKey.BulletedList]: bulletedList,
    [KnownRibbonButtonKey.NumberedList]: numberedList,
    [KnownRibbonButtonKey.DecreaseIndent]: decreaseIndent,
    [KnownRibbonButtonKey.IncreaseIndent]: increaseIndent,
    [KnownRibbonButtonKey.Quote]: quote,
    [KnownRibbonButtonKey.AlignLeft]: alignLeft,
    [KnownRibbonButtonKey.AlignCenter]: alignCenter,
    [KnownRibbonButtonKey.AlignRight]: alignRight,
    [KnownRibbonButtonKey.InsertLink]: insertLink,
    [KnownRibbonButtonKey.RemoveLink]: removeLink,
    [KnownRibbonButtonKey.InsertTable]: insertTable,
    [KnownRibbonButtonKey.InsertImage]: insertImage,
    [KnownRibbonButtonKey.Superscript]: superscript,
    [KnownRibbonButtonKey.Subscript]: subscript,
    [KnownRibbonButtonKey.Strikethrough]: strikethrough,
    [KnownRibbonButtonKey.Header]: header,
    [KnownRibbonButtonKey.Code]: code,
    [KnownRibbonButtonKey.Ltr]: ltr,
    [KnownRibbonButtonKey.Rtl]: rtl,
    [KnownRibbonButtonKey.Undo]: undo,
    [KnownRibbonButtonKey.Redo]: redo,
    [KnownRibbonButtonKey.ClearFormat]: clearFormat,
};

/**
 * An array of keys of all known ribbon buttons
 */
export const AllButtonKeys = [
    KnownRibbonButtonKey.Bold,
    KnownRibbonButtonKey.Italic,
    KnownRibbonButtonKey.Underline,
    KnownRibbonButtonKey.Font,
    KnownRibbonButtonKey.FontSize,
    KnownRibbonButtonKey.IncreaseFontSize,
    KnownRibbonButtonKey.DecreaseFontSize,
    KnownRibbonButtonKey.TextColor,
    KnownRibbonButtonKey.BackgroundColor,
    KnownRibbonButtonKey.BulletedList,
    KnownRibbonButtonKey.NumberedList,
    KnownRibbonButtonKey.DecreaseIndent,
    KnownRibbonButtonKey.IncreaseIndent,
    KnownRibbonButtonKey.Quote,
    KnownRibbonButtonKey.AlignLeft,
    KnownRibbonButtonKey.AlignCenter,
    KnownRibbonButtonKey.AlignRight,
    KnownRibbonButtonKey.InsertLink,
    KnownRibbonButtonKey.RemoveLink,
    KnownRibbonButtonKey.InsertTable,
    KnownRibbonButtonKey.InsertImage,
    KnownRibbonButtonKey.Superscript,
    KnownRibbonButtonKey.Subscript,
    KnownRibbonButtonKey.Strikethrough,
    KnownRibbonButtonKey.Header,
    KnownRibbonButtonKey.Code,
    KnownRibbonButtonKey.Ltr,
    KnownRibbonButtonKey.Rtl,
    KnownRibbonButtonKey.Undo,
    KnownRibbonButtonKey.Redo,
    KnownRibbonButtonKey.ClearFormat,
];

/**
 * A shortcut to get all format buttons provided by roosterjs-react
 * @param keyOrButtons An array of buttons or known button key. Default value is all known buttons provided by roosterjs-react
 * @returns An array of all buttons
 */
export default function getButtons<StringKey extends string = string>(
    keyOrButtons: (KnownRibbonButtonKey | RibbonButton<StringKey>)[] = AllButtonKeys
): (RibbonButton<AllButtonStringKeys> | RibbonButton<StringKey>)[] {
    return keyOrButtons.map(keyOrButton =>
        typeof keyOrButton == 'number' ? KnownRibbonButtons[keyOrButton] : keyOrButton
    );
}
