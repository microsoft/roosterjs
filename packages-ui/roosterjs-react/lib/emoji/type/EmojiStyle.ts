/**
 * Emoji pane style options
 */
export interface EmojiStyle {
    emojiPaneStyle?: Partial<EmojiPaneStyle>;
    emojiNavBarStyle?: Partial<EmojiNavBarStyle>;
    emojiStatusBarStyle?: Partial<EmojiStatusBarStyle>;
    emojiIconStyle?: Partial<EmojiIconStyle>;
}

/**
 * Emoji pane style options
 */
export interface EmojiPaneStyle {
    quickPickerClassName?: string;
    fullPickerClassName?: string;
    fullListClassName?: string;
    fullListContentClassName?: string;
    partialListClassName?: string;
    tooltipClassName?: string;
    searchInputAriaLabel?: string;
    searchPlaceholder?: string;
}

/**
 * Emoji nav bar style options
 */
export interface EmojiNavBarStyle {
    className?: string;
    buttonClassName?: string;
    selectedButtonClassName?: string;
    iconClassName?: string;
}

/**
 * Emoji icon style options
 */
export interface EmojiIconStyle {
    className?: string;
    selectedClassName?: string;
}

/**
 * Emoji status bar style options
 */
export interface EmojiStatusBarStyle {
    className?: string;
}
