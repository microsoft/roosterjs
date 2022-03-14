/**
 * Represents a localized string map from the string key to the localized string or a function returns localized string
 */
export type LocalizedStrings<T extends string> = {
    [key in T]: string | (() => string);
};

/**
 * Localized string key for OK button
 */
export type OkButtonStringKey = 'buttonNameOK';

/**
 * Localized string key for Cancel button
 */
export type CancelButtonStringKey = 'buttonNameCancel';
