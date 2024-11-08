import type { ContentModelFormatState } from './ContentModelFormatState';

/**
 * Callback function type to merge the values of a specific format key
 * @param format The current retrieved format state
 * @param newValue The new format value to merge
 */
export type MergeFormatValueCallback = <K extends keyof ContentModelFormatState>(
    format: ContentModelFormatState,
    newValue: ContentModelFormatState[K] | undefined
) => void;

/**
 * Callbacks to customize the behavior of merging different format values from selected content
 * @param format The current retrieved format state
 * @param newValue The new format value to merge
 */
export type MergeFormatValueCallbacks = {
    [K in keyof ContentModelFormatState]?: MergeFormatValueCallback;
};
