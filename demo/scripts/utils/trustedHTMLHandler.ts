import * as DOMPurify from 'dompurify';

export function trustedHTMLHandler(html: string): string {
    const result = DOMPurify.sanitize(html, {
        ADD_TAGS: ['head', 'meta'],
        ADD_ATTR: ['name', 'content'],
        WHOLE_DOCUMENT: true,
        RETURN_TRUSTED_TYPE: true,
    });
    return <string>(<any>result);
}
