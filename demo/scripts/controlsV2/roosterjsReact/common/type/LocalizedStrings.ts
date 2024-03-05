/**
 * Represents a localized string map from the string key to the localized string or a function returns localized string
 */
export type LocalizedStrings<T extends string, V extends string = string> = {
    [key in T]?: V | (() => V);
};

/**
 * Localized string key for OK button
 */
export type OkButtonStringKey = 'buttonNameOK';

/**
 * Localized string key for Cancel button
 */
export type CancelButtonStringKey = 'buttonNameCancel';

/**
 * Localized string key for Cancel button menu splitter.
 * No need to localize this one as it will be replaced with a horizontal line
 */
export type MenuItemSplitterKey0 = '-';
