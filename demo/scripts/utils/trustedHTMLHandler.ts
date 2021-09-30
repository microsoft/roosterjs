import * as DOMPurify from 'dompurify';

const policy = !!window.trustedTypes
    ? window.trustedTypes.createPolicy('sanitizeHtml', {
          createHTML: (input: string) =>
              DOMPurify.sanitize(input, {
                  ADD_TAGS: ['head', 'meta'],
                  ADD_ATTR: ['name', 'content'],
                  WHOLE_DOCUMENT: true,
              }),
      })
    : null;

const trustedHTMLHandler = policy
    ? (input: string) => <string>(<any>policy.createHTML(input))
    : (input: string) => input;

export { trustedHTMLHandler };
