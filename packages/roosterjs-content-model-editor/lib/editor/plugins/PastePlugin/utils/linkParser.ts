import { ContentModelHyperLinkFormat, FormatParser } from 'roosterjs-content-model-types';
import { safeInstanceOf } from 'roosterjs-editor-dom';

const SUPPORTED_PROTOCOLS = ['http:', 'https:', 'notes:', 'mailto:', 'onenote:'];
const INVALID_LINKS_REGEX = /^file:\/\/\/[a-zA-Z\/]/i;

/**
 * @internal
 */
export const parseLink: FormatParser<ContentModelHyperLinkFormat> = (format, element) => {
    if (!safeInstanceOf(element, 'HTMLAnchorElement')) {
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
