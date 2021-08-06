import * as DOMPurify from 'dompurify';

const policy = !!window.trustedTypes
    ? window.trustedTypes.createPolicy('sanitizeHtml', {
          createHTML: (input: string) => DOMPurify.sanitize(input), //
      })
    : null;

const trustedHTMLHandler = policy
    ? (input: string) => <string>(<any>policy.createHTML(input))
    : (input: string) => input;

export { trustedHTMLHandler };
