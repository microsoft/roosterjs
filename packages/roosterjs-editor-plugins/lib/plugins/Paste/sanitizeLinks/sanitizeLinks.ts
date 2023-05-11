import { chainSanitizerCallback } from 'roosterjs-editor-dom';
import { HtmlSanitizerOptions } from 'roosterjs-editor-types';

const SUPPORTED_PROTOCOLS = ['http:', 'https:', 'notes:', 'mailto:', 'onenote:'];

/**
 * @internal
 * Clear local paths and remove link
 * @param sanitizingOption the sanitizingOption of BeforePasteEvent
 * */
export default function sanitizeLinks(sanitizingOption: Required<HtmlSanitizerOptions>) {
    chainSanitizerCallback(
        sanitizingOption.attributeCallbacks,
        'href',
        (value: string, element: HTMLElement) => validateLink(value, element)
    );
}

function validateLink(link: string, htmlElement: HTMLElement) {
    let url;
    try {
        url = new URL(link);
    } catch {
        url = undefined;
    }

    /* whitelist supported protocols */
    if (url && SUPPORTED_PROTOCOLS.indexOf(url.protocol) > -1) {
        return link;
    }
    htmlElement.removeAttribute('href');
    return '';
}
