/**
 * Item of input dialog
 */
export default interface DialogItem<Strings extends string> {
    /**
     * Localized string key of the input item name
     */
    labelKey: Strings | null;

    /**
     * Unlocalized string for the label text. This will be used when a valid localized string is not found using the given string key
     */
    unlocalizedLabel: string | null;

    /**
     * Initial value of this item
     */
    initValue: string;

    /**
     * Whether focus should be put into this item automatically
     */
    autoFocus?: boolean;
}
