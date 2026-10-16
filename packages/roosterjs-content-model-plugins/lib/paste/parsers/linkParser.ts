import { isElementOfType, isUnsafeUrl } from 'roosterjs-content-model-dom';
import type { ContentModelHyperLinkFormat, FormatParser } from 'roosterjs-content-model-types';

const SUPPORTED_PROTOCOLS = ['http:', 'https:', 'notes:', 'mailto:', 'onenote:'];
const INVALID_LINKS_REGEX = /^file:\/\/\/[a-zA-Z\/]/i;

/**
 * @internal
 */
export const parseLink: FormatParser<ContentModelHyperLinkFormat> = (format, element) => {
    if (!isElementOfType(element, 'a')) {
        return;
    }

    // On an SVG anchor "href" is an SVGAnimatedString instead of a resolved URL string. Passing it
    // to the URL constructor always throws, which used to skip the protocol check altogether.
    const href =
        typeof element.href == 'string' ? element.href : element.getAttribute('href') ?? '';

    let url: URL | undefined;
    try {
        url = new URL(href);
    } catch {
        url = undefined;
    }

    if (
        isUnsafeUrl(href) ||
        (url && SUPPORTED_PROTOCOLS.indexOf(url.protocol) === -1) ||
        INVALID_LINKS_REGEX.test(href)
    ) {
        element.removeAttribute('href');
        format.href = '';
    }
};
