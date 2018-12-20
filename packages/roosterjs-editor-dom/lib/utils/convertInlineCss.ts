import { HtmlSanitizer } from 'roosterjs-html-sanitizer';

/**
 * @deprecated Use HtmlSanitizer.convertInlineCss from roosterjs-html-sanitizer package instead
 * Convert global CSS to inline CSS and remove the global CSS
 * @param html The source HTML string
 * @param additionalStyleNodes Optional additional style nodes
 */
const convertInlineCss = HtmlSanitizer.convertInlineCss;
export default convertInlineCss;
