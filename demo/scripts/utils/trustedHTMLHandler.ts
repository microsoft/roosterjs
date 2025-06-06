import * as DOMPurify from 'dompurify';
import { DOMCreator } from 'roosterjs-content-model-types';

export const trustedHTMLHandler: DOMCreator = {
    htmlToDOM: (html: string) => {
        return DOMPurify.sanitize(html, {
            ADD_TAGS: ['head', 'meta', '#comment', 'iframe'],
            ADD_ATTR: ['name', 'content'],
            WHOLE_DOCUMENT: true,
            ALLOW_UNKNOWN_PROTOCOLS: true,
            RETURN_DOM: true,
        }).ownerDocument;
    },
};
