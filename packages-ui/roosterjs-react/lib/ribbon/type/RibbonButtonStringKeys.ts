import { CancelButtonStringKey, OkButtonStringKey } from '../../common/type/LocalizedStrings';

/**
 * Localized string keys for text colors
 */
export type TextColorKeys =
    | 'textColorLightBlue'
    | 'textColorLightGreen'
    | 'textColorLightYellow'
    | 'textColorLightOrange'
    | 'textColorLightRed'
    | 'textColorLightPurple'
    | 'textColorBlue'
    | 'textColorGreen'
    | 'textColorYellow'
    | 'textColorOrange'
    | 'textColorRed'
    | 'textColorPurple'
    | 'textColorDarkBlue'
    | 'textColorDarkGreen'
    | 'textColorDarkYellow'
    | 'textColorDarkOrange'
    | 'textColorDarkRed'
    | 'textColorDarkPurple'
    | 'textColorDarkerBlue'
    | 'textColorDarkerGreen'
    | 'textColorDarkerYellow'
    | 'textColorDarkerOrange'
    | 'textColorDarkerRed'
    | 'textColorDarkerPurple'
    | 'textColorWhite'
    | 'textColorLightGray'
    | 'textColorGray'
    | 'textColorDarkGray'
    | 'textColorDarkerGray'
    | 'textColorBlack';

/**
 * Localized string keys for background colors
 */
export type BackgroundColorKeys =
    | 'backgroundColorCyan'
    | 'backgroundColorGreen'
    | 'backgroundColorYellow'
    | 'backgroundColorOrange'
    | 'backgroundColorRed'
    | 'backgroundColorMagenta'
    | 'backgroundColorLightCyan'
    | 'backgroundColorLightGreen'
    | 'backgroundColorLightYellow'
    | 'backgroundColorLightOrange'
    | 'backgroundColorLightRed'
    | 'backgroundColorLightMagenta'
    | 'backgroundColorWhite'
    | 'backgroundColorLightGray'
    | 'backgroundColorGray'
    | 'backgroundColorDarkGray'
    | 'backgroundColorDarkerGray'
    | 'backgroundColorBlack';

/**
 * Key of localized strings of Align center button
 */
export type AlignCenterButtonStringKey = 'buttonNameAlignCenter';

/**
 * Key of localized strings of Align left button
 */
export type AlignLeftButtonStringKey = 'buttonNameAlignLeft';

/**
 * Key of localized strings of Align right button
 */
export type AlignRightButtonStringKey = 'buttonNameAlignRight';

/**
 * Key of localized strings of Background color button
 */
export type BackgroundColorButtonStringKey = 'buttonNameBackgroundColor' | BackgroundColorKeys;

/**
 * Key of localized strings of Bold button
 */
export type BoldButtonStringKey = 'buttonNameBold';

/**
 * Key of localized strings of Bulleted list button
 */
export type BulletedListButtonStringKey = 'buttonNameBulletedList';

/**
 * Key of localized strings of Clear format button
 */
export type ClearFormatButtonStringKey = 'buttonNameClearFormat';

/**
 * Key of localized strings of Code button
 */
export type CodeButtonStringKey = 'buttonNameCode';

/**
 * Key of localized strings of Decrease font size button
 */
export type DecreaseFontSizeButtonStringKey = 'buttonNameDecreaseFontSize';

/**
 * Key of localized strings of Decrease indent size button
 */
export type DecreaseIndentButtonStringKey = 'buttonNameDecreaseIntent';

/**
 * Key of localized strings of Font button
 */
export type FontButtonStringKey = 'buttonNameFont';

/**
 * Key of localized strings of Font size button
 */
export type FontSizeButtonStringKey = 'buttonNameFontSize';

/**
 * Key of localized strings of Header button
 */
export type HeaderButtonStringKey = 'buttonNameHeader';

/**
 * Key of localized strings of Increase font size button
 */
export type IncreaseFontSizeButtonStringKey = 'buttonNameIncreaseFontSize';

/**
 * Key of localized strings of Increase indent size button
 */
export type IncreaseIndentButtonStringKey = 'buttonNameIncreaseIndent';

/**
 * Key of localized strings of Insert image button
 */
export type InsertImageButtonStringKey = 'buttonNameInsertImage';

/**
 * Key of localized strings of Insert link button
 */
export type InsertLinkButtonStringKey =
    | 'buttonNameInsertLink'
    | 'insertLinkTitle'
    | OkButtonStringKey
    | CancelButtonStringKey;

/**
 * Key of localized strings of Insert table button
 */
export type InsertTableButtonStringKey = 'buttonNameInsertTable' | 'insertTablePane';

/**
 * Key of localized strings of Italic button
 */
export type ItalicButtonStringKey = 'buttonNameItalic';

/**
 * Key of localized strings of Left to right button
 */
export type LtrButtonStringKey = 'buttonNameLtr';

/**
 * Key of localized strings of Numbered list button
 */
export type NumberedListButtonStringKey = 'buttonNameNumberedList';

/**
 * Key of localized strings of Quote button
 */
export type QuoteButtonStringKey = 'buttonNameQuote';

/**
 * Key of localized strings of Redo button
 */
export type RedoButtonStringKey = 'buttonNameRedo';

/**
 * Key of localized strings of REmove link button
 */
export type RemoveLinkButtonStringKey = 'buttonNameRemoveLink';

/**
 * Key of localized strings of Right to left button
 */
export type RtlButtonStringKey = 'buttonNameRtl';

/**
 * Key of localized strings of Strikethrough button
 */
export type StrikethroughButtonStringKey = 'buttonNameStrikethrough';

/**
 * Key of localized strings of Subscript button
 */
export type SubscriptButtonStringKey = 'buttonNameSubscript';

/**
 * Key of localized strings of Superscript button
 */
export type SuperscriptButtonStringKey = 'buttonNameSuperscript';

/**
 * Key of localized strings of Text color button
 */
export type TextColorButtonStringKey = 'buttonNameTextColor' | TextColorKeys;

/**
 * Key of localized strings of Underline button
 */
export type UnderlineButtonStringKey = 'buttonNameUnderline';

/**
 * Key of localized strings of Undo button
 */
export type UndoButtonStringKey = 'buttonNameUndo';

/**
 * A public type for localized string keys of all buttons
 */
export type AllButtonStringKeys =
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
    | UndoButtonStringKey;
