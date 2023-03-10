import { chainSanitizerCallback } from 'roosterjs-editor-dom';
import { HtmlSanitizerOptions } from 'roosterjs-editor-types';

const HTTP = 'http:';
const HTTPS = 'https:';
const NOTES = 'notes:';

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

    if (url && (url.protocol === HTTP || url.protocol === HTTPS || url.protocol === NOTES /* whitelist Notes protocol */)) {
        return link;
    }
    htmlElement.removeAttribute('href');
    return '';
}
