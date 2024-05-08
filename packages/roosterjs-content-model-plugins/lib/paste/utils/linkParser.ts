import { isElementOfType } from 'roosterjs-content-model-dom';
import type {
    ContentModelHyperLinkFormatCommon,
    FormatParser,
} from 'roosterjs-content-model-types';

const SUPPORTED_PROTOCOLS = ['http:', 'https:', 'notes:', 'mailto:', 'onenote:'];
const INVALID_LINKS_REGEX = /^file:\/\/\/[a-zA-Z\/]/i;

/**
 * @internal
 */
export const parseLink: FormatParser<ContentModelHyperLinkFormatCommon> = (format, element) => {
    if (!isElementOfType(element, 'a')) {
        return;
    }

    let url: URL | undefined;
    try {
        url = new URL(element.href);
    } catch {
        url = undefined;
    }

    if (
        (url && SUPPORTED_PROTOCOLS.indexOf(url.protocol) === -1) ||
        INVALID_LINKS_REGEX.test(element.href)
    ) {
        element.removeAttribute('href');
        format.href = '';
    }
};
