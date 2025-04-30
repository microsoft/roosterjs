import { convertInlineCss } from './convertInlineCss';
import { createDOMCreator } from '../../utils/domCreator';
import { createDomToModelContextForSanitizing } from './createDomToModelContextForSanitizing';
import { createEmptyModel, domToContentModel, parseFormat } from 'roosterjs-content-model-dom';
import { retrieveCssRules } from 'roosterjs-content-model-dom';
import type {
    ContentModelDocument,
    ContentModelSegmentFormat,
    DomToModelOptionForSanitizing,
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
    options?: Partial<DomToModelOptionForSanitizing>,
    trustedHTMLHandler?: TrustedHTMLHandler,
    defaultSegmentFormat?: ContentModelSegmentFormat
): ContentModelDocument {
    const doc = html ? createDOMCreator(trustedHTMLHandler).htmlToDOM(html) : null;

    if (doc?.body) {
        const context = createDomToModelContextForSanitizing(
            doc,
            defaultSegmentFormat,
            undefined /*defaultOptions*/,
            options
        );
        const cssRules = doc ? retrieveCssRules(doc) : [];

        convertInlineCss(doc, cssRules);
        parseFormat(doc.body, context.formatParsers.segmentOnBlock, context.segmentFormat, context);

        return domToContentModel(doc.body, context);
    } else {
        return createEmptyModel(defaultSegmentFormat);
    }
}
