import { getStyles } from '../utils/getStyles';
import type {
    ContentModelFormatContainerFormat,
    FormatParser,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Parser for processing container formatting specific to Word Desktop
 * Removes list/container negative margins while preserving ordinary paragraph indentation.
 * @param format The container format to modify
 */
export const wordContainerParser: FormatParser<ContentModelFormatContainerFormat> = (
    format,
    element
): void => {
    const list = getStyles(element)['mso-list']?.trim().toLowerCase();
    const ordinaryParagraph =
        /^(P|H[1-6])$/.test(element.tagName) && !element.closest('li') && (!list || list == 'none');

    if (format.marginLeft?.startsWith('-') && !ordinaryParagraph) {
        delete format.marginLeft;
    }
};
