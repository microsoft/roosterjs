import { convertInlineCss, retrieveCssRules } from './convertInlineCss';
import { createDomToModelContextForSanitizing } from './createDomToModelContextForSanitizing';
import { createEmptyModel, domToContentModel, parseFormat } from 'roosterjs-content-model-dom';
import type {
    ContentModelDocument,
    ContentModelSegmentFormat,
    DomToModelOption,
    TrustedHTMLHandler,
} from 'roosterjs-content-model-types';

/**
 * Create Content Model from HTML string
 * @param html The source HTML string
 * @param options Options for DOM to Content Model conversion
 * @param trustedHTMLHandler A string handler to convert string to trusted string
 * @returns A Content Model Document object that contains the Content Model from the give HTML, or undefined if failed to parse the source HTML
 */
export function createModelFromHtml(
    html: string,
    options?: DomToModelOption,
    trustedHTMLHandler?: TrustedHTMLHandler,
    defaultSegmentFormat?: ContentModelSegmentFormat
): ContentModelDocument {
    const doc = html
        ? new DOMParser().parseFromString(trustedHTMLHandler?.(html) ?? html, 'text/html')
        : null;

    if (doc?.body) {
        const context = createDomToModelContextForSanitizing(doc, defaultSegmentFormat, options);
        const cssRules = doc ? retrieveCssRules(doc) : [];

        convertInlineCss(doc, cssRules);
        parseFormat(doc.body, context.formatParsers.segmentOnBlock, context.segmentFormat, context);

        return domToContentModel(doc.body, context);
    } else {
        return createEmptyModel(defaultSegmentFormat);
    }
}
