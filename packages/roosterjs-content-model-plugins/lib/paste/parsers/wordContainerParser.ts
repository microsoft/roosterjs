import type {
    ContentModelFormatContainerFormat,
    FormatParser,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Parser for processing container formatting specific to Word Desktop
 * Removes negative margin-left values which are commonly used in Word lists
 * @param format The container format to modify
 */
export const wordContainerParser: FormatParser<ContentModelFormatContainerFormat> = (
    format
): void => {
    if (format.marginLeft?.startsWith('-')) {
        delete format.marginLeft;
    }
};
