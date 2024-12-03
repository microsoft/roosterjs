import type {
    DOMCreator,
    LegacyTrustedHTMLHandler,
    TrustedHTMLHandler,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function domCreator(trustedHTMLHandler?: TrustedHTMLHandler): DOMCreator {
    return trustedHTMLHandler && isDOMCreator(trustedHTMLHandler)
        ? trustedHTMLHandler
        : trustedHTMLHandlerToDOMCreator(trustedHTMLHandler as LegacyTrustedHTMLHandler);
}

/**
 * @internal
 */
export function isDOMCreator(
    trustedHTMLHandler: TrustedHTMLHandler
): trustedHTMLHandler is DOMCreator {
    return typeof (trustedHTMLHandler as DOMCreator).htmlToDOM === 'function';
}

/**
 * @internal
 */
export const defaultTrustHtmlHandler: LegacyTrustedHTMLHandler = (html: string) => {
    return html;
};

function trustedHTMLHandlerToDOMCreator(trustedHTMLHandler?: LegacyTrustedHTMLHandler): DOMCreator {
    const handler = trustedHTMLHandler || defaultTrustHtmlHandler;
    return {
        htmlToDOM: (html: string) => new DOMParser().parseFromString(handler(html), 'text/html'),
    };
}
